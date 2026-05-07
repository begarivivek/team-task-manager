import React from 'react';
import { format } from 'date-fns';
import { Calendar, User } from 'lucide-react';
import StatusBadge from './StatusBadge';
import axios from 'axios';
import toast from 'react-hot-toast';

const TaskCard = ({ task, onStatusChange, isAdmin }) => {
  const priorityColors = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800'
  };
  
  const API_URL = "http://localhost:5000/api";

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await axios.put(API_URL + '/tasks/' + task.id, { status: newStatus });
      toast.success('Task status updated successfully');
      if (onStatusChange) {
        onStatusChange(task.id, newStatus);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error(error.response?.data?.message || 'Failed to update task status');
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-gray-800">{task.title}</h4>
        <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      
      {task.description && (
        <p className="text-gray-600 text-sm mb-3">{task.description.substring(0, 100)}</p>
      )}
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center text-gray-500">
          <User size={14} className="mr-2" />
          <span>Assigned to: {task.assignee?.name || 'Unassigned'}</span>
        </div>
        
        {task.dueDate && (
          <div className="flex items-center text-gray-500">
            <Calendar size={14} className="mr-2" />
            <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <StatusBadge status={task.status} />
        
        {!isAdmin && task.status !== 'Completed' && (
          <select
            value={task.status}
            onChange={(e) => handleStatusUpdate(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        )}
      </div>
    </div>
  );
};

export default TaskCard;