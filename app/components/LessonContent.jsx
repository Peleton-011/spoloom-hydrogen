import React from 'react';
import {Player} from 'video-react';
import changeUrl from '~/custom-utils/changeUrl';
import generateSlug from '~/custom-utils/generateSlug';

export function LessonContent({course, sectionHandle, lessonHandle}) {
  const section = course.curriculum.reference.sections.references.edges.find(
    (edge) => generateSlug(edge.node.title.value) === sectionHandle,
  )?.node;
  const lesson = section?.lessons.references.edges.find(
    (edge) => generateSlug(edge.node.title.value) === lessonHandle,
  )?.node;

  if (!lesson) return <div>Lesson not found</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{lesson.title.value}</h2>
      <Player src={changeUrl(lesson.video.reference.sources[0].url)}>
        <source
          src={changeUrl(lesson.video.reference.sources[0].url)}
          type="video/mp4"
        />
      </Player>
      <p className="mt-4">{lesson.description.value}</p>
    </div>
  );
}
