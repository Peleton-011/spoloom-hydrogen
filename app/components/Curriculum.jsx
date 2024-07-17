import React from 'react';
import {Player} from 'video-react';

function changeUrl(url) {
  const parts = url.split('/');
  const id = parts[parts.length - 2];
  return 'https://cdn.shopify.com/videos/c/o/v/' + id + '.mp4';
}

function parseLesson(lesson) {
  const les = lesson.node;
  return {
    title: les.title.value,
    description: les.description.value,
    duration: les.duration.value,
    video: les.video?.reference,
  };
}

function parseSection(section) {
  const sec = section.node;
  const less = sec.lessons?.references.edges || [];
  return {
    title: sec.title.value,
    description: sec.description,
    lessons: less ? less.map(parseLesson) : [],
  };
}

function parseMetaobject(metaobject) {
  console.log(JSON.stringify(metaobject, null, 2));

  const secs = metaobject.sections.references?.edges.map(parseSection) || [];

  return {
    sections: secs,
    title: metaobject.title.value,
    description: metaobject.description.value,
  };
}

export function Curriculum({course}) {
  const curriculumReference = course.curriculum?.reference;

  if (!curriculumReference) {
    return null;
  }

  const curriculum = parseMetaobject(curriculumReference);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Course Curriculum</h2>
      {curriculum.sections?.map((section, index) => (
        <div key={index} className="mb-4">
          <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
          <ul className="list-disc pl-5">
            {section.lessons.map((lesson, lessonIndex) => (
              <li key={lessonIndex} className="mb-1">
                <Player
                  style={{padding: 0}}
                  src={changeUrl(lesson.video.sources[0].url)}
                >
                  <source
                    src={changeUrl(lesson.video.sources[0].url)}
                    type="video/mp4"
                  />
                </Player>
                {lesson.title} ({lesson.duration} mins)
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
