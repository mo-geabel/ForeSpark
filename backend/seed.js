const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./Models/User');

dotenv.config();

// ─── Admin Credentials ───────────────────────────────────────
// Change these before running!
const ADMIN_EMAIL    = 'admin@forestspark.com';
const ADMIN_PASSWORD = 'Admin@123';
const ADMIN_NAME     = 'Admin';
// ──────────────────────────────────────────────────────────────

const seedAdmin = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      console.log('⚠️  Admin already exists with this email. Updating role to admin...');
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('✅ Existing user promoted to admin.');
    } else {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

      // Create admin user
      const admin = new User({
        fullName: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
      });

      await admin.save();
      console.log('✅ Admin user created successfully!');
    }

    console.log('');
    console.log('╔══════════════════════════════════════════╗');
    console.log('║        🔑 ADMIN LOGIN CREDENTIALS        ║');
    console.log('╠══════════════════════════════════════════╣');
    console.log(`║  Email:    ${ADMIN_EMAIL.padEnd(29)}║`);
    console.log(`║  Password: ${ADMIN_PASSWORD.padEnd(29)}║`);
    console.log('╚══════════════════════════════════════════╝');
    console.log('');

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seedAdmin();
