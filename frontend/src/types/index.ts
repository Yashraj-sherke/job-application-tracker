export interface User {
    id: string;
    name: string;
    email: string;
}

export interface Interaction {
    _id?: string;
    type: 'call' | 'email' | 'interview' | 'other';
    date: Date | string;
    notes: string;
}

export interface StatusHistory {
    status: string;
    changedAt: Date | string;
}

export interface Application {
    _id: string;
    userId: string;
    companyName: string;
    jobTitle: string;
    jobPortal: 'LinkedIn' | 'Naukri' | 'Foundit' | 'Glassdoor' | 'Company site' | 'Other';
    jobLink?: string;
    location?: string;
    employmentType: 'Full-time' | 'Part-time' | 'Internship' | 'Contract' | 'Remote' | 'Hybrid' | 'On-site';
    dateApplied: Date | string;
    status: 'Backlog' | 'Applied' | 'HR Screen' | 'Technical Round' | 'Managerial Round' | 'Offer' | 'Rejected' | 'On hold';
    source: 'Referral' | 'Direct' | 'Job board' | 'Recruiter';
    salaryRange?: string;
    recruiterName?: string;
    recruiterEmail?: string;
    recruiterPhone?: string;
    followUpDate?: Date | string;
    notes?: string;
    resumeVersion?: string;
    statusHistory: StatusHistory[];
    interactions: Interaction[];
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface ApplicationFilters {
    portal?: string;
    status?: string;
    location?: string;
    employmentType?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface AuthResponse {
    success: boolean;
    data: User;
}

export interface ErrorResponse {
    success: false;
    message: string;
    errors?: Array<{ msg: string; param: string }>;
}
