import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaChevronDown, FaChevronUp, FaHome } from 'react-icons/fa';

const FAQ = () => {
    const [activeCategory, setActiveCategory] = useState<string>('general');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

    const toggleQuestion = (id: string) => {
        setExpandedQuestions(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const categories = [
        { id: 'general', name: 'General Questions' },
        { id: 'reporting', name: 'Reporting Issues' },
        { id: 'account', name: 'Account Management' },
        { id: 'technical', name: 'Technical Support' },
        { id: 'community', name: 'Community Involvement' }
    ];

    const faqs = {
        general: [
            {
                id: 'gen1',
                question: 'What is Jan Sahay?',
                answer: 'Jan Sahay is a civic engagement platform that connects citizens with local authorities to report and resolve community issues like potholes, garbage collection, street lighting, and other municipal concerns.'
            },
            {
                id: 'gen2',
                question: 'Is Jan Sahay free to use?',
                answer: 'Yes, Jan Sahay is completely free for citizens to use. There are no charges for reporting issues or accessing basic features.'
            },
            {
                id: 'gen3',
                question: 'Which areas does Jan Sahay serve?',
                answer: 'Currently, Jan Sahay serves the Bhabua region of Kaimur district in Bihar. We plan to expand to other regions based on community demand and partnerships with local authorities.'
            }
        ],
        reporting: [
            {
                id: 'rep1',
                question: 'How do I report an issue?',
                answer: 'To report an issue: 1) Click on "Report Issue" in the navigation, 2) Select the issue category, 3) Add details and location, 4) Attach photos if available, 5) Submit the report. You\'ll receive a tracking number for follow-up.'
            },
            {
                id: 'rep2',
                question: 'What types of issues can I report?',
                answer: 'You can report various civic issues including: potholes, garbage accumulation, broken street lights, water supply problems, drainage issues, road damage, and other public infrastructure concerns.'
            },
            {
                id: 'rep3',
                question: 'Can I report issues anonymously?',
                answer: 'Yes, you can choose to report issues anonymously. However, providing your contact information helps us follow up for additional details if needed and notify you when the issue is resolved.'
            }
        ],
        account: [
            {
                id: 'acc1',
                question: 'How do I create an account?',
                answer: 'Click on "Sign Up" in the top right corner. You can register using your email address or phone number. After verification, your account will be activated immediately.'
            },
            {
                id: 'acc2',
                question: 'I forgot my password. How can I reset it?',
                answer: 'On the login page, click "Forgot Password" and enter your registered email. You\'ll receive a link to reset your password. The link expires in 24 hours for security reasons.'
            },
            {
                id: 'acc3',
                question: 'Can I change my registered email address?',
                answer: 'Yes, you can update your email in the Account Settings section. You\'ll need to verify the new email address before it becomes active.'
            }
        ],
        technical: [
            {
                id: 'tech1',
                question: 'The app is not loading properly. What should I do?',
                answer: 'Try these steps: 1) Refresh the page, 2) Clear your browser cache, 3) Check your internet connection, 4) Try a different browser. If the problem persists, contact our support team with details about the issue.'
            },
            {
                id: 'tech2',
                question: 'How do I update the app?',
                answer: 'For web users, the application updates automatically. For mobile app users, updates are available through the Play Store (Android) or App Store (iOS). Enable automatic updates for the best experience.'
            },
            {
                id: 'tech3',
                question: 'Why can\'t I upload photos with my report?',
                answer: 'This could be due to: 1) Large file size (try resizing), 2) Unsupported format (we accept JPG, PNG), 3) Slow internet connection, or 4) App permissions not granted. Check these settings and try again.'
            }
        ],
        community: [
            {
                id: 'comm1',
                question: 'How can I volunteer with Jan Sahay?',
                answer: 'We welcome volunteers! You can help with community outreach, issue verification, or local awareness campaigns. Contact us at volunteer@jansahay.com or visit our Community page for current opportunities.'
            },
            {
                id: 'comm2',
                question: 'Can my organization partner with Jan Sahay?',
                answer: 'Yes, we collaborate with NGOs, community groups, and local businesses. Partnership inquiries can be sent to partnerships@jansahay.com with details about your organization and proposed collaboration.'
            },
            {
                id: 'comm3',
                question: 'How can I spread awareness about Jan Sahay in my area?',
                answer: 'You can: 1) Share our social media posts, 2) Organize community meetings to demonstrate the platform, 3) Distribute printed materials (available on request), 4) Become a neighborhood ambassador.'
            }
        ]
    };

    const filteredFaqs = faqs[activeCategory as keyof typeof faqs].filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 text-center">Frequently Asked Questions</h1>
                    <p className="mt-2 text-gray-600 text-center max-w-2xl mx-auto">
                        Find answers to common questions about using Jan Sahay and reporting community issues.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {/* Search and Navigation */}
                <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search FAQs..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Link
                        to="/"
                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        <FaHome className="mr-2" /> Back to Home
                    </Link>
                </div>

                {/* Category Tabs */}
                <div className="mb-8 overflow-x-auto">
                    <div className="flex space-x-2 pb-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${activeCategory === category.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* FAQ List */}
                <div className="bg-white shadow overflow-hidden rounded-md">
                    {filteredFaqs.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {filteredFaqs.map((faq) => (
                                <li key={faq.id}>
                                    <button
                                        onClick={() => toggleQuestion(faq.id)}
                                        className="w-full px-4 py-4 text-left hover:bg-gray-50 focus:outline-none"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-medium text-gray-900">
                                                {faq.question}
                                            </h3>
                                            <span className="ml-6 flex items-center">
                                                {expandedQuestions[faq.id] ? (
                                                    <FaChevronUp className="h-5 w-5 text-gray-500" />
                                                ) : (
                                                    <FaChevronDown className="h-5 w-5 text-gray-500" />
                                                )}
                                            </span>
                                        </div>
                                        {expandedQuestions[faq.id] && (
                                            <div className="mt-2 pr-12">
                                                <p className="text-base text-gray-600">{faq.answer}</p>
                                            </div>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-4 py-12 text-center">
                            <h3 className="text-lg font-medium text-gray-900">No results found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Try adjusting your search or filter to find what you're looking for.
                            </p>
                        </div>
                    )}
                </div>

                {/* Additional Help Section */}
                <div className="mt-12 bg-blue-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Still need help?</h2>
                    <p className="text-gray-600 mb-4">
                        Can't find the answer you're looking for? Our support team is here to help.
                    </p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FAQ;