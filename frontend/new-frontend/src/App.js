import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CreatePostPage from './pages/CreatePost';

function App() {
  return (
    <Router>
      <div className="bg-gray-900 min-h-screen text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePostPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
