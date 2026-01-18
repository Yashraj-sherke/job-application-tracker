import mongoose, { Document, Schema } from 'mongoose';

export interface IInteraction {
    type: 'call' | 'email' | 'interview' | 'other';
    date: Date;
    notes: string;
}

export interface IStatusHistory {
    status: string;
    changedAt: Date;
}

export interface IApplication extends Document {
    userId: mongoose.Types.ObjectId;
    companyName: string;
    jobTitle: string;
    jobPortal: 'LinkedIn' | 'Naukri' | 'Foundit' | 'Glassdoor' | 'Company site' | 'Other';
    jobLink?: string;
    location?: string;
    employmentType: 'Full-time' | 'Part-time' | 'Internship' | 'Contract' | 'Remote' | 'Hybrid' | 'On-site';
    dateApplied: Date;
    status: 'Backlog' | 'Applied' | 'HR Screen' | 'Technical Round' | 'Managerial Round' | 'Offer' | 'Rejected' | 'On hold';
    source: 'Referral' | 'Direct' | 'Job board' | 'Recruiter';
    salaryRange?: string;
    recruiterName?: string;
    recruiterEmail?: string;
    recruiterPhone?: string;
    followUpDate?: Date;
    notes?: string;
    resumeVersion?: string;
    statusHistory: IStatusHistory[];
    interactions: IInteraction[];
    createdAt: Date;
    updatedAt: Date;
}

const interactionSchema = new Schema<IInteraction>(
    {
        type: {
            type: String,
            enum: ['call', 'email', 'interview', 'other'],
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        notes: {
            type: String,
            required: true,
        },
    },
    { _id: true }
);

const statusHistorySchema = new Schema<IStatusHistory>(
    {
        status: {
            type: String,
            required: true,
        },
        changedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false }
);

const applicationSchema = new Schema<IApplication>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        companyName: {
            type: String,
            required: [true, 'Company name is required'],
            trim: true,
            maxlength: [100, 'Company name cannot exceed 100 characters'],
        },
        jobTitle: {
            type: String,
            required: [true, 'Job title is required'],
            trim: true,
            maxlength: [100, 'Job title cannot exceed 100 characters'],
        },
        jobPortal: {
            type: String,
            enum: ['LinkedIn', 'Naukri', 'Foundit', 'Glassdoor', 'Company site', 'Other'],
            required: [true, 'Job portal is required'],
        },
        jobLink: {
            type: String,
            trim: true,
        },
        location: {
            type: String,
            trim: true,
        },
        employmentType: {
            type: String,
            enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote', 'Hybrid', 'On-site'],
            required: [true, 'Employment type is required'],
        },
        dateApplied: {
            type: Date,
            required: [true, 'Date applied is required'],
            default: Date.now,
        },
        status: {
            type: String,
            enum: ['Backlog', 'Applied', 'HR Screen', 'Technical Round', 'Managerial Round', 'Offer', 'Rejected', 'On hold'],
            default: 'Backlog',
            required: true,
        },
        source: {
            type: String,
            enum: ['Referral', 'Direct', 'Job board', 'Recruiter'],
            required: [true, 'Source is required'],
        },
        salaryRange: {
            type: String,
            trim: true,
        },
        recruiterName: {
            type: String,
            trim: true,
        },
        recruiterEmail: {
            type: String,
            trim: true,
            lowercase: true,
        },
        recruiterPhone: {
            type: String,
            trim: true,
        },
        followUpDate: {
            type: Date,
        },
        notes: {
            type: String,
            maxlength: [2000, 'Notes cannot exceed 2000 characters'],
        },
        resumeVersion: {
            type: String,
            trim: true,
        },
        statusHistory: {
            type: [statusHistorySchema],
            default: [],
        },
        interactions: {
            type: [interactionSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

// Add initial status to history when creating
applicationSchema.pre('save', function (next) {
    if (this.isNew) {
        this.statusHistory.push({
            status: this.status,
            changedAt: new Date(),
        });
    }
    next();
});

// Create indexes for better query performance
applicationSchema.index({ userId: 1, dateApplied: -1 });
applicationSchema.index({ userId: 1, status: 1 });
applicationSchema.index({ userId: 1, companyName: 'text', jobTitle: 'text' });

export default mongoose.model<IApplication>('Application', applicationSchema);
