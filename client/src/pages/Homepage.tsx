import { FaClipboardList, FaShieldAlt, FaUsers } from 'react-icons/fa';
import IssueCard from './../components/Issuecard';
import { issues } from '../data/sampleIssues';

const bannerImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';

const Homepage = () => {
  return (
    <div className="pt-4 sm:pt-8">
      {/* Hero Banner Section */}
      <section className="px-2 sm:px-6 lg:px-16">
        <div
          className="relative w-full h-[180px] xs:h-[220px] sm:h-[260px] md:h-[320px] lg:h-[360px] xl:h-[400px] bg-cover bg-center rounded-md sm:rounded-xl overflow-hidden shadow-md mt-1"
          style={{ backgroundImage: `url(${bannerImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center text-white px-2 xs:px-3 sm:px-6">
            <h1 className="text-lg xs:text-xl sm:text-2xl md:text-4xl font-bold mb-1 xs:mb-2 sm:mb-3">
              Empower Your Community with Civic Reporter
            </h1>
            <p className="text-xs xs:text-sm sm:text-base md:text-lg mb-2 xs:mb-3 sm:mb-4 max-w-xs sm:max-w-md">
              Report local issues, track progress, and contribute to a better
              neighborhood effortlessly.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1.5 xs:px-4 xs:py-2 rounded shadow transition text-xs xs:text-sm sm:text-base">
              Report a New Issue
            </button>
          </div>
        </div>
      </section>

      {/* Our Impact Section */}
      <section className="my-4 sm:my-8 px-1 xs:px-2 sm:px-4 md:px-8">
        <h2 className="text-center text-lg xs:text-xl sm:text-2xl font-semibold mb-3 sm:mb-6">
          Our Impact
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 sm:gap-4 md:gap-6 max-w-3xl md:max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="flex items-center bg-white rounded-lg shadow px-3 py-2 sm:px-5 sm:py-4 mx-auto w-full max-w-xs sm:max-w-none">
            <div className="bg-blue-100 text-blue-600 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
              <FaClipboardList size={22} className="sm:size-[28px]" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-bold">1,245</h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Issues Reported
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex items-center bg-white rounded-lg shadow px-3 py-2 sm:px-5 sm:py-4 mx-auto w-full max-w-xs sm:max-w-none">
            <div className="bg-blue-100 text-blue-600 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
              <FaShieldAlt size={22} className="sm:size-[28px]" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-bold">987</h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Issues Resolved
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex items-center bg-white rounded-lg shadow px-3 py-2 sm:px-5 sm:py-4 mx-auto w-full max-w-xs sm:max-w-none">
            <div className="bg-blue-100 text-blue-600 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
              <FaUsers size={22} className="sm:size-[28px]" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-bold">5,000+</h3>
              <p className="text-xs sm:text-sm text-gray-500">Active Users</p>
            </div>
          </div>
        </div>
      </section>

      {/* Issues Section - THIS IS THE ONLY ONE THAT SHOULD EXIST */}
      <section className="px-2 sm:px-4 md:px-10 my-6 sm:my-10">
        <h2 className="text-center text-lg sm:text-2xl font-semibold mb-6">
          Recently Reported Issues
        </h2>
        <div className="px-2 sm:px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </section>
      {/* How It Works Section */}
      <section className="px-4 md:px-10 py-6 sm:py-10 bg-gray-50">
        <h2 className="text-center text-lg sm:text-2xl font-semibold mb-8">
          How Civic Reporter Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="text-center bg-white shadow rounded-lg px-6 py-6">
            <div className="text-blue-600 text-3xl mb-4">⚡</div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">Report Instantly</h3>
            <p className="text-sm text-gray-600">
              Quickly submit issues with photos and locations via our intuitive form.
            </p>
          </div>
          <div className="text-center bg-white shadow rounded-lg px-6 py-6">
            <div className="text-blue-600 text-3xl mb-4">👥</div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">Track Progress</h3>
            <p className="text-sm text-gray-600">
              Monitor the status of your reports and see community updates.
            </p>
          </div>
          <div className="text-center bg-white shadow rounded-lg px-6 py-6">
            <div className="text-blue-600 text-3xl mb-4">🛡️</div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">Community Impact</h3>
            <p className="text-sm text-gray-600">
              Join a network that drives positive change in your neighborhood.
            </p>
          </div>
        </div>
      </section>

      {/* Partner Logos Section */}
      <section className="px-4 md:px-10 py-6 sm:py-10">
        <h2 className="text-center text-lg sm:text-2xl font-semibold mb-6">
          Our Valued Partners
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-6 bg-white px-4 py-4 rounded-lg shadow max-w-5xl mx-auto">
          {[
            'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
            'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
            'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
            'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
            'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
            'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
          ].map((logo, idx) => (
            <img key={idx} src={logo} alt={`Partner ${idx}`} className="h-10 sm:h-12" />
          ))}
        </div>
      </section>

    </div>
  );
};

export default Homepage;