import jwt from 'jsonwebtoken';
import { Request } from 'express';
 
export const signToken = (id: string): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN;

  if (!secret || !expiresIn) {
    throw new Error('JWT secret or expiration time not provided');
  }
  const token = jwt.sign({ id }, secret, { expiresIn });

  return token;
};

export const signAdminToken = (adminId: string, role: string): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN;

  if (!secret || !expiresIn) {
    throw new Error('JWT secret or expiration time not provided');
  }
  const id =  adminId;
  const token = jwt.sign({ id, role }, secret, { expiresIn });

  return token;
};

export const verifyAdminToken = (token: string): any => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT secret not provided');
  }

  try {
    const decoded = jwt.verify(token, secret);
  
    return decoded;
  } catch (error) {
    console.error(error);
    throw new Error('Invalid token');
  }
};

export const decodeDriverIdFromToken = (req: Request) => {
  try {
    const secret = process.env.JWT_SECRET;
    const token = req.cookies.token;

  if (!token) {
    throw new Error('No token provided in cookies');
  }

  if (!secret) {
    throw new Error('JWT secret not provided');
  }

    const decoded = jwt.verify(token, secret) as { id: string };
    const driverId = decoded.id;

  return driverId;
  }
  catch (error) {
    console.error(error);
    throw new Error('Invalid token');
  }

};
export const decodeUserIdFromToken = (req: Request) => {
  try {
    const secret = process.env.JWT_SECRET;
    const token = req.cookies.token;

  if (!token) {
    throw new Error('No token provided in cookies');
  }

  if (!secret) {
    throw new Error('JWT secret not provided');
  }

    const decoded = jwt.verify(token, secret) as { id: string };
    const userId = decoded.id;

  return userId;
  }
  catch (error) {
    console.error(error);
    throw new Error('Invalid token');
  }

};
export const decodeAdminIdFromToken = (req: Request) => {
  try {
    const secret = process.env.JWT_SECRET;
    const token = req.cookies.token;

  if (!token) {
    throw new Error('No token provided in cookies');
  }

  if (!secret) {
    throw new Error('JWT secret not provided');
  }

    const decoded = jwt.verify(token, secret) as { id: string };
    const adminId = decoded.id;

  return adminId;
  }
  catch (error) {
    console.error(error);
    throw new Error('Invalid token');
  }
};

 export const generateVerificationCode = (): number  => {
      return Math.floor(1000 + Math.random() * 9000);
}