import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { authApi } from '../utils/api.js';
import api from '../utils/api';
import toast from 'react-hot-toast';
import ProfileModal from './ProfileModal.jsx';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    linkedin: '',
    github: '',
    avatar: '',
    resume: '',
    createdAt: '',
  });
  const [loading, setLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const getApiUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    if (apiUrl && apiUrl.trim()) {
      return apiUrl;
    }

   
    return 'http://localhost:8000';
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await authApi.getProfile();
      const userData = response.data.user;

      setProfileData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || 'Not provided',
        location: userData.location || 'Not provided',
        bio: userData.bio || 'No bio added',
        linkedin: userData.linkedin || 'Not provided',
        github: userData.github || 'Not provided',
        avatar: userData.avatar || '',
        resume: userData.resume || '',
        createdAt: userData.createdAt || '',
      });
    } catch (error) {
      setLoading(false);
      toast.error('Failed to fetch profile');
    }
  };

  const downloadResume = async () => {
    if (!profileData.resume) {
      toast.error('No resume available');
      return;
    }

    try {
      const justFilename = getFileName(profileData.resume);
      const response = await api.get(
        `/v1/applications/files/resumes/${justFilename}`,
        {
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', justFilename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download resume');
    }
  };

  const getFileName = (path) => {
    if (!path) return '';
    const normalizedPath = path.replace(/\\/g, '/');
    return normalizedPath.split('/').pop();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-slate-200 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 transition text-gray-700 font-medium"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={
                    profileData.avatar
                      ? // ? `http://localhost:8000/${profileData.avatar}`
                        `${getApiUrl()}/${profileData.avatar} `
                      : `https://ui-avatars.com/api/?name=${profileData.name}&background=random&size=128`
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
                {/* <img
                  src={
                    profileData.avatar
                      ? getAvatarUrl(profileData.avatar)
                      : `https://ui-avatars.com/api/?name=${profileData.name}&background=random&size=128`
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                /> */}
              </div>

              {/* Basic Info */}
              <div className="text-center md:text-left text-white">
                <h1 className="text-3xl font-bold mb-2">{profileData.name}</h1>
                <p className="text-blue-100 text-lg mb-1">
                  {profileData.email}
                </p>
                <p className="text-blue-100">
                  Member since: {formatDate(profileData.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Personal Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                    Personal Information
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Phone Number
                      </label>
                      <p className="text-gray-800 mt-1">{profileData.phone}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Location
                      </label>
                      <p className="text-gray-800 mt-1">
                        {profileData.location}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Bio
                      </label>
                      <p className="text-gray-800 mt-1 whitespace-pre-line">
                        {profileData.bio}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                    Social Profiles
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        LinkedIn
                      </label>
                      {profileData.linkedin !== 'Not provided' ? (
                        <a
                          href={profileData.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 mt-1 block"
                        >
                          {profileData.linkedin}
                        </a>
                      ) : (
                        <p className="text-gray-800 mt-1">
                          {profileData.linkedin}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        GitHub
                      </label>
                      {profileData.github !== 'Not provided' ? (
                        <a
                          href={profileData.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 mt-1 block"
                        >
                          {profileData.github}
                        </a>
                      ) : (
                        <p className="text-gray-800 mt-1">
                          {profileData.github}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Resume & Account Info */}
              <div className="space-y-6">
                {/* Resume Section */}
                <div className="border rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Resume
                  </h2>

                  {profileData.resume ? (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-6 h-6 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="font-medium text-green-800">
                              Resume Uploaded
                            </span>
                          </div>
                          <p className="text-sm text-green-600 mt-1">
                            {getFileName(profileData.resume)}
                          </p>
                        </div>
                        <button
                          onClick={downloadResume}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition"
                        >
                          Download Resume
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 text-center">
                      <svg
                        className="w-12 h-12 text-yellow-500 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-yellow-800 font-medium">
                        No Resume Uploaded
                      </p>
                      <p className="text-yellow-600 text-sm mt-1">
                        Upload your resume from the edit profile modal
                      </p>
                    </div>
                  )}
                </div>

                {/* Account Statistics */}
                <div className="border rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Account Statistics
                  </h2>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Account Created</span>
                      <span className="font-medium">
                        {formatDate(profileData.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Profile Completeness
                      </span>
                      <span className="font-medium text-green-600">85%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Last Updated</span>
                      <span className="font-medium">
                        {formatDate(profileData.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="border rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Quick Actions
                  </h2>

                  <div className="space-y-3">
                    <button
                      onClick={() => setShowProfileModal(true)}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-md font-medium hover:bg-blue-700 transition"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit Profile Details
                    </button>

                    <button
                      onClick={() => navigate('/dashboard')}
                      className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-md font-medium hover:bg-gray-200 transition"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal for Editing */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          fetchProfile(); // Refresh profile data after modal closes
        }}
      />
    </div>
  );
};

export default Profile;
