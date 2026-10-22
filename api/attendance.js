const connectToDatabase = require('../db');
const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({}, { timestamps: true, collection: 'daily_attendance', strict: false });

const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();

    if (req.method === 'GET') {
      const records = await Attendance.find({}).sort({ createdAt: -1 });
      return res.status(200).json(records);
    }

    if (req.method === 'POST') {
      const newRecord = await Attendance.create(req.body);
      return res.status(201).json(newRecord);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database connection failed' });
  }
};