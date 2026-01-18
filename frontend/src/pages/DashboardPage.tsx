import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApplications, useFollowUps } from '../hooks/useApplications';
import ApplicationCard from '../components/ApplicationCard';
import ApplicationFormModal from '../components/ApplicationFormModal';
import { Application } from '../types';

const DashboardPage = () => {
    const [showModal, setShowModal] = useState(false);
    const { data: applicationsData, isLoading } = useApplications({ limit: 100 });
    const { data: followUps } = useFollowUps();

    const applications = applicationsData?.data || [];

    // Calculate stats
    const stats = {
        total: applications.length,
        applied: applications.filter((app) => app.status === 'Applied').length,
        interviewing: applications.filter((app) =>
            ['HR Screen', 'Technical Round', 'Managerial Round'].includes(app.status)
        ).length,
        offers: applications.filter((app) => app.status === 'Offer').length,
        rejected: applications.filter((app) => app.status === 'Rejected').length,
        thisWeek: applications.filter((app) => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(app.dateApplied) >= weekAgo;
        }).length,
        followUps: followUps?.length || 0,
    };

    const recentApplications = applications.slice(0, 6);

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
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">Track and manage your job applications</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Total Applications</p>
                            <p className="text-3xl font-bold mt-1">{stats.total}</p>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-lg p-3">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Interviewing</p>
                            <p className="text-3xl font-bold mt-1">{stats.interviewing}</p>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-lg p-3">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">This Week</p>
                            <p className="text-3xl font-bold mt-1">{stats.thisWeek}</p>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-lg p-3">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium">Follow-ups</p>
                            <p className="text-3xl font-bold mt-1">{stats.followUps}</p>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-lg p-3">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="card text-center">
                    <p className="text-2xl font-bold text-blue-600">{stats.applied}</p>
                    <p className="text-sm text-gray-600 mt-1">Applied</p>
                </div>
                <div className="card text-center">
                    <p className="text-2xl font-bold text-green-600">{stats.offers}</p>
                    <p className="text-sm text-gray-600 mt-1">Offers</p>
                </div>
                <div className="card text-center">
                    <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                    <p className="text-sm text-gray-600 mt-1">Rejected</p>
                </div>
                <div className="card text-center">
                    <p className="text-2xl font-bold text-purple-600">
                        {stats.total > 0 ? Math.round((stats.interviewing / stats.total) * 100) : 0}%
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Interview Rate</p>
                </div>
            </div>

            {/* Actions and Recent Applications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-1">
                    <div className="card">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <button
                                onClick={() => setShowModal(true)}
                                className="w-full btn btn-primary flex items-center justify-center"
                            >
                                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Application
                            </button>
                            <Link to="/kanban" className="w-full btn btn-secondary flex items-center justify-center">
                                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                                </svg>
                                View Kanban
                            </Link>
                            <Link to="/follow-ups" className="w-full btn btn-secondary flex items-center justify-center">
                                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                View Follow-ups
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Recent Applications */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
                        <Link to="/applications" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                            View All →
                        </Link>
                    </div>
                    {recentApplications.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recentApplications.map((app) => (
                                <ApplicationCard key={app._id} application={app} />
                            ))}
                        </div>
                    ) : (
                        <div className="card text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by adding your first application.</p>
                            <div className="mt-6">
                                <button onClick={() => setShowModal(true)} className="btn btn-primary">
                                    Add Application
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ApplicationFormModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
};

export default DashboardPage;
