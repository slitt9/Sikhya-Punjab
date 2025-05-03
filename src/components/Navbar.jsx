import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logoImg from "../assets/sikhyapunjablogo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={logoImg} alt="Sikhya Punjab Logo" className="logo-image" />
        </Link>
      </div>

      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li>
          <Link to="/lessons-speaking" onClick={() => setMenuOpen(false)}>
            Test Your Speaking
          </Link>
        </li>
        <li>
          <Link to="/lessons-reading" onClick={() => setMenuOpen(false)}>
            Test Your Reading
          </Link>
        </li>
        <li>
          <Link to="/important-figures" onClick={() => setMenuOpen(false)}>
            Important Figures
          </Link>
        </li>
        <li>
          <Link to="/important-events" onClick={() => setMenuOpen(false)}>
            Important Events
          </Link>
        </li>
        <li>
          <Link to="/values-ethics" onClick={() => setMenuOpen(false)}>
            Values & Ethics
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
