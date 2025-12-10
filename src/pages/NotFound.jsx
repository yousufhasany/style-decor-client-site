import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-9xl font-bold">404</h1>
          <p className="py-6 text-xl">
            Oops! The page you're looking for doesn't exist.
          </p>
          <Link to="/" className="btn btn-primary">
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
