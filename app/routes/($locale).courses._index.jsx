import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {
  Image,
  Pagination,
  getPaginationVariables,
  getSeoMeta,
} from '@shopify/hydrogen';

import {Grid} from '~/components/Grid';
import {Heading, PageHeader, Section} from '~/components/Text';
import {Link} from '~/components/Link';
import {Button} from '~/components/Button';
import {getImageLoadingPriority} from '~/lib/const';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';

const PAGINATION_SIZE = 4;

export const headers = routeHeaders;

export const loader = async ({request, context}) => {
  const storefront = context.storefront;

  const variables = getPaginationVariables(request, {pageBy: PAGINATION_SIZE});
  const {collection} = await storefront.query(COURSES_QUERY, {
    variables: {
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  const seo = seoPayload.collection({
    collection,
    url: request.url,
  });

  return json({collection, seo});
};

export const meta = ({matches}) => {
  return getSeoMeta(...matches.map((match) => match.data.seo));
};

export default function Courses() {
  const {collection} = useLoaderData();

//   console.log('collection');
//   console.log(JSON.stringify(collection, null, 2));

  return (
    <>
      <PageHeader heading="Courses" />
      <Section>
        <Pagination connection={collection.products}>
          {({nodes, isLoading, PreviousLink, NextLink}) => (
            <>
              <div className="flex items-center justify-center mb-6">
                <Button as={PreviousLink} variant="secondary" width="full">
                  {isLoading ? 'Loading...' : 'Previous courses'}
                </Button>
              </div>
              <Grid items={nodes.length === 3 ? 3 : 2} data-test="courses-grid">
                {nodes.map((product, i) => (
                  <CourseCard
                    course={product}
                    key={product.id}
                    loading={getImageLoadingPriority(i, 2)}
                  />
                ))}
              </Grid>
              <div className="flex items-center justify-center mt-6">
                <Button as={NextLink} variant="secondary" width="full">
                  {isLoading ? 'Loading...' : 'Next courses'}
                </Button>
              </div>
            </>
          )}
        </Pagination>
      </Section>
    </>
  );
}

function CourseCard({course, loading}) {
//   console.log('course');
//   console.log(JSON.stringify(course, null, 2));
  return (
    <Link
      prefetch="viewport"
      to={`/courses/${course.handle}`}
      className="grid gap-4"
    >
      <div className="card-image bg-primary/5 aspect-[3/2]">
        {course?.featuredImage && (
          <Image
            data={course.featuredImage}
            aspectRatio="6/4"
            sizes="(max-width: 32em) 100vw, 45vw"
            loading={loading}
          />
        )}
      </div>
      <Heading as="h3" size="copy">
        {course.title}
      </Heading>
      <p>{course.description}</p>
    </Link>
  );
}

const COURSES_QUERY = `#graphql
  query CoursesCollection(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: "courses") {
      id
      title
      description
      handle
      products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
        nodes {
          id
          title
          description
          handle
          featuredImage {
            id
            url
            width
            height
            altText
          }
          metafields(
            identifiers: [
              {namespace: "custom", key: "video_count"},
              {namespace: "custom", key: "duration"}
            ]
          ) {
            key
            value
          }
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
      }
    }
  }
`;
