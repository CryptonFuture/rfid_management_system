const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Location = require('./models/Location');
const RfidTag = require('./models/RfidTag');
const Asset = require('./models/Asset');
const Scan = require('./models/Scan');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rfid_management');
  console.log('MongoDB Connected for seeding...');
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Promise.all([
      User.deleteMany(),
      Location.deleteMany(),
      RfidTag.deleteMany(),
      Asset.deleteMany(),
      Scan.deleteMany()
    ]);
    console.log('Cleared existing data');

    // Create Admin User
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@rfid.com',
      password: 'admin123',
      role: 'admin'
    });

    const operator = await User.create({
      name: 'Operator User',
      email: 'operator@rfid.com',
      password: 'operator123',
      role: 'operator'
    });

    console.log('Users created');

    // Locations
    const locations = await Location.insertMany([
      { name: 'Main Warehouse', building: 'Building A', floor: 'Ground', room: 'WH-01' },
      { name: 'IT Department', building: 'Building B', floor: '2nd', room: 'IT-201' },
      { name: 'Office Floor 1', building: 'Building B', floor: '1st', room: 'OF-101' },
      { name: 'Server Room', building: 'Building A', floor: 'Basement', room: 'SR-01' },
      { name: 'Meeting Room Alpha', building: 'Building B', floor: '3rd', room: 'MR-301' }
    ]);
    console.log('Locations created');

    // RFID Tags
    const tags = await RfidTag.insertMany([
      { uid: 'A1B2C3D4', type: 'passive', status: 'available', createdBy: admin._id },
      { uid: 'E5F6A7B8', type: 'passive', status: 'available', createdBy: admin._id },
      { uid: 'C9D0E1F2', type: 'passive', status: 'available', createdBy: admin._id },
      { uid: '12345678', type: 'passive', status: 'available', createdBy: admin._id },
      { uid: '87654321', type: 'active', status: 'available', createdBy: admin._id },
      { uid: 'AABBCCDD', type: 'passive', status: 'available', createdBy: admin._id },
      { uid: '11223344', type: 'passive', status: 'available', createdBy: admin._id },
      { uid: '55667788', type: 'passive', status: 'available', createdBy: admin._id }
    ]);
    console.log('RFID Tags created');

    // Assets
    const assets = await Asset.insertMany([
      {
        name: 'Dell Laptop XPS 15',
        description: 'High performance laptop for development',
        category: 'Electronics',
        serialNumber: 'DLXPS15-001',
        location: locations[1]._id,
        rfidTag: tags[0]._id,
        status: 'in-use',
        purchaseDate: new Date('2024-01-15'),
        purchasePrice: 1850,
        assignedTo: 'John Doe',
        createdBy: admin._id
      },
      {
        name: 'HP LaserJet Printer',
        description: 'Office laser printer',
        category: 'Electronics',
        serialNumber: 'HPLJ-4520',
        location: locations[2]._id,
        rfidTag: tags[1]._id,
        status: 'available',
        purchaseDate: new Date('2023-06-20'),
        purchasePrice: 450,
        createdBy: admin._id
      },
      {
        name: 'Conference Table',
        description: 'Large wooden conference table',
        category: 'Furniture',
        serialNumber: 'CT-WOOD-01',
        location: locations[4]._id,
        rfidTag: tags[2]._id,
        status: 'available',
        purchasePrice: 1200,
        createdBy: admin._id
      },
      {
        name: 'Network Switch Cisco',
        description: '48-port gigabit switch',
        category: 'Electronics',
        serialNumber: 'CISCO-SW48',
        location: locations[3]._id,
        rfidTag: tags[3]._id,
        status: 'in-use',
        purchaseDate: new Date('2023-11-10'),
        purchasePrice: 2200,
        createdBy: admin._id
      },
      {
        name: 'Office Chair Ergonomic',
        category: 'Furniture',
        serialNumber: 'OC-ERG-12',
        location: locations[2]._id,
        status: 'available',
        purchasePrice: 350,
        createdBy: admin._id
      },
      {
        name: 'Projector Epson',
        category: 'Electronics',
        serialNumber: 'EP-PROJ-88',
        location: locations[4]._id,
        rfidTag: tags[4]._id,
        status: 'available',
        purchasePrice: 890,
        createdBy: admin._id
      }
    ]);

    // Update tags status for assigned ones
    await RfidTag.findByIdAndUpdate(tags[0]._id, { status: 'assigned', asset: assets[0]._id });
    await RfidTag.findByIdAndUpdate(tags[1]._id, { status: 'assigned', asset: assets[1]._id });
    await RfidTag.findByIdAndUpdate(tags[2]._id, { status: 'assigned', asset: assets[2]._id });
    await RfidTag.findByIdAndUpdate(tags[3]._id, { status: 'assigned', asset: assets[3]._id });
    await RfidTag.findByIdAndUpdate(tags[4]._id, { status: 'assigned', asset: assets[5]._id });

    console.log('Assets created and tags assigned');

    // Some sample scans
    await Scan.insertMany([
      {
        rfidTag: tags[0]._id,
        uid: tags[0].uid,
        asset: assets[0]._id,
        location: locations[1]._id,
        scannedBy: operator._id,
        readerId: 'READER-01',
        action: 'check-in'
      },
      {
        rfidTag: tags[1]._id,
        uid: tags[1].uid,
        asset: assets[1]._id,
        location: locations[2]._id,
        scannedBy: admin._id,
        readerId: 'WEB-SIM',
        action: 'inventory'
      },
      {
        rfidTag: tags[3]._id,
        uid: tags[3].uid,
        asset: assets[3]._id,
        location: locations[3]._id,
        scannedBy: operator._id,
        readerId: 'READER-02',
        action: 'locate'
      }
    ]);

    console.log('Sample scans created');
    console.log('\n✅ Seed completed successfully!');
    console.log('-----------------------------------');
    console.log('Admin Login:');
    console.log('  Email: admin@rfid.com');
    console.log('  Password: admin123');
    console.log('Operator Login:');
    console.log('  Email: operator@rfid.com');
    console.log('  Password: operator123');
    console.log('-----------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();