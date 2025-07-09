// src/pages/AdminPanel.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { Dialog, Transition } from '@headlessui/react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Fragment } from 'react';

import { FaMapMarkerAlt, FaTag, FaUser, FaCalendarAlt, FaThumbsUp, FaThumbsDown, FaShareAlt, FaDownload, FaFlag } from 'react-icons/fa';
import {
    FiFilter,
    FiRefreshCw,
    FiSearch,
    FiAlertCircle,
    FiCheckCircle,
    FiClock,
    FiXCircle,
    FiMapPin,
    FiTag,
    FiUser,
    FiPhone
} from 'react-icons/fi';

// Status badge component
const StatusBadge = ({ status = 'pending' }: { status?: string }) => {
    // Ensure status is always defined and lowercase
    const normalizedStatus = (status || 'pending').toLowerCase();

    const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
        'pending': { color: 'bg-yellow-100 text-yellow-800', icon: <FiClock className="mr-1" /> },
        'in-progress': { color: 'bg-blue-100 text-blue-800', icon: <FiRefreshCw className="mr-1 animate-spin" /> },
        'resolved': { color: 'bg-green-100 text-green-800', icon: <FiCheckCircle className="mr-1" /> },
        'rejected': { color: 'bg-red-100 text-red-800', icon: <FiXCircle className="mr-1" /> }
    };

    const config = statusConfig[normalizedStatus] || statusConfig['pending'];

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
            {config.icon}
            {normalizedStatus}
        </span>
    );
};

// Fix default marker icons for leaflet
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Department icon mapping
const getDepartmentIcon = (dept: string) => {
    const icons: Record<string, string> = {
        'Public Works': '🏗️',
        'Sanitation': '🚮',
        'Electricity': '💡',
        'Water Supply': '🚰',
        'Parks & Recreation': '🌳',
        'Roads & Transport': '🚦',
        'Health': '🏥',
        'Police': '👮',
        'Fire Department': '🚒',
        'Animal Control': '🐾'
    };
    return icons[dept] || '📋';
};

