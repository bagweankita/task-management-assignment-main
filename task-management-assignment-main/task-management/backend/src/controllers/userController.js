import User from '../models/User.js';

export async function listUsers(req, res, next) {
  try {
    const users = await User.find().select('name email role').sort({ name: 1 }).lean();
    res.json({ success: true, data: users });
  } catch (err) { next(err); }
}

export async function createUser(req, res, next) {
  try {
    const { name, email, role } = req.body;
    if (!name?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '')) {
      return res.status(400).json({ success: false, message: 'Valid name and email are required' });
    }
    const user = await User.create({ name, email, role });
    res.status(201).json({ success: true, data: user });
  } catch (err) { next(err); }
}
