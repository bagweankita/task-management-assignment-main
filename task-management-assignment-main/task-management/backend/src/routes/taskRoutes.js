import { Router } from 'express';
import { createTask, dashboard, deleteTask, getTask, listTasks, updateTask } from '../controllers/taskController.js';
import { validate } from '../middleware/validate.js';
import { taskIdValidator, taskValidator } from '../validators/taskValidators.js';

const router = Router();
router.get('/dashboard', dashboard);
router.get('/', listTasks);
router.post('/', taskValidator, validate, createTask);
router.get('/:id', taskIdValidator, validate, getTask);
router.put('/:id', [...taskIdValidator, ...taskValidator], validate, updateTask);
router.delete('/:id', taskIdValidator, validate, deleteTask);
export default router;
