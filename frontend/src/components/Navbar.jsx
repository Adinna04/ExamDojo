import { Link } from 'react-router-dom'
import '../styles/Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">

      {/* LOGO */}
      <div className="navbar-logo">
        Exam<span>Dojo</span>
      </div>

      {/* LINKS */}
      <ul className="navbar-links">
        <li><Link to="/#exams">Exams</Link></li>
        <li><Link to="/#features">Features</Link></li>
        <li><Link to="/#leaderboard">Leaderboard</Link></li>
        <li><Link to="/login" className="navbar-cta">Start Free</Link></li>
      </ul>

    </nav>
  )
}

export default Navbar