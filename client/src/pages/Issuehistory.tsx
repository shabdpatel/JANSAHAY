import { useState, useEffect } from 'react';
import IssueCard from './../components/Issuecard';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { FaClipboardList, FaCheckCircle, FaClock } from 'react-icons/fa';


// Helper functions
const getUnique = (arr: any[], key: string) =>
    Array.from(new Set(arr.map(item => item[key] || ''))).filter(v => v && v !== '');

const getStatusList = (arr: any[]) =>
    Array.from(new Set(arr.map(item => item.status || 'Pending')));

const Issuehistory = () => {
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [deptFilter, setDeptFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [issues, setIssues] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                const userEmail = user?.email;

                if (!userEmail) {
                    console.error("User not logged in");
                    setIssues([]);
                    setLoading(false);
                    return;
                }

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

                let allIssues: any[] = [];

                for (const collectionName of collections) {
                    const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach((doc) => {
                        allIssues.push({
                            id: doc.id,
                            ...doc.data()
                        });
                    });
                }

                const userIssues = allIssues.filter(issue => issue?.reporter?.email === userEmail);
                setIssues(userIssues);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching issues:", error);
                setLoading(false);
            }
        };

        fetchIssues();
    }, []);

    // Calculate counts
    const totalIssues = issues.length;
    const resolvedIssues = issues.filter(issue => issue.status === 'Resolved').length;
    const pendingIssues = issues.filter(issue => issue.status === 'Pending' || !issue.status).length;

    // Get unique values for filters
    const issueTypes = getUnique(issues, 'issueType');
    const departments = getUnique(issues, 'department');
    const statuses = getStatusList(issues);

    // Filter and search logic
    let filteredIssues = issues.filter((issue: any) => {
        const matchesSearch =
            (issue.issueType || '').toLowerCase().includes(search.toLowerCase()) ||
            (issue.description || '').toLowerCase().includes(search.toLowerCase()) ||
            (issue.location || '').toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter ? issue.issueType === typeFilter : true;
        const matchesDept = deptFilter ? issue.department === deptFilter : true;
        const matchesStatus = statusFilter ? (issue.status || 'Pending') === statusFilter : true;
        return matchesSearch && matchesType && matchesDept && matchesStatus;
    });

    // Sort logic
    filteredIssues = filteredIssues.sort((a: any, b: any) => {
        if (sortBy === 'newest') {
            return b.createdAt.seconds - a.createdAt.seconds;
        } else if (sortBy === 'oldest') {
            return a.createdAt.seconds - b.createdAt.seconds;
        }
        return 0;
    });

    // Format issues for IssueCard component
    const formattedIssues = filteredIssues.map((issue: any) => ({
        id: issue.id,
        issueType: issue.issueType,
        department: issue.department,
        description: issue.description,
        location: issue.location,
        coordinates: issue.coordinates,
        images: issue.images,
        createdAt: issue.createdAt,
        reporter: issue.reporter,
        status: issue.status || 'Pending'
    }));

    if (loading) {
        return (
            <div className="pt-4 sm:pt-8 px-2 sm:px-4 md:px-10 text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-600">Loading issues...</p>
            </div>
        );
    }

    return (
        <div className="pt-4 sm:pt-8 px-2 sm:px-4 md:px-10">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h1 className="text-lg sm:text-2xl font-semibold text-center sm:text-left">
                    Your Reported Issues
                </h1>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
                    <select
                        className="border border-gray-300 rounded-md p-2 text-sm"
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>
            </div>

            {/* Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <FaClipboardList className="text-blue-600 text-xl" />
                    </div>
                    <div>
                        <h3 className="text-gray-500 text-sm font-medium">Total Issues</h3>
                        <p className="text-2xl font-bold text-blue-600">{totalIssues}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="bg-green-100 p-3 rounded-full mr-4">
                        <FaCheckCircle className="text-green-600 text-xl" />
                    </div>
                    <div>
                        <h3 className="text-gray-500 text-sm font-medium">Resolved</h3>
                        <p className="text-2xl font-bold text-green-600">{resolvedIssues}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="bg-yellow-100 p-3 rounded-full mr-4">
                        <FaClock className="text-yellow-600 text-xl" />
                    </div>
                    <div>
                        <h3 className="text-gray-500 text-sm font-medium">Pending</h3>
                        <p className="text-2xl font-bold text-yellow-600">{pendingIssues}</p>
                    </div>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 items-center justify-between">
                <input
                    type="text"
                    placeholder="Search by issue type, description, or location"
                    className="w-full sm:w-1/4 border border-gray-300 rounded-md p-2 text-sm"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select
                    className="w-full sm:w-1/6 border border-gray-300 rounded-md p-2 text-sm"
                    value={typeFilter}
                    onChange={e => setTypeFilter(e.target.value)}
                >
                    <option value="">All Issue Types</option>
                    {issueTypes.map((type: string) => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                <select
                    className="w-full sm:w-1/6 border border-gray-300 rounded-md p-2 text-sm"
                    value={deptFilter}
                    onChange={e => setDeptFilter(e.target.value)}
                >
                    <option value="">All Departments</option>
                    {departments.map((dept: string) => (
                        <option key={dept} value={dept}>{dept}</option>
                    ))}
                </select>
                <select
                    className="w-full sm:w-1/6 border border-gray-300 rounded-md p-2 text-sm"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    {statuses.map((status: string) => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
                {(typeFilter || deptFilter || statusFilter || search) && (
                    <button
                        className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 rounded px-3 py-2 text-xs sm:text-sm"
                        onClick={() => {
                            setTypeFilter('');
                            setDeptFilter('');
                            setStatusFilter('');
                            setSearch('');
                        }}
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            <div className="px-2 sm:px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {formattedIssues.length > 0 ? (
                    formattedIssues.map((issue: any) => (
                        <IssueCard key={issue.id} issue={issue} />
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-500 py-8">
                        No issues found.
                    </div>
                )}
            </div>

            <div className="mt-10 text-center text-xs text-gray-400">
                Showing {formattedIssues.length} of {issues.length} issues.
            </div>
            <div className="mt-8 text-center">
                <span className="text-gray-500 text-sm">
                    Can't find your issue?{' '}
                    <a
                        href="/report-issue"
                        className="text-blue-600 hover:underline font-medium"
                    >
                        Report a New Issue
                    </a>
                </span>
            </div>
        </div>
    );
};

export default Issuehistory;