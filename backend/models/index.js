const sequelize = require('../config/database');
const User = require('./User');
const Project = require('./Project');
const Task = require('./Task');
const ProjectMember = require('./ProjectMember');
const ActivityLog = require('./ActivityLog');

// Define associations
User.belongsToMany(Project, { through: ProjectMember, foreignKey: 'userId', as: 'projects' });
Project.belongsToMany(User, { through: ProjectMember, foreignKey: 'projectId', as: 'members' });

Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks' });
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

User.hasMany(Task, { foreignKey: 'assignedTo', as: 'assignedTasks' });
Task.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });

User.hasMany(Project, { foreignKey: 'createdBy', as: 'createdProjects' });
Project.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(Task, { foreignKey: 'createdBy', as: 'createdTasks' });
Task.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// ActivityLog associations
User.hasMany(ActivityLog, { foreignKey: 'userId', as: 'activities' });
ActivityLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Project,
  Task,
  ProjectMember,
  ActivityLog
};