// src/pages/AdminPanel.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase';

const AdminPanel = () => {
    const [issues, setIssues] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [department, setDepartment] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const navigate = useNavigate();

    // Map department from email to Firestore collection naming pattern
    const getCollectionsForDepartment = (dept: string) => {
        // Convert department to match Firestore format
        const normalizedDept = dept.toLowerCase().includes('public') ? 'Public Works' : dept;

        const mapping: Record<string, string[]> = {
            'Public Works': [
                'potholeissues',
                'roadissues',
                'drainissues',
                'streetlightissues',
                'manholeissues',
                'roadrepairissues',
                'sidewalkissues',
                'bridgeissues',
                'brokenbenchissues'
            ],
            'Sanitation': [
                'garbageissues',
                'cleaningissues',
                'recyclingissues',
                'dumpsterissues',
                'litterissues',
                'publictoiletissues',
                'wastecollectionissues'
            ],
            'Electricity': [
                'streetlightissues',
                'powerissues',
                'outageissues',
                'wiringissues',
                'electricalhazardissues',
                'transformerissues'
            ],
            'Water Supply': [
                'waterleakissues',
                'watersupplyissues',
                'drainageissues',
                'floodingissues',
                'waterqualityissues',
                'meterissues'
            ],
            'Parks & Recreation': [
                'parkissues',
                'playgroundissues',
                'treeissues',
                'benchissues',
                'fountainissues',
                'sportsfacilityissues',
                'trailissues'
            ],
            'Roads & Transport': [
                'trafficissues',
                'parkingissues',
                'roadissues',
                'signissues',
                'signalissues',
                'busissues',
                'pedestrianissues',
                'illegalparkingissues',
                'manholeopenissues',
                'treefallenissues'
            ],
            'Health': [
                'mosquitoissues',
                'rodentissues',
                'sanitationissues',
                'publichealthissues',
                'clinicissues',
                'restaurantissues'
            ],
            'Police': [
                'safetyissues',
                'crimeissues',
                'trafficissues',
                'noiseissues',
                'patrolissues',
                'securityissues'
            ],
            'Fire Department': [
                'firehazardissues',
                'hydrantissues',
                'safetyissues',
                'emergencyissues',
                'alarmissues',
                'accessissues'
            ],
            'Animal Control': [
                'animalissues',
                'strayissues',
                'wildlifeissues',
                'noiseissues',
                'biteissues',
                'shelterissues'
            ]
        };

        return mapping[normalizedDept] || [];
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
                let q = query(collection(db, collectionName),
                    where('department', '==', dept)); // Exact match with Firestore

                if (statusFilter !== 'all') {
                    q = query(q, where('status', '==', statusFilter.toLowerCase()));
                }

                const querySnapshot = await getDocs(q);
                const issuesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    collection: collectionName,
                    ...doc.data()
                }));
                allIssues = [...allIssues, ...issuesData];
            }

            setIssues(allIssues);
        } catch (error) {
            console.error('Error fetching issues:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateIssueStatus = async (id: string, collectionName: string, newStatus: string) => {
        try {
            await updateDoc(doc(db, collectionName, id), {
                status: newStatus.toLowerCase(),
                updatedAt: new Date()
            });
            if (department) fetchAllDepartmentIssues(department);
        } catch (error) {
            console.error('Error updating issue:', error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Admin Panel - {department} Department</h1>

            <div className="mb-6 flex items-center gap-4">
                <select
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        if (department) fetchAllDepartmentIssues(department);
                    }}
                    className="border p-2 rounded"
                >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {loading ? (
                <div>Loading issues...</div>
            ) : issues.length === 0 ? (
                <div>No issues found for this department.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border">Type</th>
                                <th className="py-2 px-4 border">Description</th>
                                <th className="py-2 px-4 border">Location</th>
                                <th className="py-2 px-4 border">Status</th>
                                <th className="py-2 px-4 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {issues.map((issue) => (
                                <tr key={`${issue.collection}-${issue.id}`}>
                                    <td className="py-2 px-4 border">{issue.issueType}</td>
                                    <td className="py-2 px-4 border">{issue.description.substring(0, 50)}...</td>
                                    <td className="py-2 px-4 border">{issue.location.substring(0, 30)}...</td>
                                    <td className="py-2 px-4 border">
                                        <span className={`px-2 py-1 rounded text-xs ${issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                            issue.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                                issue.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {issue.status}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border">
                                        <select
                                            value={issue.status}
                                            onChange={(e) => updateIssueStatus(issue.id, issue.collection, e.target.value)}
                                            className="border p-1 rounded text-sm"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="resolved">Resolved</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;