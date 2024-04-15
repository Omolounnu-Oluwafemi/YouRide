"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleStaffActiveStatus = exports.updateProfilePicture = exports.changeTempPassword = exports.AdminLogin = exports.CreateAdmin = void 0;
const admin_1 = require("../models/admin");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const email_1 = require("../utils/email");
const token_1 = require("../utils/token");
const middleware_1 = require("../utils/middleware");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const uploadToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cloudinary_1.default.uploader.upload(file.path);
    return result.secure_url;
});
const CreateAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tempPassword = (0, middleware_1.generateTempPassword)();
        const adminId = (0, uuid_1.v4)();
        const { firstName, lastName, role, email } = req.body;
        const existingAdmin = yield admin_1.Admin.findOne({ where: { email: email } });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Admin with this email already exists' });
        }
        // Hash the password
        let hashedPassword;
        try {
            hashedPassword = yield bcrypt_1.default.hash(tempPassword, 10);
        }
        catch (error) {
            console.error('Error hashing password:', error);
            return res.status(500).json({ error: 'Error hashing password' });
        }
        // Create a new admin
        let newAdmin;
        try {
            newAdmin = yield admin_1.Admin.create({
                adminId,
                firstName,
                lastName,
                role,
                email,
                password: hashedPassword
            });
        }
        catch (error) {
            console.error('Error creating admin:', error);
            return res.status(500).json({ error: 'Error creating admin' });
        }
        // Send an email with the temporary password
        try {
            yield (0, email_1.sendTemporaryPassword)(email, tempPassword);
        }
        catch (error) {
            console.error('Error sending temporary password:', error);
            return res.status(500).json({ error: 'Error sending temporary password' });
        }
        res.status(201).json({
            message: "New User created",
            data: { newAdmin }
        });
    }
    catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
});
exports.CreateAdmin = CreateAdmin;
const AdminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const admin = yield admin_1.Admin.findOne({ where: { email: email } });
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        // Check the password
        const passwordMatch = yield bcrypt_1.default.compare(password, admin.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        // Generate a JWT
        const token = (0, token_1.signAdminToken)(admin.adminId, admin.role);
        // Save the token in a cookie
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({
            message: 'Login successful',
            token
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error Signing Admin in' });
    }
});
exports.AdminLogin = AdminLogin;
const changeTempPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, tempPassword, newPassword } = req.body;
        const admin = yield admin_1.Admin.findOne({ where: { email: email } });
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        // Check if the temporary password is correct
        const passwordMatch = yield bcrypt_1.default.compare(tempPassword, admin.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid temporary password' });
        }
        // Check if the new password is the same as the current password
        const newPasswordMatch = yield bcrypt_1.default.compare(newPassword, admin.password);
        if (newPasswordMatch) {
            return res.status(400).json({ message: 'New password cannot be the same as the current password' });
        }
        // Hash the new password
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        // Update the admin's password
        admin.password = hashedPassword;
        yield admin.save();
        res.status(200).json({ message: 'Password changed successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error changing password' });
    }
});
exports.changeTempPassword = changeTempPassword;
const updateProfilePicture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(403).json({ error: 'No token provided' });
        }
        let decoded;
        try {
            decoded = (0, token_1.verifyAdminToken)(token);
        }
        catch (error) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        const adminId = decoded.id;
        const profilePictureFile = req.file;
        const admin = yield admin_1.Admin.findOne({ where: { adminId: adminId } });
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        let profilePictureUrl;
        try {
            if (profilePictureFile) {
                profilePictureUrl = yield uploadToCloudinary(profilePictureFile);
            }
            else {
                throw new Error('Profile picture file is undefined');
            }
        }
        catch (error) {
            return res.status(500).json({ error: 'Failed to upload image' });
        }
        admin.image = profilePictureUrl;
        try {
            yield admin.save();
        }
        catch (error) {
            return res.status(500).json({ error: 'Failed to update admin profile' });
        }
        res.status(200).json({ message: 'Profile picture updated successfully', admin });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating profile picture' });
    }
});
exports.updateProfilePicture = updateProfilePicture;
const toggleStaffActiveStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(403).json({ error: 'No token provided' });
        }
        // Verify and decode the token
        const decoded = (0, token_1.verifyAdminToken)(token);
        const adminId = decoded.id;
        const { action } = req.body;
        const admin = yield admin_1.Admin.findOne({ where: { adminId: adminId } });
        if (!admin) {
            return res.status(404).json({ error: 'Staff not found' });
        }
        if (action === 'activate') {
            admin.isActive = true;
        }
        else if (action === 'deactivate') {
            admin.isActive = false;
        }
        else {
            return res.status(400).json({ error: 'Invalid action' });
        }
        yield admin.save();
        res.status(200).json({ message: `Admin ${action}d successfully`, admin });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating admin status' });
    }
});
exports.toggleStaffActiveStatus = toggleStaffActiveStatus;
