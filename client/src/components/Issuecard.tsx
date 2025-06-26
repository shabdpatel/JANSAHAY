// src/components/Issuecard.tsx
import React from 'react';
import { FaMapMarkerAlt, FaTag } from 'react-icons/fa';

export interface Issue {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  status: 'Pending' | 'Resolved' | 'In Progress';
  timeAgo: string;
  imageUrl: string;
}

interface IssueCardProps {
  issue: Issue;
}

const statusColors: Record<Issue['status'], string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Resolved: 'bg-green-100 text-green-700',
  'In Progress': 'bg-blue-100 text-blue-700',
};

const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden flex flex-col h-full">
      <img
        src={issue.imageUrl}
        alt={issue.title}
        className="w-full h-36 xs:h-40 sm:h-44 md:h-48 object-cover"
      />
      <div className="p-3 xs:p-4 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-1">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded ${statusColors[issue.status]}`}
          >
            {issue.status}
          </span>
          <span className="text-xs text-gray-500">{issue.timeAgo}</span>
        </div>
        <h3 className="text-sm sm:text-base font-semibold mb-1 text-gray-800">
          {issue.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2">
          {issue.description}
        </p>
        <div className="flex flex-wrap text-xs text-gray-500 gap-3 mb-3">
          <span className="flex items-center gap-1">
            <FaMapMarkerAlt className="text-gray-400" />
            {issue.location}
          </span>
          <span className="flex items-center gap-1">
            <FaTag className="text-gray-400" />
            {issue.category}
          </span>
        </div>
        <div className="mt-auto">
          <button className="text-blue-600 text-xs font-medium hover:underline">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
