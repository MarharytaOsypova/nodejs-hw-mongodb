import createError from "http-errors";
import { Sessions } from "../models/session.js";
import { Users } from "../models/auth.js";

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    next(createError(401, 'Please provide Authorization header'));
    return;
  }

  const bearer = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];

  if (bearer !== 'Bearer' || !token) {
    next(createError(401, 'Auth header should be of type Bearer'));
    return;
  }

  const session = await Sessions.findOne({ accessToken: token });

  if (!session) {
    next(createError(401, 'Session not found'));
    return;
  }

  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  if (isAccessTokenExpired) {
    next(createError(401, 'Access token expired'));
  }

  const user = await Users.findById(session.userId);

  if (!user) {
    next(createError(401));
    return;
  }

  req.user = user;

  next();
};