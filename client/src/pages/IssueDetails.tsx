import { useParams } from 'react-router-dom';
import { issues } from '../data/sampleIssues';
import { FaMapMarkerAlt, FaTag, FaThumbsUp, FaThumbsDown, FaShareAlt, FaDownload, FaFlag } from 'react-icons/fa';
import { useEffect } from 'react';

const IssueDetails = () => {
  const { id } = useParams<{ id: string }>();
  const issue = issues.find((i) => i.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!issue) return <div className="p-6 text-center text-red-500">Issue not found.</div>;

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto p-2 sm:p-4 gap-4 sm:gap-6">
      {/* Left Content */}
      <div className="flex-1 min-w-0">
        <img
          src={issue.imageUrl}
          alt={issue.title}
          className="rounded-xl w-full h-44 sm:h-64 object-cover mb-3 sm:mb-4"
        />

        <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-xl sm:text-2xl font-bold break-words">{issue.title}</h1>
          <span className={`text-xs sm:text-sm font-medium px-2 py-1 rounded self-start sm:self-auto ${issue.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
            issue.status === 'Resolved' ? 'bg-green-100 text-green-800' :
              'bg-blue-100 text-blue-800'
            }`}>
            {issue.status}
          </span>
        </div>

        {/* Action Options */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-3 sm:mb-4">
          <button className="flex items-center gap-1 text-green-600 hover:underline text-sm">
            <FaThumbsUp /> Upvote
          </button>
          <button className="flex items-center gap-1 text-red-600 hover:underline text-sm">
            <FaThumbsDown /> Downvote
          </button>
          <button className="flex items-center gap-1 text-blue-600 hover:underline text-sm">
            <FaShareAlt /> Share
          </button>
          <button className="flex items-center gap-1 text-gray-700 hover:underline text-sm">
            <FaDownload /> Download
          </button>
          <button className="flex items-center gap-1 text-orange-600 hover:underline text-sm">
            <FaFlag /> Report
          </button>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-3 sm:mb-4">
          <h2 className="text-lg font-semibold mb-2">Issue Description</h2>
          <p className="text-gray-700">{issue.description}</p>
        </div>

        {/* Comments */}
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-3 sm:mb-4">
          <h2 className="text-lg font-semibold mb-3">Community Discussion (3)</h2>
          <div className="space-y-3">
            {[
              {
                name: 'Sarah_K',
                time: '5 hours ago',
                text: 'I hit this pothole last week and it caused a flat tire! It really needs to be fixed ASAP. It\'s been there for months.',
              },
              {
                name: 'CityWatchDog',
                time: '3 hours ago',
                text: 'Thanks for reporting this! We\'ve flagged it for urgent review by the public works department. Please share any photos if you have them.',
              },
              {
                name: 'Mike_T',
                time: '1 hour ago',
                text: 'I drive this route daily. It\'s getting worse. The city needs to prioritize this, especially with winter coming.',
              }
            ].map((c, i) => (
              <div key={i} className="bg-gray-50 p-3 rounded border">
                <div className="text-sm font-semibold">{c.name}</div>
                <div className="text-xs text-gray-500 mb-1">{c.time}</div>
                <p className="text-sm text-gray-700">{c.text}</p>
              </div>
            ))}
          </div>

          {/* Comment Input */}
          <div className="mt-3 sm:mt-4 flex gap-2">
            <input
              type="text"
              className="flex-1 border rounded px-2 sm:px-3 py-2 text-sm"
              placeholder="Type your comment here..."
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 rounded">➤</button>
          </div>
        </div>

        {/* Engagement Bar Chart */}
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <h2 className="text-lg font-semibold mb-3">Issue Engagement</h2>
          <div className="flex items-end justify-between h-32 px-1 sm:px-2 relative">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-2 flex flex-col justify-between h-28 text-[10px] sm:text-xs text-gray-400" style={{ height: '112px' }}>
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>
            {/* Bars */}
            {[
              { value: 70, label: 'Mon' },
              { value: 100, label: 'Tue' },
              { value: 80, label: 'Wed' },
              { value: 30, label: 'Thu' },
              { value: 75, label: 'Fri' },
              { value: 65, label: 'Sat' }
            ].map((bar, i) => (
              <div key={i} className="flex flex-col items-center justify-end h-full z-10">
                <div
                  className="w-7 rounded-t-lg bg-gradient-to-t from-blue-400 to-blue-600 shadow-md flex items-end justify-center transition-all duration-300"
                  style={{ height: `${bar.value}%`, minHeight: '16px' }}
                >
                  <span className="text-xs text-white font-semibold mb-1">{bar.value}</span>
                </div>
                <span className="text-xs text-gray-500 mt-1">{bar.label}</span>
              </div>
            ))}
          </div>
          {/* X-axis label */}
          <div className="flex justify-center mt-2 text-[10px] sm:text-xs text-gray-400">Engagement by Day</div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-[320px] space-y-3 sm:space-y-4 flex-shrink-0 mt-4 lg:mt-0">
        <div className="flex flex-col gap-3 sm:gap-4 sticky top-4">
          {/* Location Card */}
          <div className="bg-white p-3 sm:p-4 rounded shadow">
            <h3 className="text-base font-semibold mb-2">Location & Details</h3>
            <img
              src="https://via.placeholder.com/300x150?text=Map+Preview"
              alt="Map preview"
              className="rounded mb-2 sm:mb-3 w-full object-cover"
            />
            <div className="text-sm text-gray-700 space-y-1">
              <div className="flex items-center gap-2"><FaMapMarkerAlt /> {issue.location}</div>
              <div className="flex items-center gap-2"><FaTag /> {issue.category}</div>
              <div className="text-xs text-gray-500">Reported on October 26, 2023 at 10:30 AM</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white p-3 sm:p-4 rounded shadow space-y-2 sm:space-y-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded text-sm">
              + Report New Issue
            </button>
            <div className="flex justify-around text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-1"><FaThumbsUp /> 125</div>
              <div className="flex items-center gap-1"><FaThumbsDown /> 12</div>
            </div>
            <div className="flex flex-wrap gap-2 justify-between text-[11px] sm:text-xs">
              <button className="text-blue-600 hover:underline flex items-center gap-1">
                <FaShareAlt /> Share
              </button>
              <button className="text-gray-700 hover:underline flex items-center gap-1">
                <FaDownload /> Download
              </button>
              <button className="text-red-600 hover:underline flex items-center gap-1">
                <FaFlag /> Report
              </button>
            </div>
          </div>

          {/* Related Issues */}
          <div className="bg-white p-3 sm:p-4 rounded shadow">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h3 className="text-sm sm:text-base font-semibold">Related Issues</h3>
              <button className="text-blue-600 text-xs hover:underline">View All</button>
            </div>
            {issues.filter((i) => i.id !== id).slice(0, 3).map((related) => (
              <div key={related.id} className="flex gap-2 sm:gap-3 mb-2 sm:mb-3">
                <img
                  src={related.imageUrl}
                  alt={related.title}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                />
                <div>
                  <p className="text-xs sm:text-sm font-medium line-clamp-1">{related.title}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">{related.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;
