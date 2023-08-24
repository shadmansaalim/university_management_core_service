// Imports
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

// Function to creat jwt token
const createToken = (
  payload: {
    id: string;
    role: string;
  },
  secret: Secret,
  expiresIn: string
) => {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
};

// Function to verify jwt token
const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const JwtHelpers = { createToken, verifyToken };
