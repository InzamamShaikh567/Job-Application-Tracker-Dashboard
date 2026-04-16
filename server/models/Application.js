import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    jobLink: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Applied', 'Interview', 'Rejected', 'Offer', 'Accepted'],
      default: 'Applied',
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
    },
    resume: {
      type: String,
    },
    coverLetter: {
      type: String,
    },
    salary: {
      type: Number,
    },
    contactPerson: {
      name: String,
      email: String,
      phone: String,
    },
    interviewDate: {
      type: Date,
    },
    followUpDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Application = mongoose.model('Application', applicationSchema);
export default Application;
