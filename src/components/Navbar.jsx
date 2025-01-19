
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
      <nav className="navbar">
        <div className="logo">
          <Link to="/">Sikhya Punjab</Link>
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
          <li>
            <button>Sign In</button>
          </li>
          <li>
            <button>Register</button>
          </li>
        </ul>
      </nav>
  );
};

export default Navbar;