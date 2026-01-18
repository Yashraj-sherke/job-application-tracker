import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApplication, useDeleteApplication, useAddInteraction } from '../hooks/useApplications';
import { format } from 'date-fns';
import StatusBadge from '../components/StatusBadge';
import ApplicationFormModal from '../components/ApplicationFormModal';

const ApplicationDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: application, isLoading } = useApplication(id!);
    const deleteMutation = useDeleteApplication();
    const addInteractionMutation = useAddInteraction();

    const [showEditModal, setShowEditModal] = useState(false);
    const [showInteractionForm, setShowInteractionForm] = useState(false);
    const [interactionData, setInteractionData] = useState({
        type: 'email' as const,
        date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this application?')) {
            await deleteMutation.mutateAsync(id!);
            navigate('/applications');
        }
    };

    const handleAddInteraction = async (e: React.FormEvent) => {
        e.preventDefault();
        await addInteractionMutation.mutateAsync({
            id: id!,
            interaction: {
                ...interactionData,
                date: new Date(interactionData.date),
            },
        });
        setShowInteractionForm(false);
        setInteractionData({
            type: 'email',
            date: new Date().toISOString().split('T')[0],
            notes: '',
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!application) {
        return (
            <div className="card text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">Application not found</h3>
                <Link to="/applications" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
                    ← Back to applications
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <Link to="/applications" className="text-primary-600 hover:text-primary-700 text-sm font-medium mb-4 inline-block">
                    ← Back to applications
                </Link>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{application.companyName}</h1>
                        <p className="text-xl text-gray-600">{application.jobTitle}</p>
                    </div>
                    <div className="flex gap-2 mt-4 sm:mt-0">
                        <button onClick={() => setShowEditModal(true)} className="btn btn-secondary">
                            Edit
                        </button>
                        <button onClick={handleDelete} className="btn btn-danger" disabled={deleteMutation.isPending}>
                            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="card">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Status</p>
                                <div className="mt-1">
                                    <StatusBadge status={application.status} size="md" />
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Job Portal</p>
                                <p className="mt-1 font-medium">{application.jobPortal}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Employment Type</p>
                                <p className="mt-1 font-medium">{application.employmentType}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Source</p>
                                <p className="mt-1 font-medium">{application.source}</p>
                            </div>
                            {application.location && (
                                <div>
                                    <p className="text-sm text-gray-600">Location</p>
                                    <p className="mt-1 font-medium">{application.location}</p>
                                </div>
                            )}
                            {application.salaryRange && (
                                <div>
                                    <p className="text-sm text-gray-600">Salary Range</p>
                                    <p className="mt-1 font-medium">{application.salaryRange}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-gray-600">Date Applied</p>
                                <p className="mt-1 font-medium">{format(new Date(application.dateApplied), 'MMM d, yyyy')}</p>
                            </div>
                            {application.followUpDate && (
                                <div>
                                    <p className="text-sm text-gray-600">Follow-up Date</p>
                                    <p className="mt-1 font-medium text-orange-600">
                                        {format(new Date(application.followUpDate), 'MMM d, yyyy')}
                                    </p>
                                </div>
                            )}
                        </div>

                        {application.jobLink && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <a
                                    href={application.jobLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                >
                                    View Job Posting →
                                </a>
                            </div>
                        )}

                        {application.notes && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">Notes</p>
                                <p className="text-gray-900">{application.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Recruiter Info */}
                    {(application.recruiterName || application.recruiterEmail || application.recruiterPhone) && (
                        <div className="card">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recruiter Information</h2>
                            <div className="space-y-3">
                                {application.recruiterName && (
                                    <div>
                                        <p className="text-sm text-gray-600">Name</p>
                                        <p className="mt-1 font-medium">{application.recruiterName}</p>
                                    </div>
                                )}
                                {application.recruiterEmail && (
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <a href={`mailto:${application.recruiterEmail}`} className="mt-1 text-primary-600 hover:text-primary-700">
                                            {application.recruiterEmail}
                                        </a>
                                    </div>
                                )}
                                {application.recruiterPhone && (
                                    <div>
                                        <p className="text-sm text-gray-600">Phone</p>
                                        <a href={`tel:${application.recruiterPhone}`} className="mt-1 text-primary-600 hover:text-primary-700">
                                            {application.recruiterPhone}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Interactions */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Interactions</h2>
                            <button
                                onClick={() => setShowInteractionForm(!showInteractionForm)}
                                className="btn btn-primary btn-sm"
                            >
                                + Add Interaction
                            </button>
                        </div>

                        {showInteractionForm && (
                            <form onSubmit={handleAddInteraction} className="mb-4 p-4 bg-gray-50 rounded-lg">
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                        <select
                                            value={interactionData.type}
                                            onChange={(e) => setInteractionData({ ...interactionData, type: e.target.value as any })}
                                            className="input"
                                        >
                                            <option value="email">Email</option>
                                            <option value="call">Call</option>
                                            <option value="interview">Interview</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                        <input
                                            type="date"
                                            value={interactionData.date}
                                            onChange={(e) => setInteractionData({ ...interactionData, date: e.target.value })}
                                            className="input"
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                    <textarea
                                        value={interactionData.notes}
                                        onChange={(e) => setInteractionData({ ...interactionData, notes: e.target.value })}
                                        className="input"
                                        rows={2}
                                        required
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button type="submit" className="btn btn-primary" disabled={addInteractionMutation.isPending}>
                                        {addInteractionMutation.isPending ? 'Adding...' : 'Add'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowInteractionForm(false)}
                                        className="btn btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        {application.interactions.length > 0 ? (
                            <div className="space-y-3">
                                {application.interactions.map((interaction, index) => (
                                    <div key={index} className="border-l-4 border-primary-500 pl-4 py-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="badge bg-primary-100 text-primary-800">{interaction.type}</span>
                                            <span className="text-xs text-gray-500">
                                                {format(new Date(interaction.date), 'MMM d, yyyy')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700">{interaction.notes}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No interactions logged yet.</p>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status History */}
                    <div className="card">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Status History</h2>
                        <div className="space-y-3">
                            {application.statusHistory.map((history, index) => (
                                <div key={index} className="flex items-start">
                                    <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary-600"></div>
                                    <div className="ml-3 flex-1">
                                        <StatusBadge status={history.status as any} size="sm" />
                                        <p className="text-xs text-gray-500 mt-1">
                                            {format(new Date(history.changedAt), 'MMM d, yyyy h:mm a')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Additional Info */}
                    {application.resumeVersion && (
                        <div className="card">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Resume Version</h2>
                            <p className="text-gray-700">{application.resumeVersion}</p>
                        </div>
                    )}
                </div>
            </div>

            <ApplicationFormModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                application={application}
            />
        </div>
    );
};

export default ApplicationDetailPage;
