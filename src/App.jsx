import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SakhiOfTheDay from "./components/SakhiOfTheDay"; // Home Page Content
import LessonsSpeaking from "./pages/LessonsSpeaking";
import LessonsReading from "./pages/LessonsReading";
import ImportantFigures from "./pages/ImportantFigures";
import ImportantEvents from "./pages/ImportantEvents";
import ValuesEthics from "./pages/ValuesEthics";
import "./App.css";

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
                        <>
                            <header className="header">
                                <h1
                                    className={`animated-title ${
                                        showPunjabiTitle ? "punjabi-show" : "english-show"
                                    }`}
                                >
                                    <span className="english">Sikhya Punjab</span>
                                    <span className="punjabi">ਸਿੱਖਿਆ ਪੰਜਾਬ</span>
                                </h1>
                                <p className="subtitle">
                                    Preserving the Rich Culture and Heritage of Punjab
                                </p>
                            </header>
                            <main>
                                <SakhiOfTheDay />
                            </main>
                        </>
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