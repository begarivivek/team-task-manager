import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { UserPlus, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const { isAdmin } = useAuth();
  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    fetchProjectDetails();
    fetchAllUsers();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(API_URL + '/projects/' + id);
      setProject(response.data);
      setMembers(response.data.members || []);
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(API_URL + '/users');
      setAllUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddMember = async (userId) => {
    try {
      await axios.post(API_URL + '/projects/' + id + '/members', { userId });
      toast.success('Member added successfully');
      setShowMemberModal(false);
      fetchProjectDetails();
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        await axios.delete(API_URL + '/projects/' + id + '/members', { data: { userId } });
        toast.success('Member removed');
        fetchProjectDetails();
      } catch (error) {
        console.error('Error removing member:', error);
        toast.error('Failed to remove member');
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!project) return <div>Project not found</div>;

  const availableUsers = allUsers.filter(u => !members.find(m => m.id === u.id));

  return (
    <div>
      <button onClick={() => navigate('/projects')} className="text-blue-600 mb-4">
        ← Back to Projects
      </button>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{project.title}</h1>
        <p className="text-gray-600">{project.description || 'No description'}</p>
      </div>

      {/* Team Members Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Team Members</h2>
          {isAdmin && (
            <button
              onClick={() => setShowMemberModal(true)}
              className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <UserPlus size={18} />
              <span>Add Member</span>
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {members.map(member => (
            <div key={member.id} className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
              <span className="text-sm font-medium">{member.name}</span>
              <span className="text-xs text-gray-500">({member.email})</span>
              {isAdmin && member.email !== 'admin@example.com' && (
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
          {members.length === 0 && (
            <p className="text-gray-500">No members yet. Add team members to assign tasks.</p>
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Add Team Member</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {availableUsers.length === 0 ? (
                <p className="text-gray-500 text-center py-4">All users are already members</p>
              ) : (
                availableUsers.map(user => (
                  <div key={user.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400">{user.role}</p>
                    </div>
                    <button
                      onClick={() => handleAddMember(user.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => setShowMemberModal(false)}
              className="w-full mt-4 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;