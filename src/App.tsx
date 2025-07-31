  import React from "react";
  import { Routes, Route, useLocation } from "react-router-dom";
  import Portfolio from "./Portfolio";
import Landing from "./Landing";


  function App() {

    return (
      <div className="min-h-screen">
        <Routes>
          <Route path="/portfolio/:id" element={<Portfolio />} />
          <Route path="/" element={<Landing />} />

        </Routes>
      </div>
    );
  }

  export default App;



