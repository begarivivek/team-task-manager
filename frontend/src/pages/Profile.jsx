import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Award } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Profile</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Your account information</p>
      </div>
      
      {/* Profile Card - responsive */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Cover/Header Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-3xl sm:text-4xl font-bold text-blue-600">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            {/* User info */}
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-white">{user?.name}</h2>
              <p className="text-blue-100 text-sm sm:text-base mt-1">{user?.email}</p>
              <span className="inline-block mt-2 px-2 sm:px-3 py-0.5 sm:py-1 bg-white bg-opacity-20 rounded-full text-white text-xs sm:text-sm">
                {user?.role === 'Admin' ? 'Administrator' : 'Team Member'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Details Section */}
        <div className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Account Details</h3>
          <div className="space-y-3 sm:space-y-4">
            {/* Name */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-lg">
                <User size={18} className="text-blue-600 sm:w-5 sm:h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-500">Full Name</p>
                <p className="text-sm sm:text-base font-medium text-gray-800">{user?.name}</p>
              </div>
            </div>
            
            {/* Email */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Mail size={18} className="text-blue-600 sm:w-5 sm:h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-500">Email Address</p>
                <p className="text-sm sm:text-base font-medium text-gray-800 break-all">{user?.email}</p>
              </div>
            </div>
            
            {/* Role */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Shield size={18} className="text-blue-600 sm:w-5 sm:h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-500">Role</p>
                <p className="text-sm sm:text-base font-medium text-gray-800">
                  {user?.role === 'Admin' ? 'Administrator' : 'Team Member'}
                </p>
              </div>
            </div>
            
            {/* Member Since - optional, uses createdAt if available */}
            {user?.createdAt && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Award size={18} className="text-blue-600 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-gray-500">Member Since</p>
                  <p className="text-sm sm:text-base font-medium text-gray-800">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;