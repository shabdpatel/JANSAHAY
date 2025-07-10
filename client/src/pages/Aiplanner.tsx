import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MarkerClusterGroup from 'react-leaflet-cluster';

// @ts-ignore
import suggestionsData from '../../../data_analysis/scripts/department_suggestions.json';

// Department configurations
const departmentConfig = {
    "Animal Control": { icon: "🐾", color: "#f59e42" },
    "Public Works": { icon: "🏗️", color: "#60a5fa" },
    "Roads & Transport": { icon: "🚦", color: "#f87171" },
    "Water Supply": { icon: "🚰", color: "#34d399" },
    "Other": { icon: "📋", color: "#a78bfa" }
};

type Issue = {
    createdAt: string;
    issueType: string;
    description: string;
    lat: number;
    lng: number;
    location: string;
    issue_age_days: number;
};

type Suggestion = {
    department: string;
    issue_count: number;
    top_issues: Record<string, number>;
    center_lat: number;
    center_lng: number;
    suggestions: string[];
    issues: Issue[];
};

// India bounds for coordinate validation
const INDIA_BOUNDS = {
    north: 37.6,
    south: 6.0,
    west: 68.1,
    east: 97.4
};

// Validate coordinates are within India
const isValidIndiaLocation = (lat: number, lng: number) => {
    return (
        lat >= INDIA_BOUNDS.south &&
        lat <= INDIA_BOUNDS.north &&
        lng >= INDIA_BOUNDS.west &&
        lng <= INDIA_BOUNDS.east
    );
};

// Custom icon creator
const createCustomIcon = (department: string) => {
    return L.divIcon({
        html: `<div style="background-color: ${departmentConfig[department]?.color || '#a78bfa'}; 
           width: 32px; height: 32px; display: flex; align-items: center; 
           justify-content: center; border-radius: 50%; color: white; font-size: 16px;
           border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.2);">
           ${departmentConfig[department]?.icon || '📋'}
         </div>`,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });
};

// Component to fit map to bounds
const FitBoundsToMarkers = ({ suggestions }: { suggestions: Suggestion[] }) => {
    const map = useMap();

    useEffect(() => {
        if (suggestions.length > 0) {
            const validIssues = suggestions
                .flatMap(s => s.issues)
                .filter(issue => isValidIndiaLocation(issue.lat, issue.lng));

            if (validIssues.length > 0) {
                const bounds = L.latLngBounds(
                    validIssues.map(issue => [issue.lat, issue.lng])
                );
                map.fitBounds(bounds, { padding: [50, 50] });
            } else {
                // Fallback to India center if no valid coordinates
                map.setView([20.5937, 78.9629], 5);
            }
        }
    }, [suggestions, map]);

    return null;
};

