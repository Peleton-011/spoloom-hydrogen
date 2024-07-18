import React from 'react';
import {Player} from 'video-react';
import {RichTextDisplay} from './RichTextDisplay';
import {Link} from '~/components/Link';
import {parseMetaobject} from '~/custom-utils/parseCourse';

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
      <h2 className="text-2xl font-bold mb-4">Course Curriculum</h2>
      {curriculumReference.sections.references.edges.map(({node: section}) => (
        <div key={section.title.value} className="mb-4">
          <h3
            className={`text-xl font-semibold mb-2 ${
              section.title.value.toLowerCase().replace(/\s+/g, '-') ===
              currentSectionHandle
                ? 'text-blue-500'
                : ''
            }`}
          >
            <Link
              to={`/courses/${course.handle}/${section.title.value
                .toLowerCase()
                .replace(/\s+/g, '-')}`}
            >
              {section.title.value}
            </Link>
          </h3>
          <ul className="list-disc pl-5">
            {section.lessons?.references?.edges?.map(({node: lesson}) => (
              <li
                key={lesson.title.value}
                className={`mb-1 ${
                  lesson.title.value.toLowerCase().replace(/\s+/g, '-') ===
                  currentLessonHandle
                    ? 'font-bold'
                    : ''
                }`}
              >
                <Link
                  to={`/courses/${course.handle}/${section.title.value
                    .toLowerCase()
                    .replace(/\s+/g, '-')}/${lesson.title.value
                    .toLowerCase()
                    .replace(/\s+/g, '-')}`}
                >
                  {lesson.title.value} ({lesson.duration.value} mins)
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
