import React from 'react';

export function CourseProgress({course}) {
  // This is a simplified example. You'd need to implement logic to track and update progress.
  const progress = 30; // Example: 30% complete

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Your Progress</h3>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{width: `${progress}%`}}
        ></div>
      </div>
      <p className="mt-2 text-sm text-gray-600">{progress}% Complete</p>
    </div>
  );
}