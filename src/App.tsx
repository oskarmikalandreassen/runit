import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Resources from "./components/Resources";
import Dashboard from "./components/Dashboard";
import "./app.css";
import data from "./data.json";
import Predictor from "./components/Predictor";
import Analysis from "./components/Analysis";

function App() {
  return (
    <BrowserRouter>
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />{" "}
          <Route path="/dashboard" element={<Dashboard data={data} />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/predictor" element={<Predictor />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
