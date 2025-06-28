import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserModel } from './models/UserModel.js';

const createAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect('mongodb+srv://Phuocri:Ri123456@cluster0.h4lfdxq.mongodb.net/shop', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Kiểm tra xem tài khoản admin đã tồn tại chưa
        const existingAdmin = await UserModel.findOne({ email: 'admin123@example.com' });
        if (existingAdmin) {
            console.log('Admin account already exists:', existingAdmin);
            process.exit(0);
        }

        // Hash password
        console.log('Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        console.log('Password hashed');

        // Tạo admin user trực tiếp trong database
        console.log('Creating admin user...');
        const adminUser = await UserModel.create({
            name: 'Admin',
            email: 'admin123@example.com',
            password: hashedPassword,
            isAdmin: true
        });

        console.log('Admin account created successfully:', adminUser);
        
        // Verify the created account
        const verifyAdmin = await UserModel.findOne({ email: 'admin123@example.com' });
        console.log('Verified admin account:', verifyAdmin);
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin account:', error);
        process.exit(1);
    }
};

createAdmin(); 