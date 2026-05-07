const { Task, Project, User } = require('../models');

const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, priority, dueDate } = req.body;
    
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo,
      priority: priority || 'Medium',
      dueDate,
      createdBy: req.user.id,
      status: 'Pending'
    });
    
    const taskWithRelations = await Task.findByPk(task.id, {
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ]
    });
    
    res.status(201).json(taskWithRelations);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

const getTasksByProject = async (req, res) => {
  try {
    let whereCondition = { projectId: req.params.projectId };
    
    // If user is not Admin, only show tasks assigned to them
    if (req.user.role !== 'Admin') {
      whereCondition.assignedTo = req.user.id;
    }
    
    const tasks = await Task.findAll({
      where: whereCondition,
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    const isAdmin = req.user.role === 'Admin';
    const isAssignedUser = task.assignedTo === req.user.id;
    
    // Check if this is a status-only update
    const isStatusOnlyUpdate = req.body.status && Object.keys(req.body).length === 1;
    
    // Case 1: Member trying to update only status of their assigned task
    if (!isAdmin && isStatusOnlyUpdate && isAssignedUser) {
      await task.update({ status: req.body.status });
    }
    // Case 2: Member trying to update anything else or not assigned task
    else if (!isAdmin && !isStatusOnlyUpdate) {
      return res.status(403).json({ message: 'Members can only update task status' });
    }
    else if (!isAdmin && !isAssignedUser) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }
    // Case 3: Admin can update anything
    else if (isAdmin) {
      await task.update(req.body);
    }
    else {
      return res.status(403).json({ message: 'Not authorized for this update' });
    }
    
    const updatedTask = await Task.findByPk(task.id, {
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ]
    });
    
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Only admins can delete tasks' });
    }
    
    await task.destroy();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};

module.exports = {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask
};