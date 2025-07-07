import { useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaTag, FaThumbsUp, FaThumbsDown, FaShareAlt, FaDownload, FaFlag, FaArrowLeft, FaComment, FaUser, FaCalendarAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';


// Fix default marker icon for leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Issue {
  id: string;
  issueType: string;
  department: string;
  description: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  images: string[];
  createdAt: Timestamp;
  reporter: {
    name: string;
    email: string;
    mobile: string;
  };
  status?: 'Pending' | 'Resolved' | 'In Progress';
}

const IssueDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [allIssues] = useState<Issue[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchIssue = async () => {
      try {
        const collections = [
          'potholeissues',
          'garbageissues',
          'streetlightissues',
          'waterleakissues',
          'brokenbenchissues',
          'treefallenissues',
          'manholeopenissues',
          'illegalparkingissues',
          'noisecomplaintissues',
          'animalmenaceissues',
          'blockeddrainissues',
          'poweroutageissues',
          'roaddamageissues',
          'otherissues'
        ];

        let foundIssue: Issue | null = null;

        for (const collectionName of collections) {
          const docRef = doc(db, collectionName, id || '');
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            foundIssue = {
              id: docSnap.id,
              ...docSnap.data()
            } as Issue;
            break;
          }
        }

        if (foundIssue) {
          setIssue(foundIssue);
        } else {
          setError('Issue not found');
        }
      } catch (err) {
        console.error('Error fetching issue:', err);
        setError('Failed to load issue details');
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-red-100 p-4 rounded-full mb-4">
        <FaFlag className="text-red-500 text-2xl" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Issue</h2>
      <p className="text-gray-600 mb-4">{error}</p>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
      >
        <FaArrowLeft /> Back to Issues
      </button>
    </div>
  );

  if (!issue) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-yellow-100 p-4 rounded-full mb-4">
        <FaFlag className="text-yellow-500 text-2xl" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Issue Not Found</h2>
      <p className="text-gray-600 mb-4">The requested issue could not be found in our system.</p>
      <button
        onClick={() => navigate('/report-issue')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
      >
        Report New Issue
      </button>
    </div>
  );

  const reportedDate = issue.createdAt?.toDate().toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) || 'Date not available';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <FaArrowLeft /> Back to Issues
      </button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Issue Header */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{issue.issueType}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs sm:text-sm font-medium px-3 py-1 rounded-full ${issue.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    issue.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                    {issue.status || 'Pending'}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <FaCalendarAlt className="text-gray-400" />
                    {reportedDate}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm transition-colors">
                  <FaShareAlt className="text-blue-600" /> Share
                </button>
                <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm transition-colors">
                  <FaDownload className="text-gray-600" /> Download
                </button>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="mb-6">
              <img
                src={issue.images?.[0] || 'https://via.placeholder.com/800x450?text=No+Image+Available'}
                alt={issue.issueType}
                className="rounded-lg w-full h-auto max-h-96 object-cover shadow-sm"
              />
              {issue.images?.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {issue.images.slice(1, 5).map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${issue.issueType} ${index + 2}`}
                      className="rounded-lg w-full h-20 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab('discussion')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'discussion' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Discussion (3)
                </button>
                <button
                  onClick={() => setActiveTab('updates')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'updates' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Updates
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Issue Description</h2>
                  <p className="text-gray-700 whitespace-pre-line">{issue.description}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Location Details</h2>
                  <div className="h-64 w-full rounded-lg overflow-hidden mb-4">
                    {issue.coordinates && (
                      <MapContainer
                        center={[issue.coordinates.lat, issue.coordinates.lng]}
                        zoom={15}
                        style={{ height: '100%', width: '100%' }}
                        className="rounded-lg"
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={[issue.coordinates.lat, issue.coordinates.lng]}>
                          <Popup>
                            {issue.issueType}<br />
                            {issue.location}
                          </Popup>
                        </Marker>
                      </MapContainer>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <FaMapMarkerAlt className="text-gray-500 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Address</h3>
                        <p className="text-gray-700">{issue.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FaTag className="text-gray-500 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Responsible Department</h3>
                        <p className="text-gray-700">{issue.department}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FaUser className="text-gray-500 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Reported By</h3>
                        <p className="text-gray-700">
                          {issue.reporter?.name || 'Anonymous'}
                          {issue.reporter?.mobile && (
                            <>
                              <br />
                              <a
                                href={`tel:${issue.reporter.mobile}`}
                                className="text-blue-600 hover:underline"
                              >
                                {issue.reporter.mobile}
                              </a>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'discussion' && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Community Discussion</h2>

                  <div className="space-y-4">
                    {[
                      {
                        name: 'Sarah_K',
                        time: '5 hours ago',
                        text: 'I noticed this issue too. It really needs to be fixed ASAP!',
                        likes: 12
                      },
                      {
                        name: 'CityWatchDog',
                        time: '3 hours ago',
                        text: 'Thanks for reporting this! We\'ve flagged it for review.',
                        likes: 8
                      },
                      {
                        name: 'Mike_T',
                        time: '1 hour ago',
                        text: 'This has been a problem for a while. The city needs to prioritize this.',
                        likes: 5
                      }
                    ].map((comment, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-xs border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center">
                              <FaUser className="text-sm" />
                            </div>
                            <span className="font-medium text-gray-900">{comment.name}</span>
                          </div>
                          <span className="text-xs text-gray-500">{comment.time}</span>
                        </div>
                        <p className="text-gray-700 mb-3">{comment.text}</p>
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 text-sm">
                            <FaThumbsUp /> {comment.likes}
                          </button>
                          <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm">
                            <FaComment /> Reply
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Add your comment</h3>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                      placeholder="Share your thoughts about this issue..."
                    ></textarea>
                    <div className="flex justify-end mt-2">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'updates' && (
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Issue Updates</h2>

                <div className="space-y-4">
                  <div className="relative pl-6 pb-6 border-l-2 border-gray-200">
                    <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-2 top-0"></div>
                    <div className="bg-white p-4 rounded-lg shadow-xs">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-gray-900">Issue Reported</h3>
                        <span className="text-xs text-gray-500">2 days ago</span>
                      </div>
                      <p className="text-gray-700 text-sm">The issue was reported to the {issue.department} department.</p>
                    </div>
                  </div>

                  <div className="relative pl-6 pb-6 border-l-2 border-gray-200">
                    <div className="absolute w-4 h-4 bg-yellow-500 rounded-full -left-2 top-0"></div>
                    <div className="bg-white p-4 rounded-lg shadow-xs">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-gray-900">Under Review</h3>
                        <span className="text-xs text-gray-500">1 day ago</span>
                      </div>
                      <p className="text-gray-700 text-sm">The issue is currently being reviewed by the department.</p>
                    </div>
                  </div>

                  {issue.status === 'Resolved' && (
                    <div className="relative pl-6 border-l-2 border-gray-200">
                      <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-2 top-0"></div>
                      <div className="bg-white p-4 rounded-lg shadow-xs">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-medium text-gray-900">Issue Resolved</h3>
                          <span className="text-xs text-gray-500">Today</span>
                        </div>
                        <p className="text-gray-700 text-sm">The issue has been successfully resolved.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Issue Status</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-medium">
                    {issue.status === 'Resolved' ? '100%' : issue.status === 'In Progress' ? '65%' : '20%'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${issue.status === 'Resolved' ? 'bg-green-500' : issue.status === 'In Progress' ? 'bg-yellow-500' : 'bg-blue-500'}`}
                    style={{ width: issue.status === 'Resolved' ? '100%' : issue.status === 'In Progress' ? '65%' : '20%' }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Priority</span>
                <span className="text-sm font-medium text-red-600">High</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Community Impact</span>
                <span className="text-sm font-medium text-yellow-600">Medium</span>
              </div>
            </div>
          </div>

          {/* Engagement Card */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Community Engagement</h2>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FaThumbsUp className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Upvotes</p>
                  <p className="font-semibold text-gray-900">125</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-red-100 p-2 rounded-full">
                  <FaThumbsDown className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Downvotes</p>
                  <p className="font-semibold text-gray-900">12</p>
                </div>
              </div>
            </div>

            <div className="h-40">
              <div className="flex items-end justify-between h-full px-2">
                {[
                  { value: 70, label: 'Mon' },
                  { value: 100, label: 'Tue' },
                  { value: 80, label: 'Wed' },
                  { value: 30, label: 'Thu' },
                  { value: 75, label: 'Fri' },
                  { value: 65, label: 'Sat' },
                  { value: 40, label: 'Sun' }
                ].map((bar, i) => (
                  <div key={i} className="flex flex-col items-center justify-end h-full">
                    <div
                      className="w-4 rounded-t-lg bg-gradient-to-t from-blue-400 to-blue-600 shadow-sm"
                      style={{ height: `${bar.value}%`, minHeight: '8px' }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-1">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Related Issues</h2>
              <Link
                to="/issues"
                className="text-blue-600 text-sm hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {allIssues
                .filter(related =>
                  related.id !== issue.id &&
                  (related.issueType === issue.issueType ||
                    related.department === issue.department)
                )
                .slice(0, 3) // Show max 3 related issues
                .map((related) => (
                  <Link
                    to={`/issues/${related.id}`}
                    key={related.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <img
                      src={related.images?.[0] || 'https://via.placeholder.com/150'}
                      alt={related.issueType}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {related.issueType}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${related.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          related.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                          {related.status || 'Pending'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {related.createdAt?.toDate().toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              }
              {allIssues.filter(related =>
                related.id !== issue.id &&
                (related.issueType === issue.issueType ||
                  related.department === issue.department)
              ).length === 0 && (
                  <p className="text-sm text-gray-500 py-2">
                    No related issues found.
                  </p>
                )}
            </div>
          </div>

          {/* Report New Issue */}
          <div className="bg-blue-50 rounded-xl shadow-sm p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Found Another Issue?</h2>
            <p className="text-sm text-gray-600 mb-4">Help keep your community clean and safe by reporting new issues.</p>
            <button
              onClick={() => navigate('/report-issue')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <FaFlag /> Report New Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;