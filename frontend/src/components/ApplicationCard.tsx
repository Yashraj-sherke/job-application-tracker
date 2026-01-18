import { Link } from 'react-router-dom';
import { Application } from '../types';
import StatusBadge from './StatusBadge';
import { format } from 'date-fns';

interface ApplicationCardProps {
    application: Application;
    onClick?: () => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onClick }) => {
    const getPortalColor = (portal: Application['jobPortal']) => {
        switch (portal) {
            case 'LinkedIn':
                return 'bg-blue-600 text-white';
            case 'Naukri':
                return 'bg-indigo-600 text-white';
            case 'Foundit':
                return 'bg-purple-600 text-white';
            case 'Glassdoor':
                return 'bg-green-600 text-white';
            case 'Company site':
                return 'bg-gray-600 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    const cardContent = (
        <div
            className="card hover:shadow-md transition-shadow cursor-pointer"
            onClick={onClick}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {application.companyName}
                    </h3>
                    <p className="text-gray-600 text-sm">{application.jobTitle}</p>
                </div>
                <StatusBadge status={application.status} />
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
                <span className={`badge ${getPortalColor(application.jobPortal)}`}>
                    {application.jobPortal}
                </span>
                {application.location && (
                    <span className="badge bg-gray-100 text-gray-700">
                        📍 {application.location}
                    </span>
                )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Applied: {format(new Date(application.dateApplied), 'MMM d, yyyy')}</span>
                {application.followUpDate && (
                    <span className="text-orange-600 font-medium">
                        Follow-up: {format(new Date(application.followUpDate), 'MMM d')}
                    </span>
                )}
            </div>
        </div>
    );

    if (onClick) {
        return cardContent;
    }

    return <Link to={`/applications/${application._id}`}>{cardContent}</Link>;
};

export default ApplicationCard;
