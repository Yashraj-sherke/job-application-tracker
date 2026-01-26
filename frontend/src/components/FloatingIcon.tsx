import React from 'react';

interface FloatingIconProps {
    icon: React.ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({
    icon,
    delay = 0,
    duration = 3,
    className = ''
}) => {
    return (
        <div
            className={`floating-icon ${className}`}
            style={{
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`
            }}
        >
            {icon}
        </div>
    );
};

export default FloatingIcon;
