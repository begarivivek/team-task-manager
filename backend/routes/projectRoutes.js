const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');
const { validateProject } = require('../middleware/validation');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember
} = require('../controllers/projectController');

router.use(authenticateToken);

router.post('/', authorizeAdmin, validateProject, createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.put('/:id', authorizeAdmin, validateProject, updateProject);
router.delete('/:id', authorizeAdmin, deleteProject);
router.post('/:id/members', authorizeAdmin, addMember);
router.delete('/:id/members', authorizeAdmin, removeMember);

module.exports = router;
