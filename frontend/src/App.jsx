import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Categorias from './pages/Categorias'
import Productos from './pages/Productos'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-title">Microservicios App</h1>
            <div className="nav-links">
              <Link to="/" className="nav-link">Categorías</Link>
              <Link to="/productos" className="nav-link">Productos</Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Categorias />} />
            <Route path="/productos" element={<Productos />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

