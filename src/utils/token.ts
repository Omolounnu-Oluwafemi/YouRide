import jwt from 'jsonwebtoken';
 
// Generates a JSON Web Token (JWT) for a user.
export const signToken = (id: string): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN;

  if (!secret || !expiresIn) {
    throw new Error('JWT secret or expiration time not provided');
  }
  const token = jwt.sign({ id }, secret, { expiresIn });

  return token;
};

export const signAdminToken = (id: string, role: string): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN;

  if (!secret || !expiresIn) {
    throw new Error('JWT secret or expiration time not provided');
  }
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

 export const generateVerificationCode = (): number  => {
      return Math.floor(1000 + Math.random() * 9000);
}