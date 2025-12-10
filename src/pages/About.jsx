import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl">About This Project</h2>
          <p className="text-lg">
            This is a React application created with Vite, featuring:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li>React Router for navigation</li>
            <li>Tailwind CSS for styling</li>
            <li>DaisyUI for beautiful components</li>
            <li>Axios for HTTP requests</li>
            <li>Organized folder structure</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
