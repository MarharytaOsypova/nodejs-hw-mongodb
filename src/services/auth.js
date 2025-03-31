import * as fs from "node:fs";
import path from "node:path";
import { Users } from "../models/auth.js";
import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import createError from "http-errors";
import { Sessions } from './../models/session.js';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from "../constants/token.js";
import { getEnvVar } from './../utils/getEnvVar.js';
import { SMTP } from './../constants/index.js';
import { sendEmail } from "../utils/sendEmail.js";
import jwt from 'jsonwebtoken';
import handlebars from "handlebars";


const RESET_PASSWORD_TEMPLATE = fs.readFileSync(
  path.resolve("src/templates/reset-password-email.hbs"),
  {encoding: "UTF-8"},
);



export const registerUser = async (payload) => {
  const user = await Users.findOne({ email: payload.email });
  if (user) throw createError(409, 'Email in use');
  
  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await Users.create({
    ...payload,
    password: encryptedPassword,
  });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
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

  const newSession = createSession();

  return await Sessions.create({
    userId: user._id,
    ...newSession,
  });
};


 

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await Sessions.findOne({ _id: sessionId, refreshToken });

  if (!session) {
    throw createError(401, 'Session not found');
  }

  if (new Date() > new Date(session.refreshTokenValidUntil)) {
    throw createError(401, 'Session token expired');
  }

  const newSession = createSession();

  await Sessions.deleteOne({ _id: sessionId, refreshToken });

  return await Sessions.create({
    userId: session.userId,
    ...newSession,
  });
};


export const logoutUser = async (sessionId) => {
  await Sessions.deleteOne({ _id: sessionId });
};


export const sendResetToken = async (email) => {
  const user = await Users.findOne({ email });
  if (!user) {
    throw createError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const appDomain = getEnvVar('APP_DOMAIN'); 
  const resetLink = `${appDomain}/reset-password?token=${resetToken}`;
  
  const templates = handlebars.compile(RESET_PASSWORD_TEMPLATE);

 try {
    await sendEmail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html: templates({resetLink}),
    });
  } catch (error) {
    throw createError(500, 'Failed to send the email, please try again later.');
  }
};


export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
   throw createError(401, 'Token is expired or invalid.');
  }

  const user = await Users.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await Users.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};