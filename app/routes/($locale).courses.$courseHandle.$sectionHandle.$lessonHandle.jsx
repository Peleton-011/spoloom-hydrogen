import {json, redirect} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {Player} from 'video-react';
import {Curriculum} from '~/components/Curriculum';
import COURSE_QUERY from '~/custom-utils/COURSE_QUERY';
import {parseMetaobject} from '~/custom-utils/parseCourse';

export const loader = async ({params, context, request}) => {
  const {courseHandle, sectionHandle, lessonHandle} = params;
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

  const currentLesson = currentSection.lessons.find(
    (lesson) =>
      lesson.title.toLowerCase().replace(/\s+/g, '-') === lessonHandle,
  );

  if (!currentLesson) {
    throw new Response(null, {status: 404});
  }

  return json({
    course,
    currentSection,
    currentLesson,
    curriculum,
  });
};

export default function CourseLessonRoute() {
  const {course, currentSection, currentLesson, curriculum} = useLoaderData();

  return (
    <div className="grid gap-8 px-6 md:px-8 lg:px-12">
      <h1 className="text-4xl font-bold leading-tight">{course.title}</h1>
      <h2 className="text-2xl font-semibold">{currentSection.title}</h2>
      <h3 className="text-xl font-semibold">{currentLesson.title}</h3>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Player
            style={{padding: 0}}
            src={changeUrl(currentLesson.video.sources[0].url)}
          >
            <source
              src={changeUrl(currentLesson.video.sources[0].url)}
              type="video/mp4"
            />
          </Player>
          <div className="mt-4">
            <h4 className="font-semibold">Lesson Description:</h4>
            <p>{currentLesson.description}</p>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Course Curriculum</h3>
          <Curriculum
            course={course}
            currentSectionHandle={sectionHandle}
            currentLessonHandle={lessonHandle}
          />
        </div>
      </div>
    </div>
  );
}

// Include the COURSE_QUERY and helper functions (parseMetaobject, changeUrl, etc.) here
