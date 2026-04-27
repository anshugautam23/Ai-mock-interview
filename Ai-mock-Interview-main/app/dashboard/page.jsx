import React from "react";
import AddNewInterview from "./_components/AddNewInterview";
import InterviewList from "./_components/InterviewList";

const Dashboard = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950" />
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-indigo-200 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-violet-200 dark:bg-violet-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative px-6 py-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold mb-4 border border-indigo-200 dark:border-indigo-800">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
              AI Powered Mock Interviews
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-3">
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                Master Your
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">Next Interview</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base max-w-md">
              Practice with AI-generated questions tailored to your role. Get instant feedback and track your progress.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-12">
        {/* Start New Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-8 w-1 bg-gradient-to-b from-indigo-600 to-violet-600 rounded-full" />
            <div>
              <h2 className="font-bold text-xl text-gray-900 dark:text-white">Start New Interview</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Set up a new AI mock session in seconds</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <AddNewInterview />
          </div>
        </div>

        {/* Previous Interviews */}
        <InterviewList />
      </div>
    </div>
  );
};

export default Dashboard;
