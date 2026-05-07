const { ActivityLog } = require('../models');

const logActivity = async (req, res, next) => {
  // Store original send function
  const originalSend = res.send;
  
  // Override send function
  res.send = function(data) {
    // Only log for authenticated users on successful requests
    if (req.user && res.statusCode >= 200 && res.statusCode < 400) {
      // Determine action type
      let action = req.method;
      let entityType = 'unknown';
      let details = '';
      
      // Identify entity type from URL
      if (req.baseUrl.includes('/projects')) entityType = 'project';
      else if (req.baseUrl.includes('/tasks')) entityType = 'task';
      else if (req.baseUrl.includes('/users')) entityType = 'user';
      else if (req.baseUrl.includes('/auth')) entityType = 'auth';
      
      // Set details based on action
      if (action === 'POST') details = `Created new ${entityType}`;
      else if (action === 'PUT') details = `Updated ${entityType}`;
      else if (action === 'DELETE') details = `Deleted ${entityType}`;
      else if (action === 'GET') details = `Viewed ${entityType}`;
      
      // Get entity ID from request params or body
      let entityId = req.params.id || req.body.id || null;
      if (!entityId && data && data.id) {
        try {
          const parsedData = JSON.parse(data);
          entityId = parsedData.id;
        } catch(e) {}
      }
      
      // Save to database asynchronously (don't block response)
      ActivityLog.create({
        userId: req.user.id,
        action: action,
        entityType: entityType,
        entityId: entityId,
        details: details,
        ipAddress: req.ip || req.socket.remoteAddress
      }).catch(err => console.error('Error logging activity:', err));
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

module.exports = { logActivity };