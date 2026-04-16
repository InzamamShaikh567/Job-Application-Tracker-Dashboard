import Application from '../models/Application.js';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id }).sort({
      appliedDate: -1,
    });
    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'server-error',
      error: error.message,
    });
  }
};

export const createApplication = async (req, res) => {
  try {
    const { company, position, jobLink, status, notes, salary } = req.body;

    const application = await Application.create({
      user: req.user.id,
      company,
      position,
      jobLink,
      status,
      notes,
      salary,
    });

    res.status(201).json({
      success: true,
      message: 'Application created successfully',
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'server-error',
      error: error.message,
    });
  }
};

export const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // making sure that user own that application
    if (application.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'server-error',
      error: error.message,
    });
  }
};

export const updateApplication = async (req, res) => {
  try {
    let application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    if (application.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Use let instead of const, or use findByIdAndUpdate without reassigning
    application = await Application.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'server-error',
      error: error.message,
    });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    if (application.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    if (application.resume) {
      const resumePath = path.join(__dirname, '..', application.resume);
      if (fs.existsSync(resumePath)) {
        fs.unlinkSync(resumePath);
      }
    }

    if (application.coverLetter) {
      const coverPath = path.join(__dirname, '..', application.coverLetter);
      if (fs.existsSync(coverPath)) {
        fs.unlinkSync(coverPath);
      }
    }

    await application.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'server-error',
      error: error.message,
    });
  }
};

export const getStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const stats = await Application.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const totalApplication = await Application.countDocuments({
      user: req.user.id,
    });

    // console.log('Stats query result:', stats);
    // console.log('Total applications:', totalApplication);

    res.status(200).json({
      success: true,
      stats,
      total: totalApplication,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'server-error',
      error: error.message,
    });
  }
};

export const uploadApplicationResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    // Find application
    const application = await Application.findById(req.params.id);

    if (!application) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);

      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check if user owns the application
    if (application.user.toString() !== req.user.id) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);

      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Delete old resume if exists
    if (application.resume) {
      const oldResumePath = path.join(__dirname, '..', application.resume);
      if (fs.existsSync(oldResumePath)) {
        fs.unlinkSync(oldResumePath);
      }
    }

    // Update application with new resume path
    application.resume = req.file.path;
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      resume: req.file.path,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const uploadCoverLetter = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    // Find application
    const application = await Application.findById(req.params.id);

    if (!application) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);

      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check if user owns the application
    if (application.user.toString() !== req.user.id) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);

      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Delete old cover letter if exists
    if (application.coverLetter) {
      const oldCoverPath = path.join(__dirname, '..', application.coverLetter);
      if (fs.existsSync(oldCoverPath)) {
        fs.unlinkSync(oldCoverPath);
      }
    }

    // Update application with new cover letter path
    application.coverLetter = req.file.path;
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Cover letter uploaded successfully',
      coverLetter: req.file.path,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const { type, filename } = req.params;
    // console.log('Download request - type:', type, 'filename:', filename);

    // Validate file type
    const allowedTypes = ['resumes', 'avatars', 'cover-letters', 'others'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type',
      });
    }
    let cleanFilename = filename;
    if (cleanFilename.includes('\\')) {
      cleanFilename = cleanFilename.split('\\').pop();
    } else if (cleanFilename.includes('/')) {
      cleanFilename = cleanFilename.split('/').pop();
    }

    // console.log('Clean filename:', cleanFilename);

    // Construct file path
    const filePath = path.join(__dirname, '../uploads', type, cleanFilename);
    // console.log('File path:', filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      // console.log('File not found at:', filePath);
      return res.status(404).json({
        success: false,
        message: 'File not found',
        filename: cleanFilename,
        type: type,
      });
    }

    // Send file
    // console.log('Sending file:', filePath);
    res.download(filePath, cleanFilename, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({
          success: false,
          message: 'Error downloading file',
        });
      }
    });
  } catch (error) {
    console.error('File download error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const fileType = req.path.includes('resume') ? 'resume' : 'coverLetter';

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check authorization
    if (application.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    if (fileType === 'resume' && application.resume) {
      const resumePath = path.join(__dirname, '..', application.resume);
      if (fs.existsSync(resumePath)) {
        fs.unlinkSync(resumePath);
      }
      application.resume = '';
    } else if (fileType === 'coverLetter' && application.coverLetter) {
      const coverPath = path.join(__dirname, '..', application.coverLetter);
      if (fs.existsSync(coverPath)) {
        fs.unlinkSync(coverPath);
      }
      application.coverLetter = '';
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
