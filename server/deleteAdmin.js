import mongoose from 'mongoose';
import { UserModel } from './models/UserModel.js';

const deleteAdmin = async () => {
    try {
        await mongoose.connect('mongodb+srv://Phuocri:Ri123456@cluster0.h4lfdxq.mongodb.net/shop', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        // Xóa tất cả các tài khoản admin cũ
        const result = await UserModel.deleteMany({ 
            $or: [
                { email: 'admin@example.com' },
                { email: 'admin123@example.com' }
            ]
        });
        
        console.log('Đã xóa tài khoản admin:', result);
        process.exit(0);
    } catch (error) {
        console.error('Lỗi:', error);
        process.exit(1);
    }
};

deleteAdmin(); 