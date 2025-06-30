import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Replace require() with import for marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Helper function to fetch lat/lng from address using Nominatim
async function geocodeAddress(address: string): Promise<[number, number] | null> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&accept-language=en&q=${encodeURIComponent(address)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    return null;
}

// Helper function to fetch address from lat/lng using Nominatim
async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&accept-language=en&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.display_name) {
        // Try to construct a more detailed address if available
        if (data.address) {
            // Compose address from most specific to least specific fields
            const { road, neighbourhood, suburb, city_district, city, town, village, state, postcode, country } = data.address;
            const parts = [
                road,
                neighbourhood,
                suburb,
                city_district,
                city || town || village,
                state,
                postcode,
                country
            ].filter(Boolean);
            if (parts.length > 0) {
                return parts.join(', ');
            }
        }
        return data.display_name;
    }
    return null;
}

const LocationMarker = ({
    onLocationSelect,
    mapRef,
    setLocationAddress
}: {
    onLocationSelect: (lat: number, lng: number) => void,
    mapRef: React.RefObject<any>,
    setLocationAddress: (address: string) => void
}) => {
    const [position, setPosition] = useState<[number, number] | null>(null);

    useMapEvents({
        click: async (e) => {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            onLocationSelect(lat, lng);
            // Fetch address and update location input
            const address = await reverseGeocode(lat, lng);
            if (address) setLocationAddress(address);
        },
    });

    return position === null ? null : <Marker position={position} />;
};

