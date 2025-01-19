import { useEffect, useState } from "react";
import "./LandingSection.css";

const LandingSection = () => {
    const [hasScrolled, setHasScrolled] = useState(false); // Tracks whether the animation has run

    useEffect(() => {
        const handleScroll = () => {
            const sakhiSection = document.getElementById("sakhi-section");

            // Detect user is scrolling down (10% of the viewport threshold)
            if (sakhiSection && window.scrollY > window.innerHeight * 0.1) {
                if (!hasScrolled) {
                    sakhiSection.scrollIntoView({ behavior: "smooth", block: "start" });
                    sakhiSection.classList.add("show-section"); // Add the animation class
                    setHasScrolled(true); // Animation triggered
                }
            }
            // Reset the animation when the user scrolls back up
            else if (sakhiSection && window.scrollY < window.innerHeight * 0.1) {
                sakhiSection.classList.remove("show-section"); // Remove the animation class
                setHasScrolled(false); // Reset for re-triggering
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasScrolled]);

    return (
        <div className="landing-section">
            <h1 className="animated-title">
                <span className="english">Sikhya Punjab</span>
                <span className="punjabi">ਸਿੱਖਿਆ ਪੰਜਾਬ</span>
            </h1>
            <p className="subtitle">
                Preserving the Rich Culture and Heritage of Punjab
            </p>
        </div>
    );
};

export default LandingSection;