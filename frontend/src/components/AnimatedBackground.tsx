import React from 'react';

const AnimatedBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {/* Base gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50" />

            {/* Animated gradient blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
            <div className="absolute bottom-20 right-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000" />

            {/* Additional smaller blobs for depth */}
            <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob-slow" />
            <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-violet-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob-slow animation-delay-3000" />
        </div>
    );
};

export default AnimatedBackground;
