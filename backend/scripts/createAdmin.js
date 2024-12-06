require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function createAdminUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        
        const existingAdmin = await User.findOne({ username: process.env.ADMIN_USERNAME });
        if (existingAdmin) {
            existingAdmin.password = hashedPassword;
            await existingAdmin.save();
            console.log('Admin password updated successfully');
            return;
        }

        const adminUser = new User({
            username: process.env.ADMIN_USERNAME,
            password: hashedPassword
        });

        await adminUser.save();
        console.log('Admin user created successfully');
        
    } catch (error) {
        console.error('Error creating admin user:', error);
        if (error.name === 'MongooseServerSelectionError') {
            console.log('\nTroubleshooting steps:');
            console.log('1. Ensure MongoDB is installed and running');
            console.log('2. Check if MongoDB service is started');
            console.log('3. Verify MongoDB is listening on port 27017');
            console.log('4. Try using 127.0.0.1 instead of localhost');
        }
    } finally {
        await mongoose.connection.close();
    }
}

createAdminUser();
