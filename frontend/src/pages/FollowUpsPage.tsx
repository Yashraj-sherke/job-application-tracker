import { useState } from 'react';
import { useFollowUps } from '../hooks/useApplications';
import ApplicationCard from '../components/ApplicationCard';
import ApplicationFormModal from '../components/ApplicationFormModal';
import { format, isPast, isToday } from 'date-fns';

const FollowUpsPage = () => {
    const { data: followUps, isLoading } = useFollowUps();
    const [showModal, setShowModal] = useState(false);

    const getFollowUpStatus = (date: Date | string) => {
        const followUpDate = new Date(date);
        if (isToday(followUpDate)) return 'today';
        if (isPast(followUpDate)) return 'overdue';
        return 'upcoming';
    };

    const overdueApps = followUps?.filter((app) => getFollowUpStatus(app.followUpDate!) === 'overdue') || [];
    const todayApps = followUps?.filter((app) => getFollowUpStatus(app.followUpDate!) === 'today') || [];
    const upcomingApps = followUps?.filter((app) => getFollowUpStatus(app.followUpDate!) === 'upcoming') || [];

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
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Follow-ups</h1>
                <p className="text-gray-600">
                    {followUps?.length || 0} applications need follow-up
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="card bg-red-50 border-red-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-red-600">Overdue</p>
                            <p className="text-2xl font-bold text-red-700 mt-1">{overdueApps.length}</p>
                        </div>
                        <div className="bg-red-100 rounded-lg p-3">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card bg-orange-50 border-orange-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-orange-600">Today</p>
                            <p className="text-2xl font-bold text-orange-700 mt-1">{todayApps.length}</p>
                        </div>
                        <div className="bg-orange-100 rounded-lg p-3">
                            <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card bg-blue-50 border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-600">Upcoming</p>
                            <p className="text-2xl font-bold text-blue-700 mt-1">{upcomingApps.length}</p>
                        </div>
                        <div className="bg-blue-100 rounded-lg p-3">
                            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {followUps && followUps.length > 0 ? (
                <div className="space-y-8">
                    {/* Overdue */}
                    {overdueApps.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold text-red-700 mb-4 flex items-center">
                                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Overdue ({overdueApps.length})
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {overdueApps.map((app) => (
                                    <div key={app._id} className="relative">
                                        <div className="absolute -top-2 -right-2 z-10">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                {Math.abs(Math.floor((new Date().getTime() - new Date(app.followUpDate!).getTime()) / (1000 * 60 * 60 * 24)))} days overdue
                                            </span>
                                        </div>
                                        <ApplicationCard application={app} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Today */}
                    {todayApps.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold text-orange-700 mb-4 flex items-center">
                                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Due Today ({todayApps.length})
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {todayApps.map((app) => (
                                    <ApplicationCard key={app._id} application={app} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upcoming */}
                    {upcomingApps.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
                                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Upcoming ({upcomingApps.length})
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {upcomingApps.map((app) => (
                                    <ApplicationCard key={app._id} application={app} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="card text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No follow-ups needed</h3>
                    <p className="mt-1 text-sm text-gray-500">All caught up! No applications need follow-up right now.</p>
                </div>
            )}

            <ApplicationFormModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
};

export default FollowUpsPage;
