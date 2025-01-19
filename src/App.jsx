import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SakhiOfTheDay from "./SakhiOfTheDay"; // Home Page Content
import LessonsSpeaking from "./pages/LessonsSpeaking";
import LessonsReading from "./pages/LessonsReading";
import ImportantFigures from "./pages/ImportantFigures";
import ImportantEvents from "./pages/ImportantEvents";
import ValuesEthics from "./pages/ValuesEthics";
import "./App.css";
import LandingSection from "./LandingSection.jsx";

const App = () => {
    const [showPunjabiTitle, setShowPunjabiTitle] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setShowPunjabiTitle((prev) => !prev);
        }, 2000); // Switch title every 2 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <Router>
            <Navbar /> {/* Persistent Navbar */}
            <Routes>
                {/* Home Page */}
                <Route
                    path="/"
                    element={
                        <div className="home-container">
                            {/* Landing Section */}
                            <LandingSection />

                            {/* Sakhi of the Day Section */}
                            <SakhiOfTheDay />
                        </div>
                    }
                />


                {/* Individual Pages */}
                <Route path="/lessons-speaking" element={<LessonsSpeaking />} />
                <Route path="/lessons-reading" element={<LessonsReading />} />
                <Route path="/important-figures" element={<ImportantFigures />} />
                <Route path="/important-events" element={<ImportantEvents />} />
                <Route path="/values-ethics" element={<ValuesEthics />} />
            </Routes>
        </Router>
    );
};

export default App;