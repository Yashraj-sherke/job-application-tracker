import { useState, FormEvent, useEffect } from 'react';
import { Application } from '../types';
import { useCreateApplication, useUpdateApplication } from '../hooks/useApplications';

interface ApplicationFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    application?: Application;
}

const ApplicationFormModal: React.FC<ApplicationFormModalProps> = ({
    isOpen,
    onClose,
    application,
}) => {
    const createMutation = useCreateApplication();
    const updateMutation = useUpdateApplication();

    const [formData, setFormData] = useState({
        companyName: '',
        jobTitle: '',
        jobPortal: 'LinkedIn' as Application['jobPortal'],
        jobLink: '',
        location: '',
        employmentType: 'Full-time' as Application['employmentType'],
        dateApplied: new Date().toISOString().split('T')[0],
        status: 'Backlog' as Application['status'],
        source: 'Job board' as Application['source'],
        salaryRange: '',
        recruiterName: '',
        recruiterEmail: '',
        recruiterPhone: '',
        followUpDate: '',
        notes: '',
        resumeVersion: '',
    });

    useEffect(() => {
        if (application) {
            setFormData({
                companyName: application.companyName,
                jobTitle: application.jobTitle,
                jobPortal: application.jobPortal,
                jobLink: application.jobLink || '',
                location: application.location || '',
                employmentType: application.employmentType,
                dateApplied: new Date(application.dateApplied).toISOString().split('T')[0],
                status: application.status,
                source: application.source,
                salaryRange: application.salaryRange || '',
                recruiterName: application.recruiterName || '',
                recruiterEmail: application.recruiterEmail || '',
                recruiterPhone: application.recruiterPhone || '',
                followUpDate: application.followUpDate
                    ? new Date(application.followUpDate).toISOString().split('T')[0]
                    : '',
                notes: application.notes || '',
                resumeVersion: application.resumeVersion || '',
            });
        }
    }, [application]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            if (application) {
                await updateMutation.mutateAsync({
                    id: application._id,
                    data: formData,
                });
            } else {
                await createMutation.mutateAsync(formData);
            }
            onClose();
            resetForm();
        } catch (error) {
            // Error handled by mutation
        }
    };

    const resetForm = () => {
        setFormData({
            companyName: '',
            jobTitle: '',
            jobPortal: 'LinkedIn',
            jobLink: '',
            location: '',
            employmentType: 'Full-time',
            dateApplied: new Date().toISOString().split('T')[0],
            status: 'Backlog',
            source: 'Job board',
            salaryRange: '',
            recruiterName: '',
            recruiterEmail: '',
            recruiterPhone: '',
            followUpDate: '',
            notes: '',
            resumeVersion: '',
        });
    };

    const handleClose = () => {
        onClose();
        if (!application) {
            resetForm();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose}></div>

                <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {application ? 'Edit Application' : 'New Application'}
                        </h3>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Company Name */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    className="input"
                                />
                            </div>

                            {/* Job Title */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Job Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.jobTitle}
                                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                    className="input"
                                />
                            </div>

                            {/* Job Portal */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Job Portal *
                                </label>
                                <select
                                    required
                                    value={formData.jobPortal}
                                    onChange={(e) => setFormData({ ...formData, jobPortal: e.target.value as Application['jobPortal'] })}
                                    className="input"
                                >
                                    <option value="LinkedIn">LinkedIn</option>
                                    <option value="Naukri">Naukri</option>
                                    <option value="Foundit">Foundit</option>
                                    <option value="Glassdoor">Glassdoor</option>
                                    <option value="Company site">Company site</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Employment Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Employment Type *
                                </label>
                                <select
                                    required
                                    value={formData.employmentType}
                                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as Application['employmentType'] })}
                                    className="input"
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Remote">Remote</option>
                                    <option value="Hybrid">Hybrid</option>
                                    <option value="On-site">On-site</option>
                                </select>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="input"
                                    placeholder="e.g., San Francisco, CA"
                                />
                            </div>

                            {/* Job Link */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Job Link
                                </label>
                                <input
                                    type="url"
                                    value={formData.jobLink}
                                    onChange={(e) => setFormData({ ...formData, jobLink: e.target.value })}
                                    className="input"
                                    placeholder="https://..."
                                />
                            </div>

                            {/* Date Applied */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date Applied *
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={formData.dateApplied}
                                    onChange={(e) => setFormData({ ...formData, dateApplied: e.target.value })}
                                    className="input"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status *
                                </label>
                                <select
                                    required
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Application['status'] })}
                                    className="input"
                                >
                                    <option value="Backlog">Backlog</option>
                                    <option value="Applied">Applied</option>
                                    <option value="HR Screen">HR Screen</option>
                                    <option value="Technical Round">Technical Round</option>
                                    <option value="Managerial Round">Managerial Round</option>
                                    <option value="Offer">Offer</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="On hold">On hold</option>
                                </select>
                            </div>

                            {/* Source */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Source *
                                </label>
                                <select
                                    required
                                    value={formData.source}
                                    onChange={(e) => setFormData({ ...formData, source: e.target.value as Application['source'] })}
                                    className="input"
                                >
                                    <option value="Referral">Referral</option>
                                    <option value="Direct">Direct</option>
                                    <option value="Job board">Job board</option>
                                    <option value="Recruiter">Recruiter</option>
                                </select>
                            </div>

                            {/* Salary Range */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Salary Range
                                </label>
                                <input
                                    type="text"
                                    value={formData.salaryRange}
                                    onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                                    className="input"
                                    placeholder="e.g., $100k - $150k"
                                />
                            </div>

                            {/* Resume Version */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Resume Version
                                </label>
                                <input
                                    type="text"
                                    value={formData.resumeVersion}
                                    onChange={(e) => setFormData({ ...formData, resumeVersion: e.target.value })}
                                    className="input"
                                    placeholder="e.g., v2.1"
                                />
                            </div>

                            {/* Follow-up Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Follow-up Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.followUpDate}
                                    onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                                    className="input"
                                />
                            </div>

                            {/* Recruiter Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Recruiter Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.recruiterName}
                                    onChange={(e) => setFormData({ ...formData, recruiterName: e.target.value })}
                                    className="input"
                                />
                            </div>

                            {/* Recruiter Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Recruiter Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.recruiterEmail}
                                    onChange={(e) => setFormData({ ...formData, recruiterEmail: e.target.value })}
                                    className="input"
                                />
                            </div>

                            {/* Recruiter Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Recruiter Phone
                                </label>
                                <input
                                    type="tel"
                                    value={formData.recruiterPhone}
                                    onChange={(e) => setFormData({ ...formData, recruiterPhone: e.target.value })}
                                    className="input"
                                />
                            </div>

                            {/* Notes */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes
                                </label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="input"
                                    rows={3}
                                    placeholder="Any additional notes..."
                                ></textarea>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={createMutation.isPending || updateMutation.isPending}
                                className="btn btn-primary disabled:opacity-50"
                            >
                                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ApplicationFormModal;