const Aiplanner = () => {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [activeDepartments, setActiveDepartments] = useState<Record<string, boolean>>(
        Object.keys(departmentConfig).reduce((acc, dept) => ({ ...acc, [dept]: true }), {})
    );
    const [sortBy, setSortBy] = useState<'recent' | 'count'>('recent');
    const mapRef = useRef(null);


    useEffect(() => {
        // Process and validate the data
        const processedData = suggestionsData.map(suggestion => ({
            ...suggestion,
            issues: suggestion.issues.filter(issue =>
                isValidIndiaLocation(issue.lat, issue.lng)
            )
        })).filter(suggestion => suggestion.issues.length > 0);

        setSuggestions(processedData);
    }, []);

    // Filter and sort suggestions
    const filteredSuggestions = suggestions
        .filter(s => activeDepartments[s.department])
        .sort((a, b) => {
            if (sortBy === 'count') return b.issue_count - a.issue_count;
            // Sort by most recent issue
            const aLatest = Math.max(...a.issues.map(i => new Date(i.createdAt).getTime()));
            const bLatest = Math.max(...b.issues.map(i => new Date(i.createdAt).getTime()));
            return bLatest - aLatest;
        });

    // Calculate center for initial map view
    const defaultCenter: [number, number] = [20.5937, 78.9629]; // India center

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                            🧭 AI Department Planner
                        </h1>
                        <p className="text-gray-600">
                            Visualize department suggestions and action points on map
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm">
                            <label className="text-sm font-medium">Sort by:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'recent' | 'count')}
                                className="text-sm border rounded px-2 py-1"
                            >
                                <option value="recent">Most Recent</option>
                                <option value="count">Issue Count</option>
                            </select>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {Object.keys(departmentConfig).map(dept => (
                                <button
                                    key={dept}
                                    onClick={() => setActiveDepartments(prev => ({
                                        ...prev,
                                        [dept]: !prev[dept]
                                    }))}
                                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm 
                    ${activeDepartments[dept] ? 'bg-opacity-90' : 'bg-opacity-20'}
                    shadow-sm transition-all`}
                                    style={{
                                        backgroundColor: activeDepartments[dept]
                                            ? departmentConfig[dept].color
                                            : `${departmentConfig[dept].color}33`,
                                        color: activeDepartments[dept] ? 'white' : 'gray'
                                    }}
                                >
                                    <span>{departmentConfig[dept].icon}</span>
                                    <span>{dept}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="w-full h-[60vh] rounded-xl overflow-hidden mb-8 relative z-0 shadow-lg border border-gray-200">
                    <MapContainer
                        center={defaultCenter}
                        zoom={5}
                        style={{ height: "100%", width: "100%" }}
                        scrollWheelZoom={true}
                        ref={mapRef}
                    >
                        <FitBoundsToMarkers suggestions={filteredSuggestions} />

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
                        </LayersControl>

                        <MarkerClusterGroup
                            chunkedLoading
                            spiderfyDistanceMultiplier={2}
                            showCoverageOnHover={false}
                        >
                            {filteredSuggestions.flatMap(suggestion =>
                                suggestion.issues.map((issue, idx) => (
                                    <Marker
                                        key={`${suggestion.department}-${idx}`}
                                        position={[issue.lat, issue.lng]}
                                        icon={createCustomIcon(suggestion.department)}
                                    >
                                        <Popup className="custom-popup">
                                            <div className="max-w-xs">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xl">
                                                        {departmentConfig[suggestion.department].icon}
                                                    </span>
                                                    <h3 className="font-bold text-gray-800">
                                                        {suggestion.department}
                                                    </h3>
                                                </div>
                                                <div className="mb-2">
                                                    <p className="font-semibold text-sm">{issue.issueType}</p>
                                                    <p className="text-sm text-gray-700">{issue.description}</p>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    <p>
                                                        <span className="font-medium">Location:</span> {issue.location}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Reported:</span> {new Date(issue.createdAt).toLocaleString()}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Age:</span> {issue.issue_age_days} days
                                                    </p>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))
                            )}
                        </MarkerClusterGroup>
                    </MapContainer>
                </div>

                {/* Department Suggestions Section */}
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Department-wise Suggestions</h2>
                        <p className="text-sm text-gray-500">
                            Showing {filteredSuggestions.length} of {suggestions.length} departments
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredSuggestions.map((suggestion, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-lg shadow p-4 border-l-4 hover:shadow-md transition-shadow"
                                style={{ borderColor: departmentConfig[suggestion.department].color }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">
                                        {departmentConfig[suggestion.department].icon}
                                    </span>
                                    <div>
                                        <h3 className="font-semibold">{suggestion.department}</h3>
                                        <p className="text-xs text-gray-500">
                                            {suggestion.issue_count} issues • Updated {
                                                new Date(Math.max(...suggestion.issues.map(i => new Date(i.createdAt).getTime())))
                                                    .toLocaleDateString()
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <h4 className="font-medium text-sm mb-1">Top Issues:</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {Object.entries(suggestion.top_issues).map(([type, count]) => (
                                            <span
                                                key={type}
                                                className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700"
                                            >
                                                {type} ({count})
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <h4 className="font-medium text-sm mb-1">Suggestions:</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                        {suggestion.suggestions.map((sg, i) => (
                                            <li key={i}>{sg}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-medium text-sm mb-1">Recent Issues:</h4>
                                    <ul className="space-y-2">
                                        {suggestion.issues
                                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                            .slice(0, 2)
                                            .map((issue, i) => (
                                                <li key={i} className="text-xs text-gray-600 border-l-2 pl-2 py-1"
                                                    style={{ borderColor: departmentConfig[suggestion.department].color }}
                                                >
                                                    <p className="font-medium">{issue.issueType}</p>
                                                    <p className="truncate">{issue.description}</p>
                                                    <p className="text-gray-400 text-xs mt-0.5">
                                                        {issue.location.split(',')[0]} • {issue.issue_age_days}d ago
                                                    </p>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Aiplanner;