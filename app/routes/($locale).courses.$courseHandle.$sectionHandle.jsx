import {json} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {Curriculum} from '~/components/Curriculum';
import COURSE_QUERY from '~/custom-utils/COURSE_QUERY';
import {RichTextDisplay} from '~/components/RichTextDisplay';
import {parseMetaobject} from '~/custom-utils/parseCourse';
import generateSlug from '~/custom-utils/generateSlug';

export const loader = async ({params, context, request}) => {
  const {courseHandle, sectionHandle} = params;
  const {product: course} = await context.storefront.query(COURSE_QUERY, {
    variables: {
      handle: courseHandle,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  if (!course?.id) {
    throw new Response(null, {status: 404});
  }

  const session = context.session;
  const hasAccess = session.hasCourseAccess(course.id);

  if (!hasAccess) {
    return redirect(`/courses/${courseHandle}`);
  }

  const curriculum = parseMetaobject(course.curriculum?.reference);
  const currentSection = curriculum.sections.find(
    (section) =>
      section.title.toLowerCase().replace(/\s+/g, '-') === sectionHandle,
  );

  if (!currentSection) {
    throw new Response(null, {status: 404});
  }

  return json({
    course: {...course, courseHandle},
    section: {...currentSection, sectionHandle},
    curriculum,
  });
};

export default function CourseSection() {
  const {course, currentSection, curriculum} = useLoaderData();

  return (
    <div className="grid gap-8 px-6 md:px-8 lg:px-12">
      <h1 className="text-4xl font-bold leading-tight">{course.title}</h1>
      <h2 className="text-2xl font-semibold">{currentSection.title}</h2>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <RichTextDisplay content={currentSection.description} />
          <ul className="mt-4">
            {currentSection.lessons.map((lesson, index) => (
              <li key={index} className="mb-2">
                <Link
                  to={`/courses/${
                    course.handle
                  }/${sectionHandle}/${generateSlug(lesson.title)}`}
                >
                  {lesson.title} ({lesson.duration} mins)
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Course Curriculum</h3>
          <Curriculum course={course} currentSectionHandle={sectionHandle} />
        </div>
      </div>
    </div>
  );
}

// Include the COURSE_QUERY and helper functions (parseMetaobject, etc.) here
