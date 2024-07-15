import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {Link} from '~/components/Link';

export const loader = async ({context: {storefront}}) => {
  const {customer} = await storefront.query(CUSTOMER_QUERY);

  return json({
    customer,
  });
};

export default function AccountDashboard() {
  const {customer} = useLoaderData();

  return (
    <div className="account-dashboard">
      <h1 className="text-2xl font-bold mb-4">My Learning Dashboard</h1>
      <div className="grid gap-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">My Courses</h2>
          {customer.orders.edges.map(({node: order}) => (
            <div key={order.id} className="border p-4 rounded mb-4">
              {order.lineItems.edges.map(({node: item}) => (
                <Link key={item.id} to={`/courses/${item.variant.product.handle}`}>
                  {item.variant.product.title}
                </Link>
              ))}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

const CUSTOMER_QUERY = `#graphql
  query CustomerDetails($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    customer {
      id
      firstName
      lastName
      email
      orders(first: 10) {
        edges {
          node {
            id
            lineItems(first: 5) {
              edges {
                node {
                  id
                  variant {
                    id
                    product {
                      id
                      handle
                      title
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;