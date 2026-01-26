import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApplications, useFollowUps } from '../hooks/useApplications';
import ApplicationCard from '../components/ApplicationCard';
import ApplicationFormModal from '../components/ApplicationFormModal';

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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8 animate-fade-in-up">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400">Track and manage your job applications</p>
            </div>

            {/* Premium Stats Grid with Glassmorphism */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="glass-card-premium group hover:scale-105 transition-all duration-300 p-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white shadow-xl shadow-blue-500/30 dark:shadow-blue-500/20 animate-fade-in-up" style={{ animationDelay: '0s' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Total Applications</p>
                            <p className="text-4xl font-bold mt-2">{stats.total}</p>
                        </div>
                        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3 group-hover:scale-110 transition-transform">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="glass-card-premium group hover:scale-105 transition-all duration-300 p-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white shadow-xl shadow-green-500/30 dark:shadow-green-500/20 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Interviewing</p>
                            <p className="text-4xl font-bold mt-2">{stats.interviewing}</p>
                        </div>
                        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3 group-hover:scale-110 transition-transform">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="glass-card-premium group hover:scale-105 transition-all duration-300 p-6 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 text-white shadow-xl shadow-purple-500/30 dark:shadow-purple-500/20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">This Week</p>
                            <p className="text-4xl font-bold mt-2">{stats.thisWeek}</p>
                        </div>
                        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3 group-hover:scale-110 transition-transform">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="glass-card-premium group hover:scale-105 transition-all duration-300 p-6 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 text-white shadow-xl shadow-orange-500/30 dark:shadow-orange-500/20 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium">Follow-ups</p>
                            <p className="text-4xl font-bold mt-2">{stats.followUps}</p>
                        </div>
                        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3 group-hover:scale-110 transition-transform">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="glass-card p-6 text-center hover:shadow-lg transition-all duration-300 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 backdrop-blur-sm">
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">{stats.applied}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Applied</p>
                </div>
                <div className="glass-card p-6 text-center hover:shadow-lg transition-all duration-300 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 backdrop-blur-sm">
                    <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-300 bg-clip-text text-transparent">{stats.offers}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Offers</p>
                </div>
                <div className="glass-card p-6 text-center hover:shadow-lg transition-all duration-300 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 backdrop-blur-sm">
                    <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-500 dark:from-red-400 dark:to-red-300 bg-clip-text text-transparent">{stats.rejected}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Rejected</p>
                </div>
                <div className="glass-card p-6 text-center hover:shadow-lg transition-all duration-300 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 backdrop-blur-sm">
                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 dark:from-purple-400 dark:to-purple-300 bg-clip-text text-transparent">
                        {stats.total > 0 ? Math.round((stats.interviewing / stats.total) * 100) : 0}%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Interview Rate</p>
                </div>
            </div>

            {/* Actions and Recent Applications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 backdrop-blur-sm">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <button
                                onClick={() => setShowModal(true)}
                                className="w-full btn bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/20 flex items-center justify-center transform hover:scale-105 transition-all"
                            >
                                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Application
                            </button>
                            <Link to="/kanban" className="w-full btn bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transform hover:scale-105 transition-all">
                                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                                </svg>
                                View Kanban
                            </Link>
                            <Link to="/follow-ups" className="w-full btn bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transform hover:scale-105 transition-all">
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
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Applications</h2>
                        <Link to="/applications" className="text-sm bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent hover:from-indigo-700 hover:to-purple-700 font-medium transition-all">
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
                        <div className="glass-card p-12 text-center rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 backdrop-blur-sm">
                            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No applications yet</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by adding your first application.</p>
                            <div className="mt-6">
                                <button onClick={() => setShowModal(true)} className="btn bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30">
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
