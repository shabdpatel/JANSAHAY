import { useParams } from 'react-router-dom';
import { issues } from '../data/sampleIssues';
import { FaMapMarkerAlt, FaTag, FaThumbsUp, FaThumbsDown, FaShareAlt } from 'react-icons/fa';
import { useEffect } from 'react';

const IssueDetails = () => {
  const { id } = useParams<{ id: string }>();
  const issue = issues.find((i) => i.id === id); // Match as string

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!issue) return <div className="p-6 text-center text-red-500">Issue not found.</div>;

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto p-4 gap-4">
      {/* Left Main Content */}
      <div className="flex-1">
        <img src={issue.imageUrl} alt={issue.title} className="rounded-xl w-full h-64 object-cover mb-4" />

        <div className="mb-2 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{issue.title}</h1>
          <span className={`text-sm font-medium px-2 py-1 rounded ${issue.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
            issue.status === 'Resolved' ? 'bg-green-100 text-green-800' :
              'bg-blue-100 text-blue-800'
            }`}>
            {issue.status}
          </span>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">Issue Description</h2>
          <p className="text-gray-700">{issue.description}</p>
        </div>

        {/* Comments */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">Community Discussion (3)</h2>
          <div className="space-y-3">
            {[{ name: 'Sarah_K', time: '5 hours ago', text: 'I hit this pothole...' }, { name: 'CityWatchDog', time: '3 hours ago', text: 'Thanks for reporting...' }, { name: 'Mike_T', time: '1 hour ago', text: "I drive this route daily..." }]
              .map((c, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded border">
                  <div className="text-sm font-semibold">{c.name}</div>
                  <div className="text-xs text-gray-500 mb-1">{c.time}</div>
                  <p className="text-sm text-gray-700">{c.text}</p>
                </div>
              ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              className="flex-1 border rounded px-3 py-2 text-sm"
              placeholder="Type your comment here..."
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded">➤</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Issue Engagement</h2>
          <div className="flex justify-between items-end h-28">
            {[70, 100, 80, 30, 75, 65].map((h, i) => (
              <div key={i} className="w-6 bg-blue-500" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-base font-semibold mb-2">Location & Details</h3>
          <img
            src="https://via.placeholder.com/300x150?text=Map+Preview"
            alt="Map preview"
            className="rounded mb-3"
          />
          <div className="text-sm text-gray-700">
            <div className="flex items-center gap-2 mb-1"><FaMapMarkerAlt /> {issue.location}</div>
            <div className="flex items-center gap-2 mb-1"><FaTag /> {issue.category}</div>
            <div className="text-xs text-gray-500">Reported: 26 Oct 2023</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow space-y-3">
          <button className="bg-blue-600 text-white w-full py-2 rounded">+ Report New Issue</button>
          <div className="flex justify-around text-sm text-gray-600">
            <div className="flex items-center gap-1"><FaThumbsUp /> 125</div>
            <div className="flex items-center gap-1"><FaThumbsDown /> 12</div>
          </div>
          <div className="flex justify-between text-xs">
            <button className="text-blue-600 hover:underline"><FaShareAlt className="inline" /> Share</button>
            <button className="text-red-600 hover:underline">Report</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;
