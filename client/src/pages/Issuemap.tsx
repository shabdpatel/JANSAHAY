import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaCrosshairs } from 'react-icons/fa';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from "firebase/firestore";

// Fix default marker icon for leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icons
const defaultIcon = L.icon({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

interface Issue {
    id: string;
    issueType: string;
    department: string;
    description: string;
    location: string;
    coordinates: { lat: number; lng: number };
    images: string[];
    createdAt: { seconds: number; nanoseconds: number };
    reporter: {
        name: string;
        email: string;
        mobile: string;
    };
    status?: 'Pending' | 'Resolved' | 'In Progress';
}

interface MapFlyToProps {
    position: [number, number] | null;
    zoom?: number;
}

const MapFlyTo: React.FC<MapFlyToProps> = ({ position, zoom }) => {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.flyTo(position, zoom || 14, {
                animate: true,
                duration: 1.5
            });
        }
    }, [position, zoom, map]);

    return null;
};

const IssueMap = () => {
    // Default center: India (approximate center, zoomed out)
    const defaultCenter: [number, number] = [22.5937, 78.9629];
    const defaultZoom = 5;

    // State
    const [typeFilter, setTypeFilter] = useState('');
    const [deptFilter, setDeptFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
    const [mapZoom, setMapZoom] = useState<number | undefined>(undefined);
    const [tileLayer, setTileLayer] = useState<'osm' | 'satellite' | 'topo'>('osm');
    const [isLocating, setIsLocating] = useState(false);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);

    // Helper to extract lat/lng from coordinates object
    const getLatLng = (coordinates: { lat: number; lng: number }): [number, number] | null => {
        if (!coordinates || typeof coordinates.lat !== 'number' || typeof coordinates.lng !== 'number') {
            return null;
        }
        return [coordinates.lat, coordinates.lng];
    };

    // Fetch issues from Firestore
    useEffect(() => {
        const fetchIssues = async () => {
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

                let allIssues: Issue[] = [];

                for (const collectionName of collections) {
                    const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        if (data.coordinates && typeof data.coordinates.lat === 'number' && typeof data.coordinates.lng === 'number') {
                            allIssues.push({
                                id: doc.id,
                                ...data
                            } as Issue);
                        }
                    });
                }

                setIssues(allIssues);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching issues:", error);
                setLoading(false);
            }
        };

        fetchIssues();
    }, []);

    // Extract unique values for filters
    const getUnique = (arr: any[], key: string) =>
        Array.from(new Set(arr.map(item => item[key] || ''))).filter(v => v && v !== '');

    const getStatusList = (arr: any[]) =>
        Array.from(new Set(arr.map(item => item.status || 'Pending')));

    const issueTypes = getUnique(issues, 'issueType');
    const departments = getUnique(issues, 'department');
    const statuses = getStatusList(issues);

    // Filter issues for map
    const filteredIssues = issues.filter(issue => {
        const matchesType = typeFilter ? issue.issueType === typeFilter : true;
        const matchesDept = deptFilter ? issue.department === deptFilter : true;
        const matchesStatus = statusFilter ? (issue.status || 'Pending') === statusFilter : true;
        const matchesSearch =
            (issue.issueType || '').toLowerCase().includes(search.toLowerCase()) ||
            (issue.description || '').toLowerCase().includes(search.toLowerCase()) ||
            (issue.location || '').toLowerCase().includes(search.toLowerCase());
        return matchesType && matchesDept && matchesStatus && matchesSearch;
    });

    // Handle search location
    const handleSearchLocation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchInput.trim()) return;
        const coords = await geocodeAddress(searchInput);
        if (coords) {
            setMapCenter(coords);
            setMapZoom(15);
            setSearchInput('');
        } else {
            alert('Location not found. Please try a different search.');
        }
    };

    // Handle use current location
    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setMapCenter([position.coords.latitude, position.coords.longitude]);
                setMapZoom(16);
                setIsLocating(false);
            },
            () => {
                alert('Unable to retrieve your location.');
                setIsLocating(false);
            }
        );
    };

    // TileLayer URLs
    const tileLayers = {
        osm: {
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            attribution: "&copy; OpenStreetMap contributors"
        },
        satellite: {
            url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            attribution: "Tiles &copy; Esri"
        },
        topo: {
            url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
            attribution: "Map data: &copy; OpenTopoMap contributors"
        }
    };

    return (
        <div className="pt-8 px-2 sm:px-4 md:px-10">
            <h1 className="text-lg sm:text-2xl font-semibold mb-2 text-center">Issue Map</h1>
            <p className="text-center text-gray-500 mb-6 max-w-2xl mx-auto">
                Explore all reported issues on the map. Use filters to narrow down by type, department, status, or search by keyword/location.
            </p>

            {/* Filters and Map Controls */}
            <div className="flex flex-col md:flex-row flex-wrap gap-3 mb-6 items-center justify-center">
                <form onSubmit={handleSearchLocation} className="flex gap-2 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search location (e.g. Park Street, Kolkata)"
                        className="w-full md:w-64 border border-gray-300 rounded-md p-2 text-sm"
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-3 py-2 rounded text-xs sm:text-sm"
                    >
                        Go
                    </button>
                </form>
                <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-blue-100 text-blue-700 rounded text-xs sm:text-sm"
                    disabled={isLocating}
                >
                    <FaCrosshairs /> {isLocating ? 'Locating...' : 'Use My Location'}
                </button>
                <select
                    className="w-full md:w-40 border border-gray-300 rounded-md p-2 text-sm"
                    value={tileLayer}
                    onChange={e => setTileLayer(e.target.value as 'osm' | 'satellite' | 'topo')}
                >
                    <option value="osm">OpenStreetMap</option>
                    <option value="satellite">Satellite</option>
                    <option value="topo">Topographic</option>
                </select>
                <input
                    type="text"
                    placeholder="Search by issue type, description, or location"
                    className="w-full md:w-1/4 border border-gray-300 rounded-md p-2 text-sm"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select
                    className="w-full md:w-1/6 border border-gray-300 rounded-md p-2 text-sm"
                    value={typeFilter}
                    onChange={e => setTypeFilter(e.target.value)}
                >
                    <option value="">All Issue Types</option>
                    {issueTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                <select
                    className="w-full md:w-1/6 border border-gray-300 rounded-md p-2 text-sm"
                    value={deptFilter}
                    onChange={e => setDeptFilter(e.target.value)}
                >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                    ))}
                </select>
                <select
                    className="w-full md:w-1/6 border border-gray-300 rounded-md p-2 text-sm"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
                {(typeFilter || deptFilter || statusFilter || search || searchInput) && (
                    <button
                        className="w-full md:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 rounded px-3 py-2 text-xs sm:text-sm"
                        onClick={() => {
                            setTypeFilter('');
                            setDeptFilter('');
                            setStatusFilter('');
                            setSearch('');
                            setSearchInput('');
                        }}
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            {/* Map Container */}
            <div className="w-full h-[400px] sm:h-[600px] rounded-lg overflow-hidden shadow relative">
                {loading ? (
                    <div className="flex items-center justify-center h-full text-gray-500">Loading map...</div>
                ) : (
                    <MapContainer
                        center={defaultCenter}
                        zoom={defaultZoom}
                        scrollWheelZoom={true}
                        className="w-full h-full z-0"
                    >
                        <TileLayer
                            url={tileLayers[tileLayer].url}
                            attribution={tileLayers[tileLayer].attribution}
                        />
                        <MapFlyTo position={mapCenter} zoom={mapZoom} />
                        {filteredIssues.map(issue => {
                            const latlng = getLatLng(issue.coordinates);
                            if (!latlng) return null;

                            return (
                                <Marker
                                    key={issue.id}
                                    position={latlng}
                                    icon={defaultIcon}
                                >
                                    <Tooltip>
                                        <div>
                                            <div className="font-bold text-blue-700 text-xs">
                                                {issue.issueType}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {issue.location}
                                            </div>
                                            <div className="text-xs">
                                                <span className="font-semibold">Status:</span> {issue.status || 'Pending'}
                                            </div>
                                        </div>
                                    </Tooltip>
                                    <Popup>
                                        <div className="min-w-[220px] max-w-[320px]">
                                            <div className="font-bold text-blue-700 text-base mb-1">
                                                {issue.issueType}
                                            </div>
                                            <div className="text-xs text-gray-600 mb-2">
                                                {issue.description}
                                            </div>
                                            <div className="mb-2">
                                                <span className="inline-block text-xs bg-blue-100 text-blue-700 rounded px-2 py-0.5 mr-1">
                                                    {issue.issueType}
                                                </span>
                                                <span className="inline-block text-xs bg-green-100 text-green-700 rounded px-2 py-0.5 mr-1">
                                                    {issue.status || 'Pending'}
                                                </span>
                                                <span className="inline-block text-xs bg-gray-100 text-gray-700 rounded px-2 py-0.5">
                                                    {issue.department}
                                                </span>
                                            </div>
                                            <div className="text-xs mb-1">
                                                <span className="font-semibold">Location:</span> {issue.location}
                                            </div>
                                            <div className="text-xs mb-1">
                                                <span className="font-semibold">Coordinates:</span> {issue.coordinates.lat.toFixed(6)}, {issue.coordinates.lng.toFixed(6)}
                                            </div>
                                            <div className="text-xs mb-1">
                                                <span className="font-semibold">Reported:</span> {new Date(issue.createdAt.seconds * 1000).toLocaleString()}
                                            </div>
                                            {issue.reporter && (
                                                <div className="text-xs mb-1">
                                                    <span className="font-semibold">Reporter:</span> {issue.reporter.name}
                                                    {issue.reporter.email && (
                                                        <span className="ml-1 text-gray-500">({issue.reporter.email})</span>
                                                    )}
                                                    {issue.reporter.mobile && (
                                                        <span className="ml-1 text-gray-500">| {issue.reporter.mobile}</span>
                                                    )}
                                                </div>
                                            )}
                                            {issue.images && issue.images.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {issue.images.slice(0, 2).map((img: string, idx: number) => (
                                                        <img
                                                            key={idx}
                                                            src={img}
                                                            alt={`Issue ${issue.id} img ${idx + 1}`}
                                                            className="w-20 h-14 object-cover rounded border"
                                                        />
                                                    ))}
                                                    {issue.images.length > 2 && (
                                                        <span className="text-xs text-gray-500 self-center">+{issue.images.length - 2} more</span>
                                                    )}
                                                </div>
                                            )}
                                            <div className="mt-2">
                                                <a
                                                    href={`/issues/${issue.id}`}
                                                    className="text-blue-600 hover:underline text-xs font-medium"
                                                >
                                                    View Full Details
                                                </a>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                )}
            </div>
            <div className="text-xs text-gray-400 text-center mt-4">
                Showing {filteredIssues.length} of {issues.length} issues on the map.
            </div>
        </div>
    );
};

// Helper function for geocoding
async function geocodeAddress(address: string): Promise<[number, number] | null> {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
            return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        }
        return null;
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
}

export default IssueMap;