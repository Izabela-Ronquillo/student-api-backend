const connectToDatabase = require('../db');
const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({}, { timestamps: true, collection: 'daily_attendance', strict: false });
const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await connectToDatabase();
    const id = req.query.id;

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const updated = await Attendance.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      const deleted = await Attendance.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: 'Not found' });
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database operation failed' });
  }
};
