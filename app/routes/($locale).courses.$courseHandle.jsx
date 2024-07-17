import {json, redirect} from '@shopify/remix-oxygen';
import {useLoaderData, useActionData, Form} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {VideoPlayer} from '~/components/VideoPlayer';
import {Curriculum} from '~/components/Curriculum';

export const loader = async ({params, context, request}) => {
  const {courseHandle} = params;
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

  console.log(JSON.stringify(course, null, 2));

  return json({
    course,
    hasAccess,
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

  console.log(course);
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

export default function CourseRoute() {
  const {course, hasAccess} = useLoaderData();
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
        <div className="grid gap-8 md:col-span-2">
          <div className="grid gap-4">
            <h1 className="text-4xl font-bold leading-tight">{course.title}</h1>
          </div>

          <div>
            <Image
              data={course.featuredImage}
              sizes="(min-width: 64em) 60vw, (min-width: 48em) 50vw, 90vw"
            />
          </div>

          <div dangerouslySetInnerHTML={{__html: course.descriptionHtml}} />

          <Curriculum course={course} />
        </div>

        <div className="sticky md:mt-8 top-24 grid gap-6">
          <VideoPlayer
            light={true}
            config={{
              youtube: {
                playerVars: {showinfo: 1},
              },
            }}
            videoUrl={'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
          />
          {typeof course.preview_video.reference.sources[0].url}
        </div>
      </div>
    </div>
  );
}

const COURSE_QUERY = `#graphql
  query CourseDetails($country: CountryCode, $language: LanguageCode, $handle: String!)
  @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      descriptionHtml
      featuredImage {
        id
        url
        altText
        width
        height
      }
      course_password:
      metafield(
        namespace: "courses", 
        key: "course_password"
      ) {
        value
        type
      }
      preview_video: metafield(
        namespace: "courses", 
        key: "preview_video"
      ) {
        value
        reference {
          ... on Video {
            alt
            previewImage {
                altText
                url
            }
            sources {
              mimeType
              url
            }
          }
        }
      }
      curriculum: metafield(
        namespace: "courses", 
        key: "curriculum"
      ) {
        value
        reference {
            ... on Metaobject {
                fields {
                    key
                    value
                }
            }
        }
      }
    
    }
  }
`;

`
title
description
sections {
  title
  description
  lessons {
    title
    description
    duration

  }
}
`;
