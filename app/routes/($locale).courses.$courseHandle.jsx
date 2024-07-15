import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {Image, Money, ShopPayButton} from '@shopify/hydrogen';
import {VideoPlayer} from '~/components/ProductMedia';
import {CourseProgress} from '~/components/CourseProgress';
import {Curriculum} from '~/components/Curriculum';

export const loader = async ({params, context: {storefront}}) => {
  const {courseHandle} = params;
  const {product: course} = await storefront.query(COURSE_QUERY, {
    variables: {
      handle: courseHandle,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  if (!course?.id) {
    throw new Response(null, {status: 404});
  }

  return json({
    course,
  });
};

export default function CourseRoute() {
  const {course} = useLoaderData();

  return (
    <div className="grid gap-8 px-6 md:px-8 lg:px-12">
      <div className="grid items-start gap-6 lg:gap-20 md:grid-cols-2 lg:grid-cols-3">
        <div className="grid gap-8 md:col-span-2">
          <div className="grid gap-4">
            <h1 className="text-4xl font-bold leading-tight">{course.title}</h1>
            <div className="flex items-center gap-4">
              <Money data={course.priceRange.minVariantPrice} />
              <span className="text-sm text-gray-500">
                {course.metafields.find((m) => m.key === 'duration')?.value}{' '}
                total hours
              </span>
            </div>
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
            videoUrl={
              course.metafields.find((m) => m.key === 'preview_video')?.value
            }
          />
          <CourseProgress course={course} />
          <ShopPayButton variantId={course.variants.nodes[0].id} />
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
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 1) {
        nodes {
          id
        }
      }
      metafields(
        identifiers: [
          {namespace: "custom", key: "duration"},
          {namespace: "custom", key: "preview_video"},
          {namespace: "custom", key: "curriculum"}
        ]
      ) {
        key
        value
      }
    }
  }
`;
