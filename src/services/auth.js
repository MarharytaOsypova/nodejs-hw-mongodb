import { Users } from "../models/auth.js";
import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import createError from "http-errors";
import { Sessions } from './../models/session.js';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from "../constants/token.js";

export const registerUser = async (payload) => {
  const user = await Users.findOne({ email: payload.email });
  if (user) throw createError(409, 'Email in use');
  
  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await Users.create({
    ...payload,
    password: encryptedPassword,
  });
};


export const loginUser = async (payload) => {
  const user = await Users.findOne({ email: payload.email });
  if (!user) {
    throw createError(401, 'Unauthorized');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createError(401, 'Unauthorized');
  }

  await Sessions.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await Sessions.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
};