import React from 'react';

const MetricPost = ({ post }) => {
  const { logo, response, prompt, user } = post;

  return (
    <div className="metric-post rounded-lg shadow-card hover:shadow-cardhover p-2 flex items-center bg-white mb-2">
      <img src={logo} alt="Metric Icon" className="w-10 h-10 object-cover rounded mr-2" />
      <div className="content flex flex-col flex-grow">
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-800">{prompt}</h3>
            <span className="text-sm text-gray-500 lowercase">{user}</span>
        </div>
        <p className="response text-xs text-gray-600 bg-gray-100 rounded p-1 mt-1">{response}</p>
      </div>
    </div>
  );
};

export default MetricPost;
