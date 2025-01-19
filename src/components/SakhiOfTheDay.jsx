
const SakhiOfTheDay = () => {
  // Static "Sakhi of the Day" content for now
  const sakhiContent = `One day, a Sikh Guru encouraged his followers to embrace selflessness and service. This story inspires countless people to practice kindness daily.`;

  return (
    <div className="sakhi-card">
      <h2>Sakhi of the Day</h2>
      <p>{sakhiContent}</p>
    </div>
  );
};

export default SakhiOfTheDay;