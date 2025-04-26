import React from "react";

const Home = () => {
  return (
    <div className=" p-6">
      <h2 className="text-3xl font-bold text-purple-700 mb-4">
        Welcome back 👋
      </h2>
      <p className="text-gray-600 mb-6">
        Here's an overview of your carbon tracking activity.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white shadow-md rounded-xl p-4">
          <h3 className="text-lg font-semibold">Companies Onboarded</h3>
          <p className="text-2xl font-bold text-purple-600">12</p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-4">
          <h3 className="text-lg font-semibold">Files Uploaded</h3>
          <p className="text-2xl font-bold text-purple-600">48</p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-4">
          <h3 className="text-lg font-semibold">Products Verified</h3>
          <p className="text-2xl font-bold text-purple-600">134</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
