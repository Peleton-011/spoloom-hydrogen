import {json, redirect} from '@shopify/remix-oxygen';
import {useLoaderData, useActionData, Form} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';

import {Curriculum} from '~/components/Curriculum';
import {SectionContent} from '~/components/SectionContent';
import {LessonContent} from '~/components/LessonContent';
import {Link} from '~/components/Link';

import COURSE_QUERY from '~/custom-utils/COURSE_QUERY';

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

  let currentSectionHandle = sectionHandle || '';
  let currentLessonHandle = lessonHandle || '';

  return json({
    course: {...course, handle: courseHandle},
    hasAccess,
    currentSectionHandle,
    currentLessonHandle,
  });
};

export const action = async ({request, params, context}) => {
  const {courseHandle} = params;
  const formData = await request.formData();
  const password = formData.get('password');

  const {product: course} = await context.storefront.query(COURSE_QUERY, {
    variables: {
      handle: courseHandle,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  //   console.log(course);
  const coursePassword = course.course_password?.value || 'ass';

  const session = context.session;

  if (password === coursePassword) {
    // Password is correct, grant access
    session.grantCourseAccess(course.id);

    return redirect(`/courses/${courseHandle}`, {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    });
  } else {
    // Password is incorrect
    return json({error: 'Incorrect password'}, {status: 401});
  }
};

function getContent(course, currentSectionHandle, currentLessonHandle) {
  return (
    <div className="grid gap-8 md:col-span-2">
      <div className="grid gap-4">
        <Link to={`/courses/${course.handle}`}>
          <h1 className="text-4xl font-bold leading-tight">{course.title}</h1>
        </Link>
      </div>

      {currentSectionHandle && currentLessonHandle ? (
        <LessonContent
          course={course}
          sectionHandle={currentSectionHandle}
          lessonHandle={currentLessonHandle}
        />
      ) : currentSectionHandle ? (
        <SectionContent course={course} sectionHandle={currentSectionHandle} />
      ) : (
        <>
          <div>
            <Image
              data={course.featuredImage}
              sizes="(min-width: 64em) 60vw, (min-width: 48em) 50vw, 90vw"
            />
          </div>

          <div dangerouslySetInnerHTML={{__html: course.descriptionHtml}} />
        </>
      )}
    </div>
  );
}

export default function CourseRoute() {
  const {course, hasAccess, currentSectionHandle, currentLessonHandle} =
    useLoaderData();
  const actionData = useActionData();

  if (!hasAccess) {
    return (
      <div className="grid gap-8 px-6 md:px-8 lg:px-12">
        <h1 className="text-4xl font-bold leading-tight">{course.title}</h1>
        <Form method="post">
          <label htmlFor="password" className="block mb-2">
            Enter course password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="border p-2 mb-2 block"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Access Course
          </button>
          {actionData?.error && (
            <p className="text-red-500 mt-2">{actionData.error}</p>
          )}
        </Form>
      </div>
    );
  }

  return (
    <div className="grid gap-8 px-6 md:px-8 lg:px-12">
      <div className="grid items-start gap-6 lg:gap-20 md:grid-cols-2 lg:grid-cols-3">
        <div className="sticky md:mt-8 top-24 grid gap-6">
          {getContent(course, currentSectionHandle, currentLessonHandle)}
          <Curriculum
            course={course}
            currentSectionHandle={currentSectionHandle}
            currentLessonHandle={currentLessonHandle}
          />
        </div>
      </div>
    </div>
  );
}
