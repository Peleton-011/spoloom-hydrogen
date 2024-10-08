import React from 'react';
import {Player} from 'video-react';
import {RichTextDisplay} from './RichTextDisplay';
import {Link} from '~/components/Link';
import {parseMetaobject} from '~/custom-utils/parseCourse';
import generateSlug from '~/custom-utils/generateSlug';

export function Curriculum({
  course,
  currentSectionHandle,
  currentLessonHandle,
}) {
  const curriculumReference = course.curriculum?.reference;
  if (!curriculumReference) {
    return null;
  }
  const curriculum = parseMetaobject(curriculumReference);

  return (
    <div className="mt-8">
      <Link to={`/courses/${course.handle}`}>
        <h2 className="text-2xl font-bold mb-4">Course Curriculum</h2>
      </Link>
      {curriculumReference.sections.references.edges.map(({node: section}) => (
        <div key={section.title.value} className="mb-4">
          <h3
            className={`text-xl font-semibold mb-2 ${
              generateSlug(section.title.value) === currentSectionHandle
                ? 'text-blue-500'
                : ''
            }`}
          >
            <Link
              to={`/courses/${course.handle}/${generateSlug(
                section.title.value,
              )}`}
            >
              {section.title.value}
            </Link>
          </h3>
          <ul className="list-disc pl-5">
            {section.lessons?.references?.edges?.map(({node: lesson}) => (
              <li
                key={lesson.title.value}
                className={`mb-1 ${
                  generateSlug(lesson.title.value) === currentLessonHandle
                    ? 'font-bold'
                    : ''
                }`}
              >
                <Link
                  to={`/courses/${course.handle}/${generateSlug(
                    section.title.value,
                  )}/${generateSlug(lesson.title.value)}`}
                >
                  {lesson.title.value} ({Math.round(lesson.duration.value / 60)}{' '}
                  mins)
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
