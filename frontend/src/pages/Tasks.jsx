import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { Plus, Edit2, Trash2, CheckCircle, Clock, AlertCircle, Search, Filter } from "lucide-react";
import toast from "react-hot-toast";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: "",
    priority: "Medium",
    dueDate: ""
  });
  const { isAdmin } = useAuth();
  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchTerm, statusFilter]);

  const fetchData = async () => {
    try {
      const projectsRes = await axios.get(API_URL + "/projects");
      const projectsList = Array.isArray(projectsRes.data) ? projectsRes.data : [];
      setProjects(projectsList);
      
      let allTasks = [];
      for (const project of projectsList) {
        try {
          const taskRes = await axios.get(API_URL + "/tasks/project/" + project.id);
          if (Array.isArray(taskRes.data)) {
            allTasks = [...allTasks, ...taskRes.data];
          }
        } catch (err) {
          console.error("Error fetching tasks:", err);
        }
      }
      setTasks(allTasks);
      setFilteredTasks(allTasks);
      
      try {
        const usersRes = await axios.get(API_URL + "/users");
        if (Array.isArray(usersRes.data)) {
          setUsers(usersRes.data);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = [...tasks];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(task => task.status === statusFilter);
    }
    
    setFilteredTasks(filtered);
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate) return false;
    if (status === "Completed") return false;
    return new Date(dueDate) < new Date();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await axios.put(API_URL + "/tasks/" + editingTask.id, formData);
        toast.success("Task updated successfully");
      } else {
        await axios.post(API_URL + "/tasks", formData);
        toast.success("Task created successfully");
      }
      setShowModal(false);
      setEditingTask(null);
      setFormData({
        title: "",
        description: "",
        projectId: "",
        assignedTo: "",
        priority: "Medium",
        dueDate: ""
      });
      fetchData();
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error(error.response?.data?.message || "Failed to save task");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(API_URL + "/tasks/" + id);
        toast.success("Task deleted successfully");
        fetchData();
      } catch (error) {
        console.error("Error deleting task:", error);
        toast.error("Failed to delete task");
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(API_URL + "/tasks/" + taskId, { status: newStatus });
      toast.success("Task status updated");
      fetchData();
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task status");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed": return <CheckCircle size={16} className="text-green-600" />;
      case "In Progress": return <Clock size={16} className="text-blue-600" />;
      default: return <AlertCircle size={16} className="text-yellow-600" />;
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Tasks</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage and track all tasks</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              setEditingTask(null);
              setFormData({
                title: "",
                description: "",
                projectId: "",
                assignedTo: "",
                priority: "Medium",
                dueDate: ""
              });
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <Plus size={20} />
            <span>New Task</span>
          </button>
        )}
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No tasks found. Create your first task!</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredTasks.map((task) => {
            const overdue = isOverdue(task.dueDate, task.status);
            return (
              <div 
                key={task.id} 
                className={`bg-white rounded-xl shadow-md p-4 sm:p-6 transition-all ${
                  overdue ? 'border-l-4 border-l-red-500 bg-red-50' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {getStatusIcon(task.status)}
                      <h3 className="text-base sm:text-xl font-semibold text-gray-800">
                        {task.title}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      {overdue && (
                        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                          Overdue
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base mb-2">
                      {task.description || "No description"}
                    </p>
                    <div className="text-xs sm:text-sm text-gray-500 space-y-1">
                      <p>Project: {task.project?.title || "N/A"}</p>
                      <p>Assigned to: {task.assignee?.name || "Unassigned"}</p>
                      {task.dueDate && (
                        <p className={overdue ? "text-red-600 font-medium" : ""}>
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                          {overdue && " ⚠️ Past due date!"}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-3">
                    {!isAdmin && task.status !== "Completed" && (
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className="text-xs sm:text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    )}
                    {isAdmin && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingTask(task);
                            setFormData({
                              title: task.title,
                              description: task.description || "",
                              projectId: task.projectId,
                              assignedTo: task.assignedTo,
                              priority: task.priority,
                              dueDate: task.dueDate ? task.dueDate.split("T")[0] : ""
                            });
                            setShowModal(true);
                          }}
                          className="text-gray-500 hover:text-blue-600 p-1"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="text-gray-500 hover:text-red-600 p-1"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Create/Edit Task - same as before */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              {editingTask ? "Edit Task" : "Create New Task"}
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
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Project *</label>
                <select
                  required
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign To *</label>
                <select
                  required
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                >
                  <option value="">Select Team Member</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 sm:flex-1">
                  {editingTask ? "Update" : "Create"}
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

export default Tasks;