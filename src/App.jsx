import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import LessonsSpeaking from "./pages/LessonsSpeaking";
import LessonsReading from "./pages/LessonsReading";
import ImportantFigures from "./pages/ImportantFigures";
import ImportantEvents from "./pages/ImportantEvents";
import ValuesEthics from "./pages/ValuesEthics";
import "./App.css";

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Hero />} />
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