import React from 'react';
import {Link} from '@shopify/hydrogen';

export function SectionContent({course, sectionHandle}) {
  const section = course.curriculum.reference.sections.references.edges.find(
    (edge) =>
      edge.node.title.value.toLowerCase().replace(/\s+/g, '-') ===
      sectionHandle,
  )?.node;

  console.log(section);

  const lessons =
    section.lessons && section.lessons.references
      ? section.lessons.references.edges
      : [];

  if (!section) return <div>Section not found</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{section.title.value}</h2>
      <p>{section.description.value}</p>
      <ul className="mt-4">
        {lessons.map(({node: lesson}) => (
          <li key={lesson.title.value} className="mb-2">
            <Link
              to={`/courses/${
                course.handle
              }/${sectionHandle}/${lesson.title.value
                .toLowerCase()
                .replace(/\s+/g, '-')}`}
            >
              {lesson.title.value} ({lesson.duration.value} mins)
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
