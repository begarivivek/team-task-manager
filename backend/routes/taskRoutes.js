const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');
const { validateTask } = require('../middleware/validation');
const {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

router.use(authenticateToken);

router.post('/', authorizeAdmin, validateTask, createTask);
router.get('/project/:projectId', getTasksByProject);
router.put('/:id', updateTask);
router.delete('/:id', authorizeAdmin, deleteTask);

module.exports = router;
