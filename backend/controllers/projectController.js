const { Project, User, Task, ProjectMember, sequelize } = require('../models');

const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const project = await Project.create({
      title,
      description,
      createdBy: req.user.id
    });

    // Add creator as a member
    await ProjectMember.create({
      projectId: project.id,
      userId: req.user.id
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    let projects;
    
    if (req.user.role === 'Admin') {
      projects = await Project.findAll({
        include: [
          { model: User, as: 'members', attributes: ['id', 'name', 'email'] },
          { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
        ]
      });
    } else {
      projects = await Project.findAll({
        include: [
          { model: User, as: 'members', attributes: ['id', 'name', 'email'], where: { id: req.user.id }, required: true },
          { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
        ]
      });
    }
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: 'members', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: Task, as: 'tasks', include: [
          { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] }
        ]}
      ]
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (req.user.role !== 'Admin' && project.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }
    
    await project.update(req.body);
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project', error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Only admins can delete projects' });
    }
    
    await project.destroy();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
};

const addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findByPk(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const existing = await ProjectMember.findOne({
      where: { projectId: project.id, userId }
    });
    
    if (existing) {
      return res.status(400).json({ message: 'User already in project' });
    }
    
    await ProjectMember.create({
      projectId: project.id,
      userId
    });
    
    res.json({ message: 'Member added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding member', error: error.message });
  }
};

const removeMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findByPk(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.createdBy === userId) {
      return res.status(400).json({ message: 'Cannot remove project creator' });
    }
    
    await ProjectMember.destroy({
      where: { projectId: project.id, userId }
    });
    
    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing member', error: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember
};
