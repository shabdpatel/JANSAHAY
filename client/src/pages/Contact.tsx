import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Contact = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 text-center">Contact Us</h1>
                    <p className="mt-2 text-gray-600 text-center max-w-2xl mx-auto">
                        Have questions or feedback? We'd love to hear from you! Reach out through any of the channels below.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Get In Touch</h2>

                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                    <FaMapMarkerAlt className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-gray-900">Address</h3>
                                    <p className="text-sm text-gray-500">Bhabua, Kaimur, Bihar 821101</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                    <FaPhone className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-gray-900">Phone</h3>
                                    <p className="text-sm text-gray-500">+91 8757489128</p>
                                    <p className="text-xs text-gray-400 mt-1">Monday-Friday, 9am-5pm</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                    <FaEnvelope className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-gray-900">Email</h3>
                                    <p className="text-sm text-gray-500">shabdpatel87@gmail.com</p>
                                    <p className="text-xs text-gray-400 mt-1">Typically respond within 24 hours</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                    <FaClock className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-gray-900">Office Hours</h3>
                                    <p className="text-sm text-gray-500">Monday - Friday: 9:00 AM - 5:00 PM</p>
                                    <p className="text-sm text-gray-500">Saturday: 10:00 AM - 2:00 PM</p>
                                    <p className="text-sm text-gray-500">Sunday: Closed</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Follow Us</h3>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-blue-600">
                                    <FaTwitter className="h-5 w-5" />
                                </a>
                                <a href="https://www.linkedin.com/company/jansahay/?viewAsMember=true" className="text-gray-400 hover:text-blue-600">
                                    <FaLinkedin className="h-5 w-5" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-blue-600">
                                    <FaGithub className="h-5 w-5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Send Us a Message</h2>
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                                    Subject
                                </label>
                                <select
                                    id="subject"
                                    name="subject"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option>General Inquiry</option>
                                    <option>Report a Bug</option>
                                    <option>Feature Request</option>
                                    <option>Partnership</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                ></textarea>
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="subscribe"
                                    name="subscribe"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="subscribe" className="ml-2 block text-sm text-gray-700">
                                    Subscribe to our newsletter
                                </label>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Our Location</h2>
                    <div className="aspect-w-16 aspect-h-9">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3630.051650056053!2d83.61322731501354!3d25.05074498389128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e2db76febcf4d%3A0x68131710853ff0b5!2sBhabua%2C%20Bihar!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                            width="100%"
                            height="400"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            title="Our Location in Bhabua, Kaimur, Bihar"
                        ></iframe>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div className="border-b border-gray-200 pb-4">
                            <h3 className="text-lg font-medium text-gray-900">How do I report an issue?</h3>
                            <p className="mt-1 text-sm text-gray-600">
                                You can report issues through our web platform or mobile app. Simply navigate to the "Report Issue" page, fill out the form with details about the issue, and submit it with any relevant photos.
                            </p>
                        </div>
                        <div className="border-b border-gray-200 pb-4">
                            <h3 className="text-lg font-medium text-gray-900">How long does it take to resolve issues?</h3>
                            <p className="mt-1 text-sm text-gray-600">
                                Resolution times vary depending on the type and complexity of the issue. Simple issues like potholes or garbage accumulation are typically addressed within 3-5 business days, while more complex issues may take longer.
                            </p>
                        </div>
                        <div className="border-b border-gray-200 pb-4">
                            <h3 className="text-lg font-medium text-gray-900">Can I track the status of my reported issues?</h3>
                            <p className="mt-1 text-sm text-gray-600">
                                Yes! Once you've reported an issue, you can track its status in the "Issue History" section of your account. You'll receive notifications when there are updates to your reported issues.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">How can I volunteer or get more involved?</h3>
                            <p className="mt-1 text-sm text-gray-600">
                                We welcome community involvement! Please contact us through this form or email volunteer@jansahay.com to learn about volunteer opportunities and community initiatives.
                            </p>
                        </div>
                    </div>
                    <div className="mt-6 text-center">
                        <Link to="/faq" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View all FAQs →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;