import { Application } from '../types';

interface StatusBadgeProps {
    status: Application['status'];
    size?: 'sm' | 'md';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
    const getStatusColor = (status: Application['status']) => {
        switch (status) {
            case 'Backlog':
                return 'bg-gray-100 text-gray-800';
            case 'Applied':
                return 'bg-blue-100 text-blue-800';
            case 'HR Screen':
                return 'bg-yellow-100 text-yellow-800';
            case 'Technical Round':
                return 'bg-orange-100 text-orange-800';
            case 'Managerial Round':
                return 'bg-purple-100 text-purple-800';
            case 'Offer':
                return 'bg-green-100 text-green-800';
            case 'Rejected':
                return 'bg-red-100 text-red-800';
            case 'On hold':
                return 'bg-indigo-100 text-indigo-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs';

    return (
        <span className={`badge ${getStatusColor(status)} ${sizeClasses}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
