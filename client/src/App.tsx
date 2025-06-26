import './App.css'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import Footer from './components/Footer' // Add this import

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        {/* Add pt-16 to account for fixed navbar height */}
        <main className="pt-16 flex-1">
          <Homepage />
        </main>
        <Footer /> {/* Add Footer here */}
      </div>
    </BrowserRouter>
  )
}

export default App