const ReportIssue = () => {
    const [issueType, setIssueType] = useState('Pothole');
    const [department, setDepartment] = useState('Public Works');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const mapRef = useRef<any>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            // Only allow up to 4 images
            const totalImages = images.length + filesArray.length;
            if (totalImages > 4) {
                alert('You can upload a maximum of 4 images.');
                return;
            }
            setImages(prev => [...prev, ...filesArray]);
            setImagePreviews(prev => [
                ...prev,
                ...filesArray.map(file => URL.createObjectURL(file))
            ]);
        }
    };

    const handleRemoveImage = (idx: number) => {
        setImages(prev => prev.filter((_, i) => i !== idx));
        setImagePreviews(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ issueType, department, description, location, images });
    };

    // Search handler for map search bar (manual search)
    const handleMapSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!search.trim()) return;
        const coords = await geocodeAddress(search);
        if (coords && mapRef.current) {
            mapRef.current.setView(coords, 16);
            // Also update the location input with the found address
            const address = await reverseGeocode(coords[0], coords[1]);
            if (address) setLocation(address);
        } else {
            alert('Location not found. Please try a different search.');
        }
    };

    // Auto-search and move map as user types in the search bar
    const handleSearchInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        if (e.target.value.trim().length > 2) {
            const coords = await geocodeAddress(e.target.value);
            if (coords && mapRef.current) {
                mapRef.current.setView(coords, 16);
                // Also update the location input with the found address
                const address = await reverseGeocode(coords[0], coords[1]);
                if (address) setLocation(address);
            }
        }
    };

    // When address input changes, auto-move map
    const handleLocationInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocation(e.target.value);
        if (e.target.value.trim().length > 2) {
            const coords = await geocodeAddress(e.target.value);
            if (coords && mapRef.current) {
                mapRef.current.setView(coords, 16);
            }
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Sidebar */}
            <div className="hidden md:block w-full md:w-64 bg-white shadow border-r relative flex-shrink-0">
                <div className="p-4 font-bold text-lg">JANSAHAY</div>
                <nav className="mt-4">
                    <ul>
                        <li>
                            <Link
                                to="/"
                                className="block px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <span className="block px-6 py-3 bg-blue-100 text-blue-600 font-semibold rounded-r-full">
                                Report Issue
                            </span>
                        </li>
                        <li>
                            <Link
                                to="/issue-history"
                                className="block px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                Issue History
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="absolute bottom-5 left-5 text-sm text-gray-600">👤 Citizen Reporter</div>
            </div>

            {/* Main Content */}
            <div className="flex-1 px-2 sm:px-4 md:px-10 py-6 sm:py-8">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Report a New Civic Issue</h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-md rounded-lg p-3 sm:p-4 md:p-6 space-y-5 sm:space-y-6 max-w-4xl mx-auto"
                >
                    <div>
                        <h2 className="text-base sm:text-lg font-semibold mb-1">Issue Details</h2>
                        <p className="text-xs sm:text-sm text-gray-500">
                            Provide comprehensive information about the civic issue you are reporting.
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1">Issue Type</label>
                        <select
                            value={issueType}
                            onChange={(e) => setIssueType(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2"
                        >
                            <option>Pothole</option>
                            <option>Garbage</option>
                            <option>Streetlight</option>
                            <option>Water Leak</option>
                            <option>Broken Bench</option>
                            <option>Tree Fallen</option>
                            <option>Manhole Open</option>
                            <option>Illegal Parking</option>
                            <option>Noise Complaint</option>
                            <option>Animal Menace</option>
                            <option>Blocked Drain</option>
                            <option>Power Outage</option>
                            <option>Road Damage</option>
                            <option>Other</option>
                        </select>
                    </div>

                    {/* Department Concerned */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1">Department Concerned</label>
                        <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2"
                        >
                            <option>Public Works</option>
                            <option>Sanitation</option>
                            <option>Electricity</option>
                            <option>Water Supply</option>
                            <option>Parks & Recreation</option>
                            <option>Roads & Transport</option>
                            <option>Health</option>
                            <option>Police</option>
                            <option>Fire Department</option>
                            <option>Animal Control</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2"
                            rows={4}
                            placeholder="Describe the issue in detail, including any relevant observations or impact."
                        />
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1">Location</label>
                        {/* Map Search Bar */}
                        <form onSubmit={handleMapSearch} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={search}
                                onChange={handleSearchInput}
                                className="flex-1 border border-gray-300 rounded-md p-2 text-xs sm:text-sm"
                                placeholder="Search location on map (e.g. Park Street, Kolkata)"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-3 py-1 rounded text-xs sm:text-sm"
                            >
                                Search
                            </button>
                        </form>
                        <div className="border border-gray-300 rounded-md overflow-hidden">
                            <MapContainer
                                center={[22.5726, 88.3639]}
                                zoom={13}
                                scrollWheelZoom={true}
                                className="h-48 sm:h-64 w-full"
                                whenCreated={mapInstance => { mapRef.current = mapInstance; }}
                            >
                                <LayersControl position="topright">
                                    <LayersControl.BaseLayer checked name="OpenStreetMap">
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution="&copy; OpenStreetMap contributors"
                                        />
                                    </LayersControl.BaseLayer>
                                    <LayersControl.BaseLayer name="Satellite">
                                        <TileLayer
                                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                            attribution="Tiles &copy; Esri"
                                        />
                                    </LayersControl.BaseLayer>
                                    <LayersControl.BaseLayer name="Topographic">
                                        <TileLayer
                                            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                                            attribution="Map data: &copy; OpenTopoMap contributors"
                                        />
                                    </LayersControl.BaseLayer>
                                </LayersControl>
                                <LocationMarker
                                    onLocationSelect={(lat, lng) => setLocation(`${lat}, ${lng}`)}
                                    mapRef={mapRef}
                                    setLocationAddress={setLocation}
                                />
                            </MapContainer>
                        </div>
                        <input
                            type="text"
                            value={location}
                            onChange={handleLocationInput}
                            className="mt-2 w-full border border-gray-300 rounded-md p-2"
                            placeholder="Enter specific address or landmark (optional)"
                        />
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1">Upload Images (Optional)</label>
                        <div className="border border-dashed border-gray-300 rounded-md p-3 sm:p-4 text-center">
                            <input
                                type="file"
                                className="hidden"
                                id="image-upload"
                                onChange={handleImageChange}
                                multiple
                                accept="image/*"
                                disabled={images.length >= 4}
                            />
                            <label htmlFor="image-upload" className={`cursor-pointer text-blue-600 font-medium ${images.length >= 4 ? 'opacity-50 pointer-events-none' : ''}`}>
                                Drag & drop images here, or <span className="underline">Browse Files</span>
                            </label>
                            <p className="text-xs sm:text-sm text-gray-500 mt-2">
                                Max 4 images. Max file size: 5MB each. Supported formats: JPG, PNG, GIF.
                            </p>
                            {images.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-4 justify-center">
                                    {imagePreviews.map((src, idx) => (
                                        <div key={idx} className="flex flex-col items-center gap-1">
                                            <img
                                                src={src}
                                                alt={`Preview ${idx + 1}`}
                                                className="max-h-32 rounded shadow border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(idx)}
                                                className="text-red-600 text-xs border border-red-200 rounded px-2 py-1 hover:bg-red-50"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white font-semibold px-4 sm:px-6 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
                    >
                        Submit Issue
                    </button>
                </form>
                {/* Mobile user info */}
                <div className="block md:hidden mt-6 text-sm text-gray-600 text-center">👤 Citizen Reporter</div>
            </div>
        </div>
    );
};

export default ReportIssue;
