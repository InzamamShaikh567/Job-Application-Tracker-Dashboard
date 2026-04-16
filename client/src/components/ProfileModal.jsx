import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { authApi } from '../utils/api.js';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    linkedin: '',
    github: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen]);

  const getApiUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    if (apiUrl && apiUrl.trim()) {
      return apiUrl;
    }
    return 'http://localhost:8000';
  };

  const fetchProfile = async () => {
    try {
      const response = await authApi.getProfile();
      setFormData({
        name: response.data.user.name,
        email: response.data.user.email,
        phone: response.data.user.phone || '',
        location: response.data.user.location || '',
        bio: response.data.user.bio || '',
        linkedin: response.data.user.linkedin || '',
        github: response.data.user.github || '',
      });
      if (response.data.user.avatar) {
        // setAvatarPreview(`http://localhost:8000/${response.data.user.avatar}`);
        setAvatarPreview(`${getApiUrl()}/${response.data.user.avatar}`);
      }
      if (response.data.user.resume) {
        setResumeFile(response.data.user.resume);
      }
    } catch (error) {
      toast.error('Failed to fetch profile');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authApi.updateProfile(formData);
      toast.success('Profile updated successfully!');

      if (avatar) {
        const formDataAvatar = new FormData();
        formDataAvatar.append('avatar', avatar);
        await authApi.uploadAvatar(formDataAvatar);
        toast.success('Avatar updated successfully!');
        setAvatar(null);
        fetchProfile();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await authApi.changePassword(passwordData);
      toast.success('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (
      !file.type.includes('pdf') &&
      !file.type.includes('msword') &&
      !file.type.includes('wordprocessingml')
    ) {
      toast.error('Only PDF and Word documents are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const formDataResume = new FormData();
    formDataResume.append('resume', file);

    try {
      await authApi.uploadResume(formDataResume);
      toast.success('Resume uploaded successfully!');
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload resume');
    }
  };

  const downloadFile = async (filePath) => {
    try {
      const justFilename = getFileName(filePath);
      let fileType = 'resumes';
      const normalizedPath = filePath
        ? filePath.replace(/\\/g, '/').toLowerCase()
        : '';

      if (normalizedPath.includes('cover')) {
        fileType = 'cover-letters';
      } else if (normalizedPath.includes('avatar')) {
        fileType = 'avatars';
      }

      const response = await api.get(
        `/v1/applications/files/${fileType}/${justFilename}`,
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
      toast.error('Failed to download file');
    }
  };

  const getFileName = (path) => {
    if (!path) return null;
    const normalizedPath = path.replace(/\\/g, '/');
    return normalizedPath.split('/').pop();
  };

  const handleDeleteResume = async () => {
    if (!window.confirm('Are you sure you want to delete your resume?')) return;

    try {
      await authApi.deleteResume();
      toast.success('Resume deleted successfully!');
      setResumeFile(null);
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete resume');
    }
  };

  const handleDeleteAvatar = async () => {
    if (!window.confirm('Are you sure you want to delete your avatar?')) return;

    try {
      await authApi.deleteAvatar();
      toast.success('Avatar deleted successfully!');
      setAvatarPreview('');
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete avatar');
    }
  };

  const resetForm = () => {
    setAvatar(null);
    setAvatarPreview('');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setActiveTab('profile');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Profile Settings</h2>
            <p className="text-blue-100 text-sm">Manage your account</p>
          </div>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="text-white text-2xl hover:opacity-80"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex border-b mb-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'profile'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Profile
              </div>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'security'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Security
              </div>
            </button>
            <button
              onClick={() => setActiveTab('resume')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'resume'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Resume
              </div>
            </button>
          </div>

          {/* Profile Tab Content */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column - Avatar & Basic Info */}
              <div className="md:col-span-1">
                <div className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="text-center">
                    <div className="relative inline-block">
                      <img
                        // src={
                        //   avatarPreview ||
                        //   (user?.avatar
                        //     ? // ? `http://localhost:8000/api/v1/auth/avatar-display`
                        //       `${getApiUrl()}/api/v1/auth/avatar-display`
                        //     : `https://ui-avatars.com/api/?name=${formData.name}&background=random`)
                        // }
                        src={
                          avatarPreview ||
                          (user?.avatar
                            ? `${getApiUrl()}/api/v1/auth/avatar-display`
                            : `https://ui-avatars.com/api/?name=${formData.name}&background=random`)
                        }
                        alt="Avatar"
                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg mx-auto"
                      />
                      {/* <img
                        src={
                          avatarPreview ||
                          (user?.avatar
                            ? `${getApiUrl()}/api/v1/auth/avatar-display`
                            : `https://ui-avatars.com/api/?name=${formData.name}&background=random`)
                        }
                        alt="Avatar"
                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg mx-auto"
                      /> */}
                      <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
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
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Click to change photo
                    </p>
                    {avatarPreview && (
                      <button
                        onClick={handleDeleteAvatar}
                        className="text-xs text-red-600 hover:text-red-800 mt-1"
                      >
                        Delete Avatar
                      </button>
                    )}
                  </div>

                  {/* Account Info */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-800">
                      Account Information
                    </h3>
                    <p className="text-sm text-gray-600">
                      Email: {formData.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      Member since:{' '}
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Profile Form */}
              <div className="md:col-span-2">
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GitHub Profile
                      </label>
                      <input
                        type="url"
                        name="github"
                        value={formData.github}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        resetForm();
                      }}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-400 transition duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Security Tab Content */}
          {activeTab === 'security' && (
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <h3 className="text-lg font-medium text-gray-800">
                  Change Password
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password *
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password *
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 transition duration-200 disabled:opacity-50"
                  >
                    Change Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-400 transition duration-200"
                  >
                    Back to Profile
                  </button>
                </div>
              </form>

              {/* Danger Zone */}
              <div className="border-t pt-8 mt-8">
                <h3 className="text-lg font-medium text-red-800 mb-4">
                  Danger Zone
                </h3>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-6 py-2 rounded-md font-medium hover:bg-red-700 transition duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Resume Tab Content */}
          {activeTab === 'resume' && (
            <div className="max-w-2xl mx-auto">
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-800">
                  Resume Management
                </h3>

                {resumeFile ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-medium text-green-800">
                          ✓ Resume Uploaded
                        </h4>
                        <p className="text-sm text-green-600 mt-1">
                          Filename: {getFileName(resumeFile)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => downloadFile(resumeFile)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition"
                        >
                          Download
                        </button>
                        <button
                          onClick={handleDeleteResume}
                          className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
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
                    <h4 className="text-lg font-medium text-yellow-800 mb-2">
                      No Resume Uploaded
                    </h4>
                    <p className="text-yellow-600">
                      Upload your resume to make it available for job
                      applications.
                    </p>
                  </div>
                )}

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                    />
                    <svg
                      className="w-16 h-16 text-gray-400 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                      />
                    </svg>
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      {resumeFile ? 'Update Resume' : 'Upload Resume'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Drag and drop or click to browse
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      PDF or DOC, max 5MB
                    </p>
                  </label>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-400 transition duration-200"
                  >
                    Back to Profile
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
