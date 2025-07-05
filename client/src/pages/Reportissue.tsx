import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaCrosshairs } from 'react-icons/fa';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { Cloudinary } from '@cloudinary/url-gen';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from '../firebase';

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
    setLocationAddress,
    externalPosition
}: {
    onLocationSelect: (lat: number, lng: number) => void,
    mapRef: React.RefObject<any>,
    setLocationAddress: (address: string) => void,
    externalPosition?: [number, number] | null
}) => {
    const [position, setPosition] = useState<[number, number] | null>(null);

    // Always pan the map to the new position when externalPosition changes
    React.useEffect(() => {
        if (externalPosition) {
            setPosition(externalPosition);
        }
    }, [externalPosition]);

    React.useEffect(() => {
        if (externalPosition && mapRef.current) {
            // Use flyTo for smooth animation and guaranteed movement
            mapRef.current.flyTo(externalPosition, 16, { animate: true, duration: 1.5 });
        }
    }, [externalPosition, mapRef]);

    useMapEvents({
        click: async (e: { latlng: { lat: number; lng: number } }) => {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            onLocationSelect(lat, lng);
            // Fetch address and update location input
            const address = await reverseGeocode(lat, lng);
            if (address) setLocationAddress(address);
            // Save coordinates in parent
            setCoordinates({ lat, lng });
        },
    });

    return position === null ? null : <Marker position={position} />;
};

const CLOUDINARY_UPLOAD_PRESET = 'jansahay'; // <-- set your unsigned upload preset here
const CLOUDINARY_CLOUD_NAME = 'dqrbhkqrb';

