"use client";
import Hero from "./components/Hero";
import About from "./components/About";
import { useEffect, useState } from "react";

export default function Home() {
  const [showSpinner, setShowSpinner] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const spinnerTimer = setTimeout(() => {
      setShowSpinner(false);
    }, 1500);

    const bgTimer = setTimeout(() => {
      const leftPanel = document.querySelector('.left-panel');
      const rightPanel = document.querySelector('.right-panel');

      if (leftPanel && rightPanel) {
        leftPanel.classList.add('fade-out');
        rightPanel.classList.add('fade-out');
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }, 1500 + 500);

    return () => {
      clearTimeout(spinnerTimer);
      clearTimeout(bgTimer);
    };
  }, []);

  return (
    <div>
      {isLoading && (
        <div className="loading-screen">
          <div className="left-panel"></div>
          <div className="right-panel"></div>
          {showSpinner && <span className="loader"></span>}
        </div>
      )}

      <Hero />
      <About />
    </div>
  );
}