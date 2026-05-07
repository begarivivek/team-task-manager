import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { Plus, Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const { isAdmin } = useAuth();
  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(API_URL + "/projects");
      if (Array.isArray(response.data)) {
        setProjects(response.data);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await axios.put(API_URL + "/projects/" + editingProject.id, formData);
        toast.success("Project updated successfully");
      } else {
        await axios.post(API_URL + "/projects", formData);
        toast.success("Project created successfully");
      }
      setShowModal(false);
      setEditingProject(null);
      setFormData({ title: "", description: "" });
      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error(error.response?.data?.message || "Failed to save project");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.delete(API_URL + "/projects/" + id);
        toast.success("Project deleted successfully");
        fetchProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
        toast.error("Failed to delete project");
      }
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({ title: project.title, description: project.description || "" });
    setShowModal(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Header section - responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Projects</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your team projects</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              setEditingProject(null);
              setFormData({ title: "", description: "" });
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <Plus size={20} />
            <span>New Project</span>
          </button>
        )}
      </div>

      {/* Projects Grid - responsive */}
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No projects found. Create your first project!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <Link to={`/projects/${project.id}`} className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 hover:text-blue-600">
                    {project.title}
                  </h3>
                </Link>
                {isAdmin && (
                  <div className="flex space-x-1 sm:space-x-2">
                    <button 
                      onClick={() => handleEdit(project)} 
                      className="text-gray-500 hover:text-blue-600 p-1"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(project.id)} 
                      className="text-gray-500 hover:text-red-600 p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2">
                {project.description || "No description"}
              </p>
              <Link to={`/projects/${project.id}`}>
                <span className="text-blue-600 text-sm hover:underline">View Details →</span>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Create/Edit Project - responsive */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              {editingProject ? "Edit Project" : "Create New Project"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 sm:flex-1">
                  {editingProject ? "Update" : "Create"}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 sm:flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;