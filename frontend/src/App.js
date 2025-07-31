import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./components/Game";
import PremiumLoadingScreen from "./components/PremiumLoadingScreen";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <div className="App">
      {isLoading && (
        <PremiumLoadingScreen 
          onLoadingComplete={handleLoadingComplete}
          duration={3000}
        />
      )}
      
      <div className={`screen-transition-enter-active ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Game />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;