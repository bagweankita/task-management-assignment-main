import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Task from './models/Task.js';

await connectDB();
let users = await User.find();
if (!users.length) {
  users = await User.insertMany([
    { name: 'Ankita Bagwe', email: 'ankita@example.com', role: 'Frontend Developer' },
    { name: 'Rahul Sharma', email: 'rahul@example.com', role: 'Backend Developer' },
    { name: 'Priya Patel', email: 'priya@example.com', role: 'QA Engineer' },
    { name: 'Amit Shah', email: 'amit@example.com', role: 'Project Manager' }
  ]);
}
if (!(await Task.countDocuments())) {
  const today = new Date();
  const date = days => new Date(today.getFullYear(), today.getMonth(), today.getDate() + days);
  await Task.insertMany([
    { title: 'Build dashboard overview', description: 'Create dashboard cards and status summary.', status: 'In Progress', priority: 'High', dueDate: date(2), assignee: users[0]._id },
    { title: 'Implement task API', description: 'Add CRUD endpoints and validation.', status: 'Completed', priority: 'High', dueDate: date(-2), assignee: users[1]._id },
    { title: 'Test task filters', description: 'Verify search, sorting and pagination.', status: 'To Do', priority: 'Medium', dueDate: date(-1), assignee: users[2]._id },
    { title: 'Prepare sprint notes', description: 'Summarize scope for the next sprint.', status: 'To Do', priority: 'Low', dueDate: date(5), assignee: users[3]._id }
  ]);
}
console.log('Seed completed.');
await mongoose.disconnect();
