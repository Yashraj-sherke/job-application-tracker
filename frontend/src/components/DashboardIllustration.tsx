import React from 'react';
import FloatingIcon from './FloatingIcon';

const DashboardIllustration: React.FC = () => {
    return (
        <div className="relative w-full h-full flex items-center justify-center p-8">
            {/* Main dashboard mockup */}
            <div className="relative w-full max-w-lg">
                {/* Floating stat cards */}
                <div className="grid grid-cols-2 gap-4 mb-6 animate-fade-in-up">
                    {/* Total Applications Card */}
                    <div className="glass-card p-6 rounded-2xl transform hover:scale-105 transition-transform duration-300 animate-float" style={{ animationDelay: '0s' }}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">Applications</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">24</p>
                    </div>

                    {/* Interviews Card */}
                    <div className="glass-card p-6 rounded-2xl transform hover:scale-105 transition-transform duration-300 animate-float" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">Interviews</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">8</p>
                    </div>

                    {/* Offers Card */}
                    <div className="glass-card p-6 rounded-2xl transform hover:scale-105 transition-transform duration-300 animate-float" style={{ animationDelay: '0.4s' }}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">Offers</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">3</p>
                    </div>

                    {/* Pending Card */}
                    <div className="glass-card p-6 rounded-2xl transform hover:scale-105 transition-transform duration-300 animate-float" style={{ animationDelay: '0.6s' }}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">Pending</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">13</p>
                    </div>
                </div>

                {/* Floating 3D Icons */}
                <FloatingIcon
                    delay={0}
                    className="absolute -top-8 -left-8"
                    icon={
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-2xl flex items-center justify-center transform rotate-12">
                            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                    }
                />

                <FloatingIcon
                    delay={0.5}
                    duration={4}
                    className="absolute -top-4 -right-12"
                    icon={
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center transform -rotate-12">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                    }
                />

                <FloatingIcon
                    delay={1}
                    duration={3.5}
                    className="absolute -bottom-6 -left-10"
                    icon={
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl shadow-2xl flex items-center justify-center transform rotate-6">
                            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                    }
                />

                <FloatingIcon
                    delay={1.5}
                    duration={4.5}
                    className="absolute -bottom-8 -right-8"
                    icon={
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl shadow-2xl flex items-center justify-center transform -rotate-6">
                            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    }
                />

                {/* Status badges */}
                <div className="flex gap-2 justify-center mt-8 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium shadow-sm">
                        Active
                    </span>
                    <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium shadow-sm">
                        In Progress
                    </span>
                    <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium shadow-sm">
                        Pending
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DashboardIllustration;
