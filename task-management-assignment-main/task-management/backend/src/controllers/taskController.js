import mongoose from 'mongoose';
import Task from '../models/Task.js';
import User from '../models/User.js';

export async function listTasks(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const { search, status, priority, assignee } = req.query;
    const sortBy = ['createdAt', 'updatedAt', 'dueDate', 'title', 'priority', 'status'].includes(req.query.sortBy) ? req.query.sortBy : 'createdAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;
    const filter = {};
    if (status && ['To Do', 'In Progress', 'Completed'].includes(status)) filter.status = status;
    if (priority && ['Low', 'Medium', 'High'].includes(priority)) filter.priority = priority;
    if (assignee && mongoose.isValidObjectId(assignee)) filter.assignee = assignee;
    if (search?.trim()) filter.$or = [
      { title: { $regex: search.trim(), $options: 'i' } },
      { description: { $regex: search.trim(), $options: 'i' } }
    ];

    const [tasks, total] = await Promise.all([
      Task.find(filter).populate('assignee', 'name email role')
        .sort({ [sortBy]: sortOrder }).skip((page - 1) * limit).limit(limit).lean(),
      Task.countDocuments(filter)
    ]);
    res.json({ success: true, data: tasks, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
}

export async function getTask(req, res, next) {
  try {
    const task = await Task.findById(req.params.id).populate('assignee', 'name email role');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) { next(err); }
}

export async function createTask(req, res, next) {
  try {
    const user = await User.findById(req.body.assignee);
    if (!user) return res.status(400).json({ success: false, message: 'Selected assignee does not exist' });
    const task = await Task.create(req.body);
    await task.populate('assignee', 'name email role');
    res.status(201).json({ success: true, message: 'Task created successfully', data: task });
  } catch (err) { next(err); }
}

export async function updateTask(req, res, next) {
  try {
    const user = await User.findById(req.body.assignee);
    if (!user) return res.status(400).json({ success: false, message: 'Selected assignee does not exist' });
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('assignee', 'name email role');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task updated successfully', data: task });
  } catch (err) { next(err); }
}

export async function deleteTask(req, res, next) {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) { next(err); }
}

export async function dashboard(req, res, next) {
  try {
    const [total, grouped, overdue] = await Promise.all([
      Task.countDocuments(),
      Task.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Task.countDocuments({ status: { $ne: 'Completed' }, dueDate: { $lt: new Date(new Date().setHours(0, 0, 0, 0)) } })
    ]);
    const counts = { 'To Do': 0, 'In Progress': 0, 'Completed': 0 };
    grouped.forEach(item => { counts[item._id] = item.count; });
    res.json({ success: true, data: { total, counts, overdue } });
  } catch (err) { next(err); }
}