const ReportIssue = () => {
    const [issueType, setIssueType] = useState('Pothole');
    const [department, setDepartment] = useState('Public Works');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [isLocating, setIsLocating] = useState(false);
    const [pinPosition, setPinPosition] = useState<[number, number] | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitMsg, setSubmitMsg] = useState<string | null>(null);
    const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [mobile, setMobile] = useState('');
    const mapRef = useRef<any>(null);
    const locationInputRef = useRef<HTMLInputElement>(null);

    // Listen to auth state and set user info
    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                    email: firebaseUser.email || '',
                });
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    // Helper to upload a single file to Cloudinary
    const uploadToCloudinary = async (file: File): Promise<string> => {
        const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        const res = await fetch(url, {
            method: 'POST',
            body: formData,
        });
        const data = await res.json();
        console.log('Cloudinary upload response:', data); // <-- Add this line
        if (data.secure_url) return data.secure_url;
        throw new Error('Cloudinary upload failed: ' + (data.error?.message || 'Unknown error'));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            const totalImages = images.length + filesArray.length;
            if (totalImages > 4) {
                alert('You can upload a maximum of 4 images.');
                return;
            }
            setUploading(true);
            try {
                // Upload all images to Cloudinary
                const uploadPromises = filesArray.map(file => uploadToCloudinary(file));
                const urls = await Promise.all(uploadPromises);
                setUploadedImageUrls(prev => [...prev, ...urls]);
                setImages(prev => [...prev, ...filesArray]);
                setImagePreviews(prev => [
                    ...prev,
                    ...urls
                ]);
            } catch (err) {
                alert('Image upload failed. Please try again.');
            }
            setUploading(false);
        }
    };

    const handleRemoveImage = (idx: number) => {
        setImages(prev => prev.filter((_, i) => i !== idx));
        setImagePreviews(prev => prev.filter((_, i) => i !== idx));
        setUploadedImageUrls(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert("Please log in to report an issue.");
            window.location.href = "/login";
            return;
        }
        if (uploading) {
            setSubmitMsg("Please wait for images to finish uploading.");
            return;
        }
        // Validate required fields
        if (!issueType || !department || !description.trim() || !location.trim() || !mobile.trim()) {
            setSubmitMsg("Please fill in all required fields (Issue Type, Department, Description, Location, Mobile).");
            return;
        }
        if (!coordinates) {
            setSubmitMsg("Please select a location on the map or via search.");
            return;
        }
        setSubmitting(true);
        setSubmitMsg(null);
        try {
            // Ensure collection name is valid (lowercase, no spaces)
            const collectionName = `${issueType.replace(/\s+/g, '').toLowerCase()}issues`;
            const issueData = {
                issueType: issueType,
                department: department,
                description: description,
                location: location,
                coordinates: coordinates, // <-- Save coordinates here
                images: uploadedImageUrls,
                createdAt: Timestamp.now(),
                reporter: {
                    name: user.name,
                    email: user.email,
                    mobile: mobile,
                }
            };
            // Debug log
            console.log("Submitting to Firestore:", collectionName, issueData);
            await addDoc(collection(db, collectionName), issueData);
            setSubmitMsg("Issue reported successfully!");
            setIssueType('Pothole');
            setDepartment('Public Works');
            setDescription('');
            setLocation('');
            setCoordinates(null); // <-- Reset coordinates
            setImages([]);
            setImagePreviews([]);
            setUploadedImageUrls([]);
            setPinPosition(null);
            setMobile('');
        } catch (err) {
            console.error('Firestore error:', err);
            setSubmitMsg("Failed to report issue. Please try again.");
        }
        setSubmitting(false);
    };

    // Search handler for map search bar (manual search)
    const handleMapSearch = async () => {
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

    // When address input changes, auto-move map and update coordinates
    const handleLocationInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocation(e.target.value);
        if (e.target.value.trim().length > 2) {
            const coords = await geocodeAddress(e.target.value);
            if (coords && mapRef.current) {
                mapRef.current.setView(coords, 16);
                setCoordinates({ lat: coords[0], lng: coords[1] });
            }
        }
    };

    // Use current location handler
    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                if (mapRef.current) {
                    mapRef.current.setView([latitude, longitude], 16);
                }
                setPinPosition([latitude, longitude]);
                setCoordinates({ lat: latitude, lng: longitude });
                const address = await reverseGeocode(latitude, longitude);
                if (address) {
                    setLocation(address);
                    locationInputRef.current?.blur();
                }
                setIsLocating(false);
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    alert('Location permission denied. Please allow location access in your browser settings.');
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    alert('Location information is unavailable.');
                } else if (error.code === error.TIMEOUT) {
                    alert('Location request timed out.');
                } else {
                    alert('Unable to retrieve your location.');
                }
                setIsLocating(false);
            }
        );
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
                <div className="absolute bottom-5 left-5 text-sm text-gray-600">
                    {user ? <>👤 {user.name}</> : <>👤 <span className="text-blue-600 cursor-pointer" onClick={() => window.location.href = '/login'}>Login to report</span></>}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 px-2 sm:px-4 md:px-10 py-6 sm:py-8 relative z-0">
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
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={search}
                                onChange={handleSearchInput}
                                className="flex-1 border border-gray-300 rounded-md p-2 text-xs sm:text-sm"
                                placeholder="Search location on map (e.g. Park Street, Kolkata)"
                            />
                            <button
                                type="button"
                                onClick={handleMapSearch}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-xs sm:text-sm"
                            >
                                Search
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={handleUseCurrentLocation}
                            className="flex items-center gap-2 mb-2 px-3 py-1 bg-gray-100 hover:bg-blue-100 text-blue-700 rounded text-xs sm:text-sm"
                            disabled={isLocating}
                        >
                            <FaCrosshairs /> {isLocating ? 'Locating...' : 'Use My Current Location'}
                        </button>
                        <div className="border border-gray-300 rounded-md overflow-hidden bg-white relative z-0">
                            <MapContainer
                                center={[22.5726, 88.3639]}
                                zoom={13}
                                scrollWheelZoom={true}
                                className="h-48 sm:h-64 w-full relative z-0"
                                style={{ position: 'relative', zIndex: 0 }}
                                whenReady={({ target }) => { mapRef.current = target; }}
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
                                    onLocationSelect={(lat, lng) => {
                                        setLocation(`${lat}, ${lng}`);
                                        setPinPosition([lat, lng]);
                                        setCoordinates({ lat, lng }); // <-- Save coordinates
                                    }}
                                    mapRef={mapRef}
                                    setLocationAddress={setLocation}
                                    externalPosition={pinPosition}
                                />
                            </MapContainer>
                        </div>
                        <input
                            type="text"
                            value={location}
                            onChange={handleLocationInput}
                            className="mt-2 w-full border border-gray-300 rounded-md p-2"
                            placeholder="Enter specific address or landmark (optional)"
                            ref={locationInputRef}
                        />
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1">Upload Images</label>
                        <div className="border border-dashed border-gray-300 rounded-md p-3 sm:p-4 text-center">
                            <input
                                type="file"
                                className="hidden"
                                id="image-upload"
                                onChange={handleImageChange}
                                multiple
                                accept="image/*"
                                disabled={images.length >= 4 || uploading}
                            />
                            <label htmlFor="image-upload" className={`cursor-pointer text-blue-600 font-medium ${images.length >= 4 || uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                Drag & drop images here, or <span className="underline">Browse Files</span>
                            </label>
                            <p className="text-xs sm:text-sm text-gray-500 mt-2">
                                Max 4 images. Max file size: 5MB each. Supported formats: JPG, PNG, GIF.
                            </p>
                            {uploading && <div className="text-blue-600 mt-2">Uploading images...</div>}
                            {uploadedImageUrls.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-4 justify-center">
                                    {uploadedImageUrls.map((src, idx) => (
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

                    <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1">Your Name</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={user?.name || ''}
                            disabled
                        />
                    </div>
                    <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1">Your Email</label>
                        <input
                            type="email"
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={user?.email || ''}
                            disabled
                        />
                    </div>
                    <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1">Mobile Number</label>
                        <input
                            type="tel"
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={mobile}
                            onChange={e => setMobile(e.target.value)}
                            placeholder="Enter your mobile number"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white font-semibold px-4 sm:px-6 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
                        disabled={submitting || uploading}
                    >
                        {submitting ? "Submitting..." : "Submit Issue"}
                    </button>
                    {uploading && (
                        <div className="mt-2 text-blue-600 text-sm">
                            Please wait, images are still uploading...
                        </div>
                    )}
                    {submitMsg && (
                        <div className={`mt-3 text-sm ${submitMsg.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                            {submitMsg}
                        </div>
                    )}
                </form>
                {/* Mobile user info */}
                <div className="block md:hidden mt-6 text-sm text-gray-600 text-center">
                    {user ? <>👤 {user.name}</> : <>👤 <span className="text-blue-600 cursor-pointer" onClick={() => window.location.href = '/login'}>Login to report</span></>}
                </div>
            </div>
        </div>
    );
};

export default ReportIssue;


