// src/data/sampleIssues.ts
export interface Issue {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  status: 'Pending' | 'Resolved' | 'In Progress';
  timeAgo: string;
  imageUrl: string;
}

export const issues: Issue[] = [
  {
    id: '1',
    title: 'Pothole on Main Road',
    description: 'A large pothole has developed on the main road, causing significant traffic jams and posing a risk to vehicles, especially two-wheelers. The pothole has been present for over a week and is getting worse with each passing day. Immediate repair is needed to prevent accidents and ensure smooth traffic flow.',
    location: '28.6139, 77.2090', // Delhi
    category: 'Road Hazard',
    status: 'Pending',
    timeAgo: '2 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    title: 'Streetlight not working',
    description: 'The streetlight near the park has not been functioning for several nights, making the area very dark and unsafe for pedestrians. Residents are concerned about the increased risk of theft and accidents. Kindly arrange for the repair of the streetlight as soon as possible.',
    location: '19.0760, 72.8777', // Mumbai
    category: 'Infrastructure',
    status: 'In Progress',
    timeAgo: '3 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-c5eeecbff44a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '3',
    title: 'Garbage Dump',
    description: 'Garbage has not been collected from our street for the past three days, resulting in a foul smell and attracting stray animals. The overflowing garbage dump is a health hazard and needs urgent attention from the sanitation department.',
    location: '13.0827, 80.2707', // Chennai
    category: 'Sanitation',
    status: 'Resolved',
    timeAgo: '1 day ago',
    imageUrl: 'https://images.unsplash.com/photo-1508873699372-7aeab60b44c9?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '4',
    title: 'Water Leakage',
    description: 'There is a continuous water leakage from the main supply pipe near our building. The leaking water is flooding the street and causing inconvenience to residents and commuters. Please send a team to fix the leakage and prevent water wastage.',
    location: '22.5726, 88.3639', // Kolkata
    category: 'Water Supply',
    status: 'Pending',
    timeAgo: '5 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '5',
    title: 'Broken Bench in Park',
    description: 'One of the benches in the children\'s park is broken and has sharp edges exposed. This poses a danger to kids playing in the park. Requesting urgent repair or replacement of the bench to ensure the safety of park visitors.',
    location: '12.9716, 77.5946', // Bengaluru
    category: 'Public Safety',
    status: 'Pending',
    timeAgo: '1 day ago',
    imageUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '6',
    title: 'Tree Fallen',
    description: 'A large tree has fallen across the road after last night\'s storm, completely blocking traffic. Emergency services are needed to remove the tree and restore normal movement for vehicles and pedestrians.',
    location: '23.0225, 72.5714', // Ahmedabad
    category: 'Infrastructure',
    status: 'In Progress',
    timeAgo: '3 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-c5eeecbff44a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '7',
    title: 'Open Manhole',
    description: 'There is an open manhole near the school entrance, which is extremely dangerous for children and other pedestrians. Please cover the manhole immediately to prevent any accidents.',
    location: '26.9124, 75.7873', // Jaipur
    category: 'Sanitation',
    status: 'Pending',
    timeAgo: '6 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '8',
    title: 'Illegal Parking',
    description: 'Several cars are parked illegally on the footpath, making it difficult for pedestrians to walk. This is especially problematic for elderly people and children. Kindly take action against illegal parking and clear the footpath.',
    location: '17.3850, 78.4867', // Hyderabad
    category: 'Traffic',
    status: 'Resolved',
    timeAgo: '4 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1508873699372-7aeab60b44c9?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '9',
    title: 'Noise Complaint',
    description: 'There is loud music being played late at night from a nearby house, disturbing the peace of the neighborhood. Despite repeated requests, the noise continues. Please intervene to ensure compliance with noise regulations.',
    location: '21.1458, 79.0882', // Nagpur
    category: 'Noise',
    status: 'Pending',
    timeAgo: '1 week ago',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '10',
    title: 'Animal Menace',
    description: 'A group of stray dogs has been causing trouble in our area, chasing vehicles and scaring residents. The animal control team is requested to address this issue promptly.',
    location: '18.5204, 73.8567', // Pune
    category: 'Animal Control',
    status: 'In Progress',
    timeAgo: '2 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-c5eeecbff44a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '11',
    title: 'Blocked Drain',
    description: 'The drain on our street is blocked, causing water to accumulate and resulting in water logging. This is leading to mosquito breeding and health concerns. Please clear the drain at the earliest.',
    location: '11.0168, 76.9558', // Coimbatore
    category: 'Sanitation',
    status: 'Pending',
    timeAgo: '12 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3c8b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '12',
    title: 'Power Outage',
    description: 'There has been no power supply in our area since last night. Residents are facing a lot of inconvenience, especially students and elderly people. Kindly restore the power supply as soon as possible.',
    location: '15.2993, 74.1240', // Goa
    category: 'Infrastructure',
    status: 'Resolved',
    timeAgo: '3 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-c5eeecbff44a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '13',
    title: 'Road Damage',
    description: 'The road surface has been badly damaged after the recent rains, making it difficult for vehicles to pass. There are several potholes and cracks that need urgent repair.',
    location: '25.5941, 85.1376', // Patna
    category: 'Road Hazard',
    status: 'Pending',
    timeAgo: '5 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '14',
    title: 'Garbage Burning',
    description: 'Garbage is being burnt in the open near our locality, causing air pollution and health issues for residents. Please take strict action to stop this practice and penalize the offenders.',
    location: '23.3441, 85.3096', // Ranchi
    category: 'Sanitation',
    status: 'Pending',
    timeAgo: '1 week ago',
    imageUrl: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '15',
    title: 'Water Supply Issue',
    description: 'There has been no water supply in the morning for the past two days, making it difficult for residents to manage daily chores. Please resolve the issue and restore regular water supply timings.',
    location: '22.7196, 75.8577', // Indore
    category: 'Water Supply',
    status: 'In Progress',
    timeAgo: '2 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-c5eeecbff44a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '16',
    title: 'Broken Traffic Signal',
    description: 'The traffic signal at the main intersection is not working, leading to confusion and traffic jams during peak hours. Requesting urgent repair to ensure smooth traffic management and safety.',
    location: '26.8467, 80.9462', // Lucknow
    category: 'Traffic',
    status: 'Pending',
    timeAgo: '6 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '17',
    title: 'Overflowing Dustbin',
    description: 'The dustbin in our area has not been cleared for a week and is now overflowing. This is attracting stray animals and spreading foul smell. Please arrange for immediate garbage collection.',
    location: '32.0998, 76.2691', // Chandigarh
    category: 'Sanitation',
    status: 'Resolved',
    timeAgo: '4 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1508873699372-7aeab60b44c9?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '18',
    title: 'Street Flooding',
    description: 'Heavy rainfall has caused flooding on the street, making it impossible for vehicles and pedestrians to pass. The drainage system needs to be improved to prevent such incidents in the future.',
    location: '27.1767, 78.0081', // Agra
    category: 'Flooding',
    status: 'Pending',
    timeAgo: '3 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '19',
    title: 'Animal on Road',
    description: 'A cow has been sitting in the middle of the road for several hours, blocking traffic and causing inconvenience. Kindly send the animal control team to relocate the animal safely.',
    location: '29.9457, 78.1642', // Haridwar
    category: 'Animal Control',
    status: 'Pending',
    timeAgo: '1 week ago',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-c5eeecbff44a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '20',
    title: 'Illegal Construction',
    description: 'Unauthorized construction work is being carried out on the footpath, blocking pedestrian movement and violating municipal regulations. Please inspect and take necessary action.',
    location: '28.4089, 77.3178', // Gurugram
    category: 'Road Hazard',
    status: 'In Progress',
    timeAgo: '2 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-c5eeecbff44a?auto=format&fit=crop&w=600&q=80',
  },
];