const AdminPanel = () => {
    const [issues, setIssues] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [department, setDepartment] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0,
        rejected: 0
    });
    const navigate = useNavigate();

    const openIssueDetails = (issue: Issue) => {
        setSelectedIssue(issue);
        setIsDetailOpen(true);
    };

    const IssueDetailModal = () => (
        <Transition appear show={isDetailOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => setIsDetailOpen(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                {selectedIssue && (
                                    <div className="space-y-6">
                                        {/* Header */}
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900">
                                                    {selectedIssue.issueType}
                                                </Dialog.Title>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <StatusBadge status={selectedIssue.status} />
                                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                                        <FaCalendarAlt className="text-gray-400" />
                                                        {formatDate(selectedIssue.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setIsDetailOpen(false)}
                                                className="text-gray-400 hover:text-gray-500"
                                            >
                                                <span className="sr-only">Close</span>
                                                <FiXCircle className="h-6 w-6" />
                                            </button>
                                        </div>

                                        {/* Image Gallery */}
                                        <div>
                                            <img
                                                src={selectedIssue.images?.[0] || 'https://via.placeholder.com/800x450?text=No+Image+Available'}
                                                alt={selectedIssue.issueType}
                                                className="rounded-lg w-full h-auto max-h-96 object-cover shadow-sm"
                                            />
                                            {selectedIssue.images?.length > 1 && (
                                                <div className="grid grid-cols-4 gap-2 mt-2">
                                                    {selectedIssue.images.slice(1, 5).map((img, index) => (
                                                        <img
                                                            key={index}
                                                            src={img}
                                                            alt={`${selectedIssue.issueType} ${index + 2}`}
                                                            className="rounded-lg w-full h-20 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="md:col-span-2 space-y-6">
                                                <div className="bg-gray-50 rounded-lg p-6">
                                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Issue Description</h2>
                                                    <p className="text-gray-700 whitespace-pre-line">{selectedIssue.description}</p>
                                                </div>

                                                <div className="bg-gray-50 rounded-lg p-6">
                                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Location Details</h2>
                                                    <div className="h-64 w-full rounded-lg overflow-hidden mb-4">
                                                        {selectedIssue.coordinates ? (
                                                            <MapContainer
                                                                center={[selectedIssue.coordinates.lat, selectedIssue.coordinates.lng]}
                                                                zoom={15}
                                                                style={{ height: '100%', width: '100%' }}
                                                                className="rounded-lg"
                                                                zoomControl={true}
                                                                doubleClickZoom={true}
                                                                scrollWheelZoom={true}
                                                                touchZoom={true}
                                                                zoomAnimation={true}
                                                                fadeAnimation={true}
                                                                markerZoomAnimation={true}
                                                                dragging={true}
                                                            >
                                                                <LayersControl position="topright">
                                                                    <LayersControl.BaseLayer checked name="Street View">
                                                                        <TileLayer
                                                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                                        />
                                                                    </LayersControl.BaseLayer>
                                                                    <LayersControl.BaseLayer name="Satellite View">
                                                                        <TileLayer
                                                                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                                                            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                                                                        />
                                                                    </LayersControl.BaseLayer>
                                                                    <LayersControl.BaseLayer name="Topographic">
                                                                        <TileLayer
                                                                            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                                                                            attribution='Map data: &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
                                                                        />
                                                                    </LayersControl.BaseLayer>
                                                                </LayersControl>
                                                                <Marker position={[selectedIssue.coordinates.lat, selectedIssue.coordinates.lng]}>
                                                                    <Popup>
                                                                        {selectedIssue.issueType}<br />
                                                                        {selectedIssue.location}
                                                                    </Popup>
                                                                </Marker>
                                                            </MapContainer>
                                                        ) : (
                                                            <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                                                                <p className="text-gray-500">No location data available</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-start gap-3">
                                                            <FaMapMarkerAlt className="text-gray-500 mt-1 flex-shrink-0" />
                                                            <div>
                                                                <h3 className="text-sm font-medium text-gray-900">Address</h3>
                                                                <p className="text-gray-700">{selectedIssue.location}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <FaTag className="text-gray-500 mt-1 flex-shrink-0" />
                                                            <div>
                                                                <h3 className="text-sm font-medium text-gray-900">Responsible Department</h3>
                                                                <p className="text-gray-700">{selectedIssue.department}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <FaUser className="text-gray-500 mt-1 flex-shrink-0" />
                                                            <div>
                                                                <h3 className="text-sm font-medium text-gray-900">Reported By</h3>
                                                                <p className="text-gray-700">
                                                                    {selectedIssue.reporter?.name || 'Anonymous'}
                                                                    {selectedIssue.reporter?.mobile && (
                                                                        <>
                                                                            <br />
                                                                            <a
                                                                                href={`tel:${selectedIssue.reporter.mobile}`}
                                                                                className="text-blue-600 hover:underline"
                                                                            >
                                                                                {selectedIssue.reporter.mobile}
                                                                            </a>
                                                                        </>
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Sidebar */}
                                            <div className="space-y-6">
                                                {/* Status Card */}
                                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Issue Status</h2>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="text-sm font-medium text-gray-700">Progress</span>
                                                                <span className="text-sm font-medium">
                                                                    {selectedIssue.status === 'resolved' ? '100%' : selectedIssue.status === 'in-progress' ? '65%' : '20%'}
                                                                </span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                                <div
                                                                    className={`h-2.5 rounded-full ${selectedIssue.status === 'resolved' ? 'bg-green-500' : selectedIssue.status === 'in-progress' ? 'bg-yellow-500' : 'bg-blue-500'}`}
                                                                    style={{ width: selectedIssue.status === 'resolved' ? '100%' : selectedIssue.status === 'in-progress' ? '65%' : '20%' }}
                                                                ></div>
                                                            </div>
                                                        </div>

                                                        <div className="pt-4 border-t border-gray-200">
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Update Status
                                                            </label>
                                                            <select
                                                                value={selectedIssue.status}
                                                                onChange={(e) => {
                                                                    updateIssueStatus(selectedIssue.id, selectedIssue.collection, e.target.value);
                                                                    setSelectedIssue({
                                                                        ...selectedIssue,
                                                                        status: e.target.value
                                                                    });
                                                                }}
                                                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                            >
                                                                <option value="pending">Pending</option>
                                                                <option value="in-progress">In Progress</option>
                                                                <option value="resolved">Resolved</option>
                                                                <option value="rejected">Rejected</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Engagement Card */}
                                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
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

                                                    <div className="flex gap-4">
                                                        <button className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm transition-colors">
                                                            <FaShareAlt className="text-blue-600" /> Share
                                                        </button>
                                                        <button className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm transition-colors">
                                                            <FaDownload className="text-gray-600" /> Download
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );

    // Map department from email to Firestore collection naming pattern
    const getCollectionsForDepartment = (dept: string) => {
        const mapping: Record<string, string[]> = {
            'Public Works': [
                'potholeissues', 'roadissues', 'drainissues', 'manholeissues',
                'roadrepairissues', 'sidewalkissues', 'bridgeissues', 'brokenbenchissues'
            ],
            'Sanitation': [
                'garbageissues', 'cleaningissues', 'recyclingissues', 'dumpsterissues',
                'litterissues', 'publictoiletissues', 'wastecollectionissues'
            ],
            'Electricity': [
                'streetlightissues', 'powerissues', 'outageissues', 'wiringissues',
                'electricalhazardissues', 'transformerissues'
            ],
            'Water Supply': [
                'waterleakissues', 'blockeddrainissues', 'watersupplyissues',
                'drainageissues', 'floodingissues', 'waterqualityissues', 'meterissues'
            ],
            'Parks & Recreation': [
                'parkissues', 'playgroundissues', 'treeissues', 'benchissues',
                'fountainissues', 'sportsfacilityissues', 'trailissues'
            ],
            'Roads & Transport': [
                'trafficissues', 'parkingissues', 'roadissues', 'streetlightissues',
                'signissues', 'signalissues', 'busissues', 'pedestrianissues',
                'illegalparkingissues', 'manholeopenissues', 'treefallenissues'
            ],
            'Health': [
                'mosquitoissues', 'rodentissues', 'sanitationissues',
                'publichealthissues', 'clinicissues', 'restaurantissues'
            ],
            'Police': [
                'safetyissues', 'crimeissues', 'trafficissues', 'noiseissues',
                'patrolissues', 'securityissues'
            ],
            'Fire Department': [
                'firehazardissues', 'hydrantissues', 'safetyissues',
                'emergencyissues', 'alarmissues', 'accessissues'
            ],
            'Animal Control': [
                'animalmenaceissues', 'animalissues', 'strayissues',
                'wildlifeissues', 'noiseissues', 'biteissues', 'shelterissues'
            ],
            'Other': ['otherissues']
        };

        return mapping[dept] || [];
    };

    useEffect(() => {
        const auth = getAuth(app);
        const user = auth.currentUser;

        if (!user?.email) {
            navigate('/login');
            return;
        }



        // Extract department from admin email (admin.department@domain.com)
        const email = user.email.toLowerCase();
        const adminMatch = email.match(/^admin\.([a-z]+)@/i);

        if (!adminMatch) {
            navigate('/');
            return;
        }

        // Convert email department to match Firestore format
        let userDept = adminMatch[1];
        if (userDept.includes('public')) {
            userDept = 'Public Works';
        } else {
            // Capitalize first letter for other departments
            userDept = userDept.charAt(0).toUpperCase() + userDept.slice(1);
        }

        setDepartment(userDept);
        fetchAllDepartmentIssues(userDept);
    }, []);

    const fetchAllDepartmentIssues = async (dept: string) => {
        try {
            setLoading(true);
            const collections = getCollectionsForDepartment(dept);
            let allIssues: any[] = [];

            // Query all relevant collections for this department
            for (const collectionName of collections) {
                let q = query(collection(db, collectionName), where('department', '==', dept));

                if (statusFilter !== 'all') {
                    q = query(q, where('status', '==', statusFilter.toLowerCase()));
                }

                const querySnapshot = await getDocs(q);
                const issuesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    collection: collectionName,
                    ...doc.data(),
                    status: doc.data().status || 'pending', // Ensure status always has a value
                    createdAt: doc.data().createdAt?.toDate() || new Date()
                }));
                allIssues = [...allIssues, ...issuesData];
            }

            // Calculate statistics
            const stats = {
                total: allIssues.length,
                pending: allIssues.filter(i => i.status === 'pending').length,
                inProgress: allIssues.filter(i => i.status === 'in-progress').length,
                resolved: allIssues.filter(i => i.status === 'resolved').length,
                rejected: allIssues.filter(i => i.status === 'rejected').length
            };

            setStats(stats);
            setIssues(allIssues);
        } catch (error) {
            console.error('Error fetching issues:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateIssueStatus = async (id: string, collectionName: string, newStatus: string) => {
        try {
            const validStatus = newStatus.toLowerCase() || 'pending';
            await updateDoc(doc(db, collectionName, id), {
                status: validStatus,
                updatedAt: new Date()
            });
            if (department) fetchAllDepartmentIssues(department);
        } catch (error) {
            console.error('Error updating issue:', error);
        }
    };

    const filteredIssues = issues.filter(issue => {
        const matchesSearch = searchQuery === '' ||
            issue.issueType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            issue.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            {getDepartmentIcon(department)} {department} Department Dashboard
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Manage and track all reported issues for your department
                        </p>
                    </div>
                    <button
                        onClick={() => department && fetchAllDepartmentIssues(department)}
                        className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                    >
                        <FiRefreshCw className={loading ? 'animate-spin' : ''} />
                        Refresh Data
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                        <h3 className="text-gray-500 text-sm font-medium">Total Issues</h3>
                        <p className="text-2xl font-bold mt-1">{stats.total}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-yellow-200">
                        <h3 className="text-gray-500 text-sm font-medium">Pending</h3>
                        <p className="text-2xl font-bold mt-1 text-yellow-600">{stats.pending}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-blue-200">
                        <h3 className="text-gray-500 text-sm font-medium">In Progress</h3>
                        <p className="text-2xl font-bold mt-1 text-blue-600">{stats.inProgress}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-green-200">
                        <h3 className="text-gray-500 text-sm font-medium">Resolved</h3>
                        <p className="text-2xl font-bold mt-1 text-green-600">{stats.resolved}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-red-200">
                        <h3 className="text-gray-500 text-sm font-medium">Rejected</h3>
                        <p className="text-2xl font-bold mt-1 text-red-600">{stats.rejected}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search issues..."
                                className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <FiFilter className="text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    if (department) fetchAllDepartmentIssues(department);
                                }}
                                className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Issues Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredIssues.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow border border-gray-200 text-center">
                        <FiAlertCircle className="mx-auto text-gray-400 text-4xl mb-4" />
                        <h3 className="text-lg font-medium text-gray-700">No issues found</h3>
                        <p className="text-gray-500 mt-1">
                            {statusFilter !== 'all'
                                ? `No ${statusFilter} issues for ${department} department`
                                : `No issues found for ${department} department`}
                        </p>
                    </div>
                ) : (
                    // Update the Issues Grid section in AdminPanel.tsx
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredIssues.map((issue) => (
                            <div
                                key={`${issue.collection}-${issue.id}`}
                                className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden flex flex-col h-full cursor-pointer"
                                onClick={() => openIssueDetails(issue)}
                            >
                                {/* Image section */}
                                {issue.images && issue.images.length > 0 ? (
                                    <img
                                        src={issue.images[0]}
                                        alt={issue.issueType}
                                        className="w-full h-40 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-500">No Image Available</span>
                                    </div>
                                )}

                                <div className="p-4 flex flex-col flex-1">
                                    {/* Status and time */}
                                    <div className="flex justify-between items-center mb-2">
                                        <StatusBadge status={issue.status} />
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <FiClock className="text-gray-400" />
                                            {formatDate(issue.createdAt)}
                                        </span>
                                    </div>

                                    {/* Issue title and description */}
                                    <h3 className="text-lg font-semibold mb-1 text-gray-800">
                                        {issue.issueType}
                                    </h3>
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                        {issue.description}
                                    </p>

                                    {/* Location and department */}
                                    <div className="flex flex-wrap text-xs text-gray-500 gap-3 mb-4">
                                        <span className="flex items-center gap-1">
                                            <FiMapPin className="text-gray-400" />
                                            {issue.location.substring(0, 30)}{issue.location.length > 30 ? '...' : ''}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FiTag className="text-gray-400" />
                                            {issue.department}
                                        </span>
                                    </div>

                                    {/* Reporter info */}
                                    {issue.reporter && (
                                        <div className="mt-auto pt-3 border-t border-gray-100">
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <FiUser className="text-gray-400" />
                                                <span>Reported by: {issue.reporter.name}</span>
                                            </div>
                                            {issue.reporter.mobile && (
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                    <FiPhone className="text-gray-400" />
                                                    <span>{issue.reporter.mobile}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Admin controls */}
                                    <div className="mt-4 pt-3 border-t border-gray-100">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Update Status
                                        </label>
                                        <select
                                            value={issue.status}
                                            onChange={(e) => updateIssueStatus(issue.id, issue.collection, e.target.value)}
                                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="resolved">Resolved</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    Showing {filteredIssues.length} of {issues.length} issues
                </div>
                <IssueDetailModal />
            </div>
        </div>
    );
};

export default AdminPanel;
