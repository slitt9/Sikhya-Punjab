import { Link } from "react-router-dom";
import "./Navbar.css";
import logoImg from "../assets/sikhyapunjablogo.png"; // Import your logo image


const Navbar = () => {
  return (
      <nav className="navbar">
        <div className="logo">
          <Link to="/">
            <img src={logoImg} alt="Sikhya Punjab Logo" className="logo-image" />
          </Link>

        </div>
        <ul>
          <li>
            <Link to="/lessons-speaking">Lessons: Speaking</Link>
          </li>
          <li>
            <Link to="/lessons-reading">Lessons: Reading</Link>
          </li>
          <li>
            <Link to="/important-figures">Important Figures</Link>
          </li>
          <li>
            <Link to="/important-events">Important Events</Link>
          </li>
          <li>
            <Link to="/values-ethics">Values & Ethics</Link>
          </li>
        </ul>
      </nav>
  );
};

export default Navbar;