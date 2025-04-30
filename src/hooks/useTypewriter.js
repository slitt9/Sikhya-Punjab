import { useState, useEffect } from 'react';

const useTypewriter = (
  texts,              // ['Sikhya Punjab', 'ਸਿੱਖਿਆ ਪੰਜਾਬ', 'Sikhya Punjab']
  delay = 100,        // typing/deleting speed
  holdTime = 2000     // how long to hold each full string
) => {
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex]   = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isComplete) return;

    const fullText = texts[textIndex];

    // Once we’ve fully typed Gurmukhi (index 1), skip deletion and jump immediately to final English
    if (!isDeleting && currentText === fullText) {
      // If we just finished typing Gurmukhi
      if (textIndex === 1) {
        const t = setTimeout(() => {
          setCurrentText(texts[2]);
          setIsComplete(true);
        }, holdTime);
        return () => clearTimeout(t);
      }

      // Otherwise schedule deletion after holdTime
      const t = setTimeout(() => setIsDeleting(true), holdTime);
      return () => clearTimeout(t);
    }

    const tick = setTimeout(() => {
      const updated = isDeleting
        ? fullText.substring(0, currentText.length - 1)
        : fullText.substring(0, currentText.length + 1);

      setCurrentText(updated);

      // If we finished deleting and it wasn’t the Gurmukhi phase, advance to next text
      if (isDeleting && updated === '') {
        setIsDeleting(false);
        setTextIndex((i) => i + 1);
      }
    }, delay);

    return () => clearTimeout(tick);
  }, [
    currentText,
    isDeleting,
    textIndex,
    texts,
    delay,
    holdTime,
    isComplete,
  ]);

  return [currentText, isComplete];
};

export default useTypewriter;