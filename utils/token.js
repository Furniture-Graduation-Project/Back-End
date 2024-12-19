import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: '60m',
  });

  res.cookie('accessToken', token, {
    maxAge: 30 * 60 * 1000,
    httpOnly: true,
    sameSite: process.env.SAME_SITE,
    secure: process.env.NODE_ENV !== 'development',
  });

  return token;
};

export const generateRefreshToken = (userId, res) => {
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_SECRET_KEY, {
    expiresIn: '7d',
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: process.env.SAME_SITE,
    secure: process.env.NODE_ENV !== 'development',
  });

  return refreshToken;
};
export const clearCookies = (res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    sameSite: process.env.SAME_SITE,
    secure: process.env.NODE_ENV !== 'development',
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: process.env.SAME_SITE,
    secure: process.env.NODE_ENV !== 'development',
  });
};

export const createToken = (user) => {
  return jwt.sign({ email: user.email, id: user._id }, process.env.SECRET_KEY, {
    expiresIn: '1h',
  });
};
