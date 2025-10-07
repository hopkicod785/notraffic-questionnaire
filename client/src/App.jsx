import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Questionnaire from './components/Questionnaire';
import AdminPortal from './components/AdminPortal';
import Logo from './components/Logo';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-brand">
              <Logo size="lg" />
            </Link>
            <div className="nav-links">
              <Link to="/" className="nav-link">New Submission</Link>
              <Link to="/admin" className="nav-link">Admin Portal</Link>
            </div>
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<Questionnaire />} />
          <Route path="/admin" element={<AdminPortal />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

