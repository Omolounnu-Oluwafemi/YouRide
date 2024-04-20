import { Request, Response } from 'express';
import { Admin } from '../../models/admin';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from "uuid";
import { sendTemporaryPassword } from '../../utils/email';
import { signAdminToken, verifyAdminToken } from '../../utils/token';
import { generateTempPassword } from '../../utils/middleware'
import cloudinary  from '../../utils/cloudinary';

const uploadToCloudinary = async (file: Express.Multer.File) => {
  const result = await cloudinary.uploader.upload(file.path);
  return result.secure_url;
};

export const CreateAdmin = async (req: Request, res: Response) => {
  try {
    const tempPassword: string = generateTempPassword();
    const adminId = uuidv4();
    const { firstName, lastName, role, email } = req.body;

    const existingAdmin = await Admin.findOne({ where: { email: email } });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin with this email already exists' });
    }

    // Hash the password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(tempPassword, 10);
    } catch (error) {
      console.error('Error hashing password:', error);
      return res.status(500).json({ error: 'Error hashing password' });
    }

    // Create a new admin
    let newAdmin;
    try {
      newAdmin = await Admin.create({
        adminId,
        firstName,
        lastName,
        role,
        email,
        password: hashedPassword
      });
    } catch (error) {
      console.error('Error creating admin:', error);
      return res.status(500).json({ error: 'Error creating admin' });
    }

    // Send an email with the temporary password
    try {
      await sendTemporaryPassword(email, tempPassword);
    } catch (error) {
      console.error('Error sending temporary password:', error);
      return res.status(500).json({ error: 'Error sending temporary password' });
    }

    res.status(201).json({
      message: "New User created",
      data: { newAdmin }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};

export const AdminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email: email} });

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Check the password
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

      // Generate a JWT
      const token = signAdminToken(admin.adminId, admin.role)
    
      // Save the token in a cookie
      res.cookie('token', token, { httpOnly: true });

    res.status(200).json({
      message: 'Login successful',
      token
    });
} catch (error) {
   console.error(error);
   res.status(500).json({ error: 'Error Signing Admin in' });
}
};

export const changeTempPassword = async (req: Request, res: Response) => {
  try {
    const { email, tempPassword, newPassword } = req.body;

    const admin = await Admin.findOne({ where: { email: email } });
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Check if the temporary password is correct
    const passwordMatch = await bcrypt.compare(tempPassword, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid temporary password' });
    }

    // Check if the new password is the same as the current password
    const newPasswordMatch = await bcrypt.compare(newPassword, admin.password);

    if (newPasswordMatch) {
      return res.status(400).json({ message: 'New password cannot be the same as the current password' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the admin's password
    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error changing password' });
  }
};

export const updateProfilePicture = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(403).json({ error: 'No token provided' });
    }

    let decoded;
    try {
      decoded = verifyAdminToken(token);
    } catch (error) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    const adminId = decoded.id;

    const profilePictureFile = req.file;

    const admin = await Admin.findOne({ where: { adminId: adminId } });

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    let profilePictureUrl;
    try {
      if (profilePictureFile) {
        profilePictureUrl = await uploadToCloudinary(profilePictureFile);
      } else {
        throw new Error('Profile picture file is undefined');
      }
    } catch (error) {
      return res.status(500).json({ error: 'Failed to upload image' });
    }

    admin.image = profilePictureUrl;
    try {
      await admin.save();
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update admin profile' });
    }

    res.status(200).json({ message: 'Profile picture updated successfully', admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating profile picture' });
  }
};
export const toggleStaffActiveStatus = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(403).json({ error: 'No token provided' });
    }

    // Verify and decode the token
    const decoded = verifyAdminToken(token);
    const adminId = decoded.id; 

    const { action } = req.body; 

    const admin = await Admin.findOne({ where: { adminId: adminId } });

    if (!admin) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    if (action === 'activate') {
      admin.isActive = true;
    } else if (action === 'deactivate') {
      admin.isActive = false;
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }

    await admin.save();

    res.status(200).json({ message: `Admin ${action}d successfully`, admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating admin status' });
  }
};

