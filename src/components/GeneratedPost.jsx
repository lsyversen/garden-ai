import React from 'react';

const GeneratedPost = ({ post }) => {
  const { logo, response, prompt, user } = post;

  return (
    <div className="generated-post rounded-xl shadow-card hover:shadow-cardhover p-4 flex items-center bg-white mb-4">
      <img src={logo} alt="Plant Logo" className="w-16 h-16 object-cover rounded-full mr-4" />
      <div className="content flex flex-col flex-grow">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">{prompt}</h2>
        </div>
        <p className="response text-center text-gray-700 mt-2 bg-gray-100 rounded-lg p-2">
          {response}
        </p>
      </div>
    </div>
  );
};

export default GeneratedPost;

