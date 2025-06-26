import './App.css'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        {/* Add pt-16 to account for fixed navbar height */}
        <main className="pt-16">
          <div>Content goes here</div>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
