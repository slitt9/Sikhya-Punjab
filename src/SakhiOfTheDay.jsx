const SakhiOfTheDay = () => {
    const sakhiContent = `One day, a Sikh Guru encouraged his followers to embrace selflessness and service. This story inspires countless people to practice kindness daily.`;

    return (
        <div id="sakhi-section" className="sakhi-card">
            <h2>Sakhi of the Day</h2>
            <p>
                {sakhiContent}
            </p>
        </div>
    );
};

export default SakhiOfTheDay;