import React, { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AddApplication = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    jobLink: '',
    status: 'Applied',
    notes: '',
    salary: '',
  });
  const [files, setFiles] = useState({
    resume: null,
    coverLetter: null,
  });
  const [fileNames, setFileNames] = useState({
    resume: 'No file chosen',
    coverLetter: 'No file chosen',
  });
  const [loading, setLoading] = useState(false);
  const [appId, setAppId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'salary' ? (value === '' ? '' : Number(value)) : value,
    });
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      setFiles({
        ...files,
        [fileType]: file,
      });
      setFileNames({
        ...fileNames,
        [fileType]: file.name,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create the application first
      const res = await api.post('/v1/applications', formData);
      const newAppId = res.data.application._id;
      setAppId(newAppId);
      toast.success('Application added successfully!');

      // Upload files if they exist
      if (files.resume) {
        await uploadApplicationFile(newAppId, files.resume, 'resume');
      }
      if (files.coverLetter) {
        await uploadApplicationFile(
          newAppId,
          files.coverLetter,
          'cover-letter'
        );
      }

      // Reset form
      setFormData({
        company: '',
        position: '',
        jobLink: '',
        status: 'Applied',
        notes: '',
        salary: '',
      });
      setFiles({
        resume: null,
        coverLetter: null,
      });
      setFileNames({
        resume: 'No file chosen',
        coverLetter: 'No file chosen',
      });
      setAppId(null);

      onAdd();
    } catch (error) {
      console.error('Add application error:', error);
      toast.error(error.response?.data?.message || 'Failed to add application');
    } finally {
      setLoading(false);
    }
  };

  const uploadApplicationFile = async (applicationId, file, type) => {
    try {
      const formDataFile = new FormData();
      formDataFile.append(type === 'resume' ? 'resume' : 'coverLetter', file);

      const endpoint =
        type === 'resume'
          ? `/v1/applications/${applicationId}/resume`
          : `/v1/applications/${applicationId}/cover-letter`;

      await api.post(endpoint, formDataFile, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(
        `${type === 'resume' ? 'Resume' : 'Cover letter'} uploaded!`
      );
    } catch (error) {
      console.error(`Upload ${type} error:`, error);
      toast.error(`Failed to upload ${type}`);
    }
  };

  return (
    <div className="bg-slate-100 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Add New Application
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name *
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Google"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Position *
          </label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Frontend Developer"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Link
          </label>
          <input
            type="url"
            name="jobLink"
            value={formData.jobLink}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://company.com/careers"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Rejected">Rejected</option>
              <option value="Offer">Offer</option>
              <option value="Accepted">Accepted</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Salary ($)
            </label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 80000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add any notes about this application..."
          ></textarea>
        </div>

        {/* File Uploads */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Attachments (Optional)
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume (PDF/DOC)
              </label>
              <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 transition">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">
                    {fileNames.resume}
                  </span>
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, 'resume')}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter (PDF/DOC)
              </label>
              <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 transition">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">
                    {fileNames.coverLetter}
                  </span>
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, 'coverLetter')}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-md font-medium hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding...' : 'Add Application'}
        </button>
      </form>
    </div>
  );
};

export default AddApplication;
