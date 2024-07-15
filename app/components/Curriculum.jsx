import React from 'react';

export function Curriculum({course}) {
  const curriculum = JSON.parse(course.metafields.find(m => m.key === 'curriculum')?.value || '[]');

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Course Curriculum</h2>
      {curriculum.map((section, index) => (
        <div key={index} className="mb-4">
          <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
          <ul className="list-disc pl-5">
            {section.lessons.map((lesson, lessonIndex) => (
              <li key={lessonIndex} className="mb-1">
                {lesson.title} ({lesson.duration} mins)
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}