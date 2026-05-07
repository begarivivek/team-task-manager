import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FolderKanban, CheckSquare, CheckCircle, Clock } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const projectsRes = await axios.get(API_URL + "/projects");
      const projects = Array.isArray(projectsRes.data) ? projectsRes.data : [];
      const totalProjects = projects.length;
      
      let allTasks = [];
      for (const project of projects) {
        try {
          const tasksRes = await axios.get(API_URL + "/tasks/project/" + project.id);
          if (Array.isArray(tasksRes.data)) {
            allTasks = [...allTasks, ...tasksRes.data];
          }
        } catch (err) {
          console.error("Error fetching tasks:", err);
        }
      }
      
      const totalTasks = allTasks.length;
      const completedTasks = allTasks.filter(t => t.status === "Completed").length;
      const pendingTasks = totalTasks - completedTasks;
      
      setStats({
        totalProjects,
        totalTasks,
        completedTasks,
        pendingTasks
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
          Welcome back, {user?.name}!
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs sm:text-sm">Total Projects</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">{stats.totalProjects}</p>
            </div>
            <FolderKanban className="text-blue-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs sm:text-sm">Total Tasks</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">{stats.totalTasks}</p>
            </div>
            <CheckSquare className="text-purple-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs sm:text-sm">Completed Tasks</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">{stats.completedTasks}</p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs sm:text-sm">Pending Tasks</p>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-600 mt-1">{stats.pendingTasks}</p>
            </div>
            <Clock className="text-yellow-500" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;