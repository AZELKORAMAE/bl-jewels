require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('Error: MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

console.log('Attempting to connect to:', uri.split('@')[1]); // Log only the host part for security

mongoose.connect(uri)
    .then(() => {
        console.log('✅ Successfully connected to MongoDB Atlas!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Connection failed!');
        console.error('Error Details:', err.message);
        if (err.message.includes('IP not whitelisted') || err.message.includes('Could not connect to any servers')) {
            console.error('\nTIP: Make sure your IP address is whitelisted in MongoDB Atlas (Network Access).');
        }
        if (err.message.includes('Authentication failed')) {
            console.error('\nTIP: Check your password in .env.local.');
        }
        process.exit(1);
    });
