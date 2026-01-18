import { useState } from 'react';
import { useApplications, useExportCSV, useImportCSV } from '../hooks/useApplications';
import { ApplicationFilters } from '../types';
import ApplicationCard from '../components/ApplicationCard';
import ApplicationFormModal from '../components/ApplicationFormModal';

const ApplicationsPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [filters, setFilters] = useState<ApplicationFilters>({
        page: 1,
        limit: 12,
    });

    const { data, isLoading } = useApplications(filters);
    const exportMutation = useExportCSV();
    const importMutation = useImportCSV();

    const applications = data?.data || [];
    const pagination = data?.pagination;

    const handleExport = () => {
        exportMutation.mutate();
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            importMutation.mutate(file);
            e.target.value = '';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">All Applications</h1>
                    <p className="text-gray-600">
                        {pagination?.total || 0} total applications
                    </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
                    <button onClick={() => setShowModal(true)} className="btn btn-primary">
                        + Add Application
                    </button>
                    <button onClick={handleExport} className="btn btn-secondary" disabled={exportMutation.isPending}>
                        {exportMutation.isPending ? 'Exporting...' : '📥 Export CSV'}
                    </button>
                    <label className="btn btn-secondary cursor-pointer">
                        📤 Import CSV
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleImport}
                            className="hidden"
                            disabled={importMutation.isPending}
                        />
                    </label>
                </div>
            </div>

            {/* Filters */}
            <div className="card mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <input
                            type="text"
                            placeholder="Company or job title..."
                            value={filters.search || ''}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                            className="input"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={filters.status || ''}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                            className="input"
                        >
                            <option value="">All Statuses</option>
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Portal</label>
                        <select
                            value={filters.portal || ''}
                            onChange={(e) => setFilters({ ...filters, portal: e.target.value, page: 1 })}
                            className="input"
                        >
                            <option value="">All Portals</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Naukri">Naukri</option>
                            <option value="Foundit">Foundit</option>
                            <option value="Glassdoor">Glassdoor</option>
                            <option value="Company site">Company site</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                        <select
                            value={filters.sortBy || 'dateApplied'}
                            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value, page: 1 })}
                            className="input"
                        >
                            <option value="dateApplied">Date Applied</option>
                            <option value="companyName">Company Name</option>
                            <option value="status">Status</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Applications Grid */}
            {applications.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {applications.map((app) => (
                            <ApplicationCard key={app._id} application={app} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.pages > 1 && (
                        <div className="flex items-center justify-center space-x-2">
                            <button
                                onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                                disabled={filters.page === 1}
                                className="btn btn-secondary disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-600">
                                Page {pagination.page} of {pagination.pages}
                            </span>
                            <button
                                onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                                disabled={filters.page === pagination.pages}
                                className="btn btn-secondary disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="card text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or add a new application.</p>
                </div>
            )}

            <ApplicationFormModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
};

export default ApplicationsPage;
