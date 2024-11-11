import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold tracking-wider hover:text-blue-500 transition-all">
        Blog Platform
      </Link>
      <div className="flex space-x-4">
        
        <Link 
          to="/create" 
          className="bg-blue-500 px-6 py-2 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all"
        >
          Create Post
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
