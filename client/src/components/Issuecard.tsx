import React from 'react';
import { FaMapMarkerAlt, FaTag, FaUser, FaPhone, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';

export interface Issue {
  id: string;
  issueType?: string;
  department?: string;
  description?: string;
  location?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  images?: string[];
  createdAt?: Timestamp | { seconds: number; nanoseconds: number };
  reporter?: {
    name?: string;
    email?: string;
    mobile?: string;
  };
  status?: 'Pending' | 'Resolved' | 'In Progress';
}

interface IssueCardProps {
  issue: Issue;
}

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Resolved: 'bg-green-100 text-green-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  default: 'bg-gray-100 text-gray-700',
};

const formatTimeAgo = (timestamp?: Timestamp | { seconds: number; nanoseconds: number }) => {
  if (!timestamp || !('seconds' in timestamp)) return 'Recently';

  const date = new Date(timestamp.seconds * 1000);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  const timeAgo = formatTimeAgo(issue.createdAt);
  const status = issue.status || 'Pending';
  const statusColor = statusColors[status] || statusColors.default;
  const firstImage = issue.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image';
  const location = issue.location?.split(',')[0] || 'Location not specified';
  const department = issue.department || 'Department not specified';
  const description = issue.description || 'No description provided';
  const issueType = issue.issueType || 'Issue';

  return (
    <Link to={`/issues/${issue.id}`} className="block h-full">
      <div className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden flex flex-col h-full cursor-pointer">
        <img
          src={firstImage}
          alt={issueType}
          className="w-full h-36 xs:h-40 sm:h-44 md:h-48 object-cover"
        />

        <div className="p-3 xs:p-4 flex flex-col flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${statusColor}`}>
              {status}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <FaCalendarAlt className="text-gray-400" />
              {timeAgo}
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-semibold mb-1 text-gray-800">
            {issueType}
          </h3>

          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2">
            {description}
          </p>

          <div className="flex flex-wrap text-xs text-gray-500 gap-3 mb-3">
            <span className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-gray-400" />
              {location}
            </span>

            <span className="flex items-center gap-1">
              <FaTag className="text-gray-400" />
              {department}
            </span>
          </div>

          {/* Reporter information - only shown if reporter exists */}
          {issue.reporter && (
            <div className="mt-auto pt-2 border-t border-gray-100">
              {issue.reporter.name && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FaUser className="text-gray-400" />
                  <span>{issue.reporter.name}</span>
                </div>
              )}
              {issue.reporter.mobile && (
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <FaPhone className="text-gray-400" />
                  <span>{issue.reporter.mobile}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default IssueCard;