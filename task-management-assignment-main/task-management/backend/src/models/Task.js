import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true, minlength: 2, maxlength: 120 },
  description: { type: String, trim: true, maxlength: 2000, default: '' },
  status: { type: String, enum: ['To Do', 'In Progress', 'Completed'], default: 'To Do' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  dueDate: { type: Date, required: [true, 'Due date is required'] },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'Assignee is required'] }
}, { timestamps: true });

taskSchema.index({ title: 'text', description: 'text' });
taskSchema.index({ status: 1, priority: 1, dueDate: 1 });

export default mongoose.model('Task', taskSchema);
