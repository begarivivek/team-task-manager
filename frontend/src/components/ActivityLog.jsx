import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, User, PlusCircle, Edit, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get(API_URL + '/activities');
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'POST': return <PlusCircle size={16} className="text-green-600" />;
      case 'PUT': return <Edit size={16} className="text-blue-600" />;
      case 'DELETE': return <Trash2 size={16} className="text-red-600" />;
      case 'GET': return <Eye size={16} className="text-gray-600" />;
      default: return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getActionText = (action) => {
    switch (action) {
      case 'POST': return 'Created';
      case 'PUT': return 'Updated';
      case 'DELETE': return 'Deleted';
      case 'GET': return 'Viewed';
      default: return action;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Clock size={20} className="text-blue-600" />
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Recent Activity</h2>
      </div>
      
      {activities.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No activities yet</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="mt-0.5">
                {getActionIcon(activity.action)}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div>
                    <span className="font-medium text-gray-800">{activity.user?.name}</span>
                    <span className="text-gray-600 mx-1">{getActionText(activity.action)}</span>
                    <span className="text-gray-700">{activity.entityType}</span>
                    {activity.details && (
                      <span className="text-gray-500 text-sm ml-1">- {activity.details}</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {format(new Date(activity.createdAt), 'MMM d, h:mm a')}
                  </span>
                </div>
                {activity.entityId && (
                  <p className="text-xs text-gray-400 mt-1">ID: {activity.entityId}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityLog;