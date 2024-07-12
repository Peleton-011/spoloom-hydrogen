# Hydrogen upgrade guide: 0.0.0 to 2024.7.1

----

## Breaking changes

### The Codegen feature is now considered stable and related dependencies have been updated [#1108](https://github.com/Shopify/hydrogen/pull/1108)

#### Step: 1. Update the `dev` script [#1108](https://github.com/Shopify/hydrogen/pull/1108)

[#1108](https://github.com/Shopify/hydrogen/pull/1108)
// package.json

```diff
"scripts": {
     //......
-     "dev": "shopify hydrogen dev --codegen-unstable",
+    "dev": "shopify hydrogen dev --codegen",
}
```

#### Step: 2. Update the `codegen` script [#1108](https://github.com/Shopify/hydrogen/pull/1108)

[#1108](https://github.com/Shopify/hydrogen/pull/1108)
// package.json

```diff
"scripts": {
     //......
-    "codegen": "shopify hydrogen codegen-unstable",
+   "codegen": "shopify hydrogen codegen"
}
```

### The Storefront API types included are now generated using @graphql-codegen/typescript@4 [#1108](https://github.com/Shopify/hydrogen/pull/1108)

#### This results in a breaking change if you were importing `Scalars` directly from `@shopify/hydrogen-react` or `@shopify/hydrogen`
[docs](https://github.com/dotansimha/graphql-code-generator/blob/master/packages/plugins/typescript/typescript/CHANGELOG.md#400)
[#1108](https://github.com/Shopify/hydrogen/pull/1108)
// all instances of `Scalars` imports

```diff
import type {Scalars} from '@shopify/hydrogen/storefront-api-types';

type Props = {
-  id: Scalars['ID']; // This was a string
+  id: Scalars['ID']['input']; // Need to access 'input' or 'output' to get the string
 };
```

### Support Hot Module Replacement (HMR) and Hot Data Revalidation (HDR) [#1187](https://github.com/Shopify/hydrogen/pull/1187)

#### Step: 1. Enable the v2 dev server in remix.config.js [#1187](https://github.com/Shopify/hydrogen/pull/1187)

[#1187](https://github.com/Shopify/hydrogen/pull/1187)
```diff
future: {
+ v2_dev: true,
  v2_meta: true,
  v2_headers: true,
  // ...
}
```

#### Step: 2. Add Remix `<LiveReload />` component if you don't have it to your `root.jsx` or `root.tsx` file [#1187](https://github.com/Shopify/hydrogen/pull/1187)

[#1187](https://github.com/Shopify/hydrogen/pull/1187)
```diff
import {
  Outlet,
  Scripts,
+ LiveReload,
  ScrollRestoration,
} from '@remix-run/react';

// ...

export default function App() {
  // ...
  return (
    <html>
      <head>
       {/* ...  */}
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
+       <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  // ...
  return (
    <html>
      <head>
        {/* ... */}
      </head>
      <body>
        Error!
        <Scripts />
+       <LiveReload />
      </body>
    </html>
  );
}
```

----

## Features

### Optimistic variant [#2113](https://github.com/Shopify/hydrogen/pull/2113)

#### Step: 1. Example of product display page update [#2113](https://github.com/Shopify/hydrogen/pull/2113)

[#2113](https://github.com/Shopify/hydrogen/pull/2113)
```.tsx
function Product() {
  const {product, variants} = useLoaderData<typeof loader>();

  // The selectedVariant optimistically changes during page
  // transitions with one of the preloaded product variants
  const selectedVariant = useOptimisticVariant(
    product.selectedVariant,
    variants,
  );

  return <ProductMain selectedVariant={selectedVariant} />;
}
```

#### Step: 2. Optional <VariantSelector /> update [#2113](https://github.com/Shopify/hydrogen/pull/2113)

[#2113](https://github.com/Shopify/hydrogen/pull/2113)
```diff
<VariantSelector
  handle={product.handle}
  options={product.options}
+  waitForNavigation
>
  ...
</VariantSelector>
```

### [Breaking Change] New session commit pattern [#2137](https://github.com/Shopify/hydrogen/pull/2137)

#### Step: 1. Add isPending implementation in session [#2137](https://github.com/Shopify/hydrogen/pull/2137)

[#2137](https://github.com/Shopify/hydrogen/pull/2137)
```diff
// in app/lib/session.ts
export class AppSession implements HydrogenSession {
+  public isPending = false;

  get unset() {
+    this.isPending = true;
    return this.#session.unset;
  }

  get set() {
+    this.isPending = true;
    return this.#session.set;
  }

  commit() {
+    this.isPending = false;
    return this.#sessionStorage.commitSession(this.#session);
  }
}
```

#### Step: 2. update response header if `session.isPending` is true [#2137](https://github.com/Shopify/hydrogen/pull/2137)

[#2137](https://github.com/Shopify/hydrogen/pull/2137)
```diff
// in server.ts
export default {
  async fetch(request: Request): Promise<Response> {
    try {
      const response = await handleRequest(request);

+      if (session.isPending) {
+        response.headers.set('Set-Cookie', await session.commit());
+      }

      return response;
    } catch (error) {
      ...
    }
  },
};
```

#### Step: 3. remove setting cookie with `session.commit()` in routes [#2137](https://github.com/Shopify/hydrogen/pull/2137)

[#2137](https://github.com/Shopify/hydrogen/pull/2137)
```diff
// in route files
export async function loader({context}: LoaderFunctionArgs) {
  return json({},
-    {
-      headers: {
-        'Set-Cookie': await context.session.commit(),
-      },
    },
  );
}
```

### Add `@shopify/mini-oxygen` as a dev dependency for local development [#1891](https://github.com/Shopify/hydrogen/pull/1891)

#### package.json
[#1891](https://github.com/Shopify/hydrogen/pull/1891)
```diff
 "devDependencies": {
    "@remix-run/dev": "^2.8.0",
    "@remix-run/eslint-config": "^2.8.0",
+   "@shopify/mini-oxygen": "^3.0.0",
    "@shopify/oxygen-workers-types": "^4.0.0",
    ...
  }
```

### Support scaffolding projects from external repositories using the `--template` flag [#1867](https://github.com/Shopify/hydrogen/pull/1867)

#### The following examples are equivalent
[#1867](https://github.com/Shopify/hydrogen/pull/1867)
```bash
npm create @shopify/hydrogen -- --template shopify/hydrogen-demo-store
npm create @shopify/hydrogen -- --template github.com/shopify/hydrogen-demo-store
npm create @shopify/hydrogen -- --template https://github.com/shopify/hydrogen-demo-store
```

### Deprecate the `<Seo />` component in favor of directly using Remix meta route exports [#1875](https://github.com/Shopify/hydrogen/pull/1875)

#### Step: 1. Remove the `<Seo />` component from `root.jsx` [#1875](https://github.com/Shopify/hydrogen/pull/1875)

[#1875](https://github.com/Shopify/hydrogen/pull/1875)
```diff
export default function App() {
   const nonce = useNonce();
   const data = useLoaderData<typeof loader>();

   return (
     <html lang="en">
       <head>
         <meta charSet="utf-8" />
         <meta name="viewport" content="width=device-width,initial-scale=1" />
-        <Seo />
         <Meta />
         <Links />
       </head>
       <body>
         <Layout {...data}>
           <Outlet />
         </Layout>
         <ScrollRestoration nonce={nonce} />
         <Scripts nonce={nonce} />
         <LiveReload nonce={nonce} />
       </body>
     </html>
   );
 }
```

#### Step: 2. Add a Remix meta export to each route that returns an seo property from a loader or handle: [#1875](https://github.com/Shopify/hydrogen/pull/1875)

[#1875](https://github.com/Shopify/hydrogen/pull/1875)
```diff
+import {getSeoMeta} from '@shopify/hydrogen';

 export async function loader({context}) {
   const {shop} = await context.storefront.query(`
     query layout {
       shop {
         name
         description
       }
     }
   `);

   return {
     seo: {
       title: shop.title,
       description: shop.description,
     },
   };
 }

+export const meta = ({data}) => {
+   return getSeoMeta(data.seo);
+};
```

#### Step: 3. Merge root route meta data [#1875](https://github.com/Shopify/hydrogen/pull/1875)

[#1875](https://github.com/Shopify/hydrogen/pull/1875)
If your root route loader also returns an seo property, make sure to merge that data:

```js
export const meta = ({data, matches}) => {
  return getSeoMeta(
    matches[0].data.seo,
    // the current route seo data overrides the root route data
    data.seo,
  );
};
```
Or more simply:

```js
export const meta = ({data, matches}) => {
  return getSeoMeta(...matches.map((match) => match.data.seo));
};
```

#### Step: 4. Override meta [#1875](https://github.com/Shopify/hydrogen/pull/1875)

[#1875](https://github.com/Shopify/hydrogen/pull/1875)
Sometimes getSeoMeta might produce a property in a way you'd like to change. Map over the resulting array to change it. For example, Hydrogen removes query parameters from canonical URLs, add them back:

```js
export const meta = ({data, location}) => {
  return getSeoMeta(data.seo).map((meta) => {
    if (meta.rel === 'canonical') {
      return {
        ...meta,
        href: meta.href + location.search,
      };
    }

    return meta;
  });
};
```

### Codegen dependencies must be now listed explicitly in package.json [#1962](https://github.com/Shopify/hydrogen/pull/1962)

#### Update package.json
[#1962](https://github.com/Shopify/hydrogen/pull/1962)
```diff
{
  "devDependencies": {
+   "@graphql-codegen/cli": "5.0.2",
    "@remix-run/dev": "^2.8.0",
    "@remix-run/eslint-config": "^2.8.0",
+   "@shopify/hydrogen-codegen": "^0.3.0",
    "@shopify/mini-oxygen": "^2.2.5",
    "@shopify/oxygen-workers-types": "^4.0.0",
    ...
  }
}
```

### Update the GraphQL config in .graphqlrc.yml to use the more modern projects structure: [#1577](https://github.com/Shopify/hydrogen/pull/1577)

#### Step: 1. This allows you to add additional projects to the GraphQL config, such as third party CMS schemas. [#1577](https://github.com/Shopify/hydrogen/pull/1577)

[#1577](https://github.com/Shopify/hydrogen/pull/1577)
```diff
-schema: node_modules/@shopify/hydrogen/storefront.schema.json
+projects:
+ default:
+    schema: 'node_modules/@shopify/hydrogen/storefront.schema.json
```

#### Step: 2. Also, you can modify the document paths used for the Storefront API queries. This is useful if you have a large codebase and want to exclude certain files from being used for codegen or other GraphQL utilities: [#1577](https://github.com/Shopify/hydrogen/pull/1577)

[#1577](https://github.com/Shopify/hydrogen/pull/1577)
 ```yaml
    projects:
      default:
        schema: 'node_modules/@shopify/hydrogen/storefront.schema.json'
        documents:
          - '!*.d.ts'
          - '*.{ts,tsx,js,jsx}'
          - 'app/**/*.{ts,tsx,js,jsx}'
    ```

### Use new `variantBySelectedOptions` parameters introduced in Storefront API v2024-01 to fix redirection to the product's default variant when there are unknown query params in the URL. [#1642](https://github.com/Shopify/hydrogen/pull/1642)

#### Update the `product` query to include the `variantBySelectedOptions` parameters `ignoreUnknownOptions` and `caseInsensitiveMatch`
[#1642](https://github.com/Shopify/hydrogen/pull/1642)
```diff
-   selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
+   selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
```

### Better Hydrogen error handling [#1645](https://github.com/Shopify/hydrogen/pull/1645)

#### Changed the shape of the error objects returned by createCartHandler. Previously, mutations could return an errors array that contained a userErrors array. With this change, these arrays are no longer nested. The response can contain both an errors array and a userErrors array. errors contains GraphQL execution errors. userErrors contains errors caused by the cart mutation itself (such as adding a product that has zero inventory). storefront.isApiError is deprecated.
[#1645](https://github.com/Shopify/hydrogen/pull/1645)
```diff
- const data = await context.storefront.query(EXAMPLE_QUERY)
+ const {data, errors, userErrors} = await context.storefront.query(EXAMPLE_QUERY) 
```

```diff
- const cart = await context.cart.get()
+ const {cart, errors, userErrors} = await context.cart.get()
```

### Add deploy command to Hydrogen CLI [#1628](https://github.com/Shopify/hydrogen/pull/1628)

#### Use the new `h2 deploy` command to deploy your app
[#1628](https://github.com/Shopify/hydrogen/pull/1628)
```bash
npx shopify hydrogen deploy --help
```

### Add `--template` flag to enable scaffolding projects based on examples from the Hydrogen repo [#1608](https://github.com/Shopify/hydrogen/pull/1608)

#### Use the new `--template` flag to scaffold your app
[#1608](https://github.com/Shopify/hydrogen/pull/1608)
```bash
npm create @shopify/hydrogen@latest -- --template multipass
```

### Make the worker runtime the default environment for the local dev and preview. [#1625](https://github.com/Shopify/hydrogen/pull/1625)

#### To access the legacy Node.js runtime, pass the --legacy-runtime flag. The legacy runtime will be deprecated and removed in a future release.
[#1625](https://github.com/Shopify/hydrogen/pull/1625)
```diff
"scripts": {
-   "dev": "shopify hydrogen dev --codegen",
+   "dev": "shopify hydrogen dev --codegen --legacy-runtime",
-    "preview": "npm run build && shopify hydrogen preview",
+    "preview": "npm run build && shopify hydrogen preview --legacy-runtime",
}
```

### Make default HydrogenSession type extensible [#1590](https://github.com/Shopify/hydrogen/pull/1590)

#### New HydrogenSession type
[#1590](https://github.com/Shopify/hydrogen/pull/1590)
```diff
import {
+ type HydrogenSession,
} from '@shopify/hydrogen';

- class HydrogenSession {
+ class AppSession implements HydrogenSession {
    ...
}
```

### New `h2 upgrade` command [#1458](https://github.com/Shopify/hydrogen/pull/1458)

#### Step: 1. Try the upgrade command via [#1458](https://github.com/Shopify/hydrogen/pull/1458)

[docs](https://shopify.dev/docs/custom-storefronts/hydrogen/cli#upgrade)
[#1458](https://github.com/Shopify/hydrogen/pull/1458)
```bash
# from the base of the project run
h2 upgrade
```

#### Step: 2. Upgrade to a specific Hydrogen version with the --version flag [#1458](https://github.com/Shopify/hydrogen/pull/1458)

[docs](https://shopify.dev/docs/custom-storefronts/hydrogen/cli#upgrade)
[#1458](https://github.com/Shopify/hydrogen/pull/1458)
```bash
h2 upgrade --version 2023.10.3
```

### Enable debugger connections by passing `--debug` flag to the `h2 dev` command [#1480](https://github.com/Shopify/hydrogen/pull/1480)

#### Step: 1. Debugging on the default runtime (Node.js sandbox): [#1480](https://github.com/Shopify/hydrogen/pull/1480)

[#1480](https://github.com/Shopify/hydrogen/pull/1480)
```bash
h2 dev --debug
```

#### Step: 2. Debugging on the new worker runtime: [#1480](https://github.com/Shopify/hydrogen/pull/1480)

[#1480](https://github.com/Shopify/hydrogen/pull/1480)
```bash
h2 dev --debug --worker-unstable
```

### Added an optional prop to the `ShopPayButton` to enable order attribution support for either the Headless or Hydrogen sales channel. [#1447](https://github.com/Shopify/hydrogen/pull/1447)

#### Customize the order attribution via the `channel` prop
[#1447](https://github.com/Shopify/hydrogen/pull/1447)
```diff
<ShopPayButton
    variantIds={[variantId]}
    storeDomain={storeDomain}
+  channel="headless || hydrogen"
/>
```

### Storefront client the default caching strategy has been updated  [#1336](https://github.com/Shopify/hydrogen/pull/1336)

#### The new default caching strategy provides a max-age value of 1 second, and a stale-while-revalidate value of 1 day. If you would keep the old caching values, update your queries to use `CacheShort`
[#1336](https://github.com/Shopify/hydrogen/pull/1336)
// all instances of storefront.query

```diff
 const {product} = await storefront.query(
   `#graphql
     query Product($handle: String!) {
       product(handle: $handle) { id title }
     }
   `,
   {
     variables: {handle: params.productHandle},
+    /**
+     * Override the default caching strategy with the old caching values
+     */
+    cache: storefront.CacheShort(),
   },
 );
```

### Added `h2 debug cpu` command to profile CPU startup times (experimental) [#1352](https://github.com/Shopify/hydrogen/pull/1352)

#### Run `h2 debug cpu`
> This command builds + watches your app and generates a `startup.cpuprofile` file that you can open in DevTools or VSCode to see a flamegraph of CPU usage
[#1352](https://github.com/Shopify/hydrogen/pull/1352)
```bash
h2 debug cpu
```

### Added support for `withCache` request in debug-network tool [#1438](https://github.com/Shopify/hydrogen/pull/1438)

#### Calls to withCache can now be shown in the `/debug-network` tool when using the Worker runtime. For this to work, use the new `request` parameter in `createWithCache`
[#1438](https://github.com/Shopify/hydrogen/pull/1438)
// server.ts

```diff
export default {
  fetch(request, env, executionContext) {
    // ...
    const withCache = createWithCache({
      cache,
      waitUntil,
+     request,
    });
    // ...
  },
}
```

### Support custom attributes with `useLoadScript` [#1442](https://github.com/Shopify/hydrogen/pull/1442)

#### Step: 1. Pass `attributes` to any script [#1442](https://github.com/Shopify/hydrogen/pull/1442)

[#1442](https://github.com/Shopify/hydrogen/pull/1442)
// any instance of useLoadScript

```diff
+ const attributes = {
+    'data-test': 'test',
+    test: 'test',
+  }

- const scriptStatus = useLoadScript('test.js' )
const scriptStatus = useLoadScript('test.js', {  attributes } )
```

#### Step: 2. Would append a DOM element [#1442](https://github.com/Shopify/hydrogen/pull/1442)

[#1442](https://github.com/Shopify/hydrogen/pull/1442)
```html
<script src="test.js" data-test="test" test="test" />
```

### Add server-side network requests debugger (unstable) [#1284](https://github.com/Shopify/hydrogen/pull/1284)

#### Step: 1. Update server.ts so that it also passes in waitUntil and env [#1284](https://github.com/Shopify/hydrogen/pull/1284)

[#1284](https://github.com/Shopify/hydrogen/pull/1284)
```diff
const handleRequest = createRequestHandler({
    build: remixBuild,
    mode: process.env.NODE_ENV,
+    getLoadContext: () => ({session, storefront, env, waitUntil}),
});
```

#### Step: 2. If using typescript, also update `remix.env.d.ts` [#1284](https://github.com/Shopify/hydrogen/pull/1284)

[#1284](https://github.com/Shopify/hydrogen/pull/1284)
```diff
  declare module '@shopify/remix-oxygen' {
    export interface AppLoadContext {
+     env: Env;
      cart: HydrogenCart;
      storefront: Storefront;
      session: HydrogenSession;
+      waitUntil: ExecutionContext['waitUntil'];
    }
  }
```

### Add TypeScript v5 compatibility [#1240](https://github.com/Shopify/hydrogen/pull/1240)

#### Update typescript
> If you have typescript as a dev dependency in your app, it is recommended to change its version as follows:
[#1240](https://github.com/Shopify/hydrogen/pull/1240)
```diff
  "devDependencies": {
    ...
-   "typescript": "^4.9.5",
+   "typescript": "^5.2.2",
  }
}
```

### Stabilize Pagination and getPaginationVariables [#1129](https://github.com/Shopify/hydrogen/pull/1129)

#### Step: 1. Rename getPaginationVariables_unstable to getPaginationVariables [#1129](https://github.com/Shopify/hydrogen/pull/1129)

[#1129](https://github.com/Shopify/hydrogen/pull/1129)
```diff
- import {getPaginationVariables__unstable} from '@shopify/hydrogen';
+ import {getPaginationVariables} from '@shopify/hydrogen';
```

#### Step: 2. Rename Pagination_unstable to Pagination [#1129](https://github.com/Shopify/hydrogen/pull/1129)

[#1129](https://github.com/Shopify/hydrogen/pull/1129)
```diff
- import {Pagiatinon__unstable} from '@shopify/hydrogen';
+ import {Pagiatinon} from '@shopify/hydrogen';
```

### Upgrade Remix to 1.17.1 [#null](null)

#### When updating your app, remember to also update your Remix dependencies to 1.17.1 in your package.json file:
[docs](https://github.com/remix-run/remix/releases/tag/remix%401.17.1)
```diff
-"@remix-run/react": "1.15.0",
+"@remix-run/react": "1.17.1",

-"@remix-run/dev": "1.15.0",
-"@remix-run/eslint-config": "1.15.0",
+"@remix-run/dev": "1.17.1",
+"@remix-run/eslint-config": "1.17.1",
```

### Add a /admin route that redirects to the Shopify admin [#989](https://github.com/Shopify/hydrogen/pull/989)

#### This redirect can be disabled by passing noAdminRedirect: true to storefrontRedirect
[#989](https://github.com/Shopify/hydrogen/pull/989)
```diff
storefrontRedirect({
  redirect,
  response,
  storefront,
+ noAdminRedirect: true,
});
```

### Added parseGid() utility [#845](https://github.com/Shopify/hydrogen/pull/845)

#### Example usage
[#845](https://github.com/Shopify/hydrogen/pull/845)
```ts
import {parseGid} from '@shopify/hydrogen-react';

const {id, resource} = parseGid('gid://shopify/Order/123');

console.log(id); // 123
console.log(resource); // Order
```

### Added a new shortcut command that creates a global h2 alias for the Hydrogen CLI [#679](https://github.com/Shopify/hydrogen/pull/679)

#### Step: 1. Create the h2 alias [#679](https://github.com/Shopify/hydrogen/pull/679)

[#679](https://github.com/Shopify/hydrogen/pull/679)
```bash
npx shopify hydrogen shortcut
```

#### Step: 2. After that, you can run commands using the new alias: [#679](https://github.com/Shopify/hydrogen/pull/679)

[#679](https://github.com/Shopify/hydrogen/pull/679)
```bash
h2 generate route home
h2 g r home # Same as the above
h2 check routes
```

### Add an experimental createWithCache_unstable [#600](https://github.com/Shopify/hydrogen/pull/600)

#### To setup the utility, update your server.ts
[#600](https://github.com/Shopify/hydrogen/pull/600)
```ts
import {
  createStorefrontClient,
  createWithCache_unstable,
  CacheLong,
} from '@shopify/hydrogen';

// ...

  const cache = await caches.open('hydrogen');
  const withCache = createWithCache_unstable({cache, waitUntil});

  // Create custom utilities to query third-party APIs:
  const fetchMyCMS = (query) => {
    // Prefix the cache key and make it unique based on arguments.
    return withCache(['my-cms', query], CacheLong(), () => {
      const cmsData = await (await fetch('my-cms.com/api', {
        method: 'POST',
        body: query
      })).json();

      const nextPage = (await fetch('my-cms.com/api', {
        method: 'POST',
        body: cmsData1.nextPageQuery,
      })).json();

      return {...cmsData, nextPage}
    });
  };

  const handleRequest = createRequestHandler({
    build: remixBuild,
    mode: process.env.NODE_ENV,
    getLoadContext: () => ({
      session,
      waitUntil,
      storefront,
      env,
      fetchMyCMS,
    }),
  });
```

### Added robots option to SEO config that allows users granular control over the robots meta tag. [#572](https://github.com/Shopify/hydrogen/pull/572)

#### Example usage
[#572](https://github.com/Shopify/hydrogen/pull/572)
```ts
export handle = {
  seo: {
    robots: {
      noIndex: false,
      noFollow: false,
    }
  }
}
```

----

----

## Fixes

### Remix upgrade and use Layout component in root file. This new pattern will eliminate the use of useLoaderData in ErrorBoundary and clean up the root file of duplicate code. [#2290](https://github.com/Shopify/hydrogen/pull/2290)

#### Step: 1. Refactor App export to become Layout export [#2290](https://github.com/Shopify/hydrogen/pull/2290)

[#2290](https://github.com/Shopify/hydrogen/pull/2290)
```diff
-export default function App() {
+export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();
-  const data = useLoaderData<typeof loader>();
+  const data = useRouteLoaderData<typeof loader>('root');

  return (
    <html>
    ...
      <body>
-        <Layout {...data}>
-          <Outlet />
-        </Layout>
+        {data? (
+          <PageLayout {...data}>{children}</PageLayout>
+         ) : (
+          children
+        )}
      </body>
    </html>
  );
}
```

#### Step: 2. Simplify default App export [#2290](https://github.com/Shopify/hydrogen/pull/2290)

[#2290](https://github.com/Shopify/hydrogen/pull/2290)
```diff
+export default function App() {
+  return <Outlet />;
+}
```

#### Step: 3. Remove wrapping layout from ErrorBoundary [#2290](https://github.com/Shopify/hydrogen/pull/2290)

[#2290](https://github.com/Shopify/hydrogen/pull/2290)
```diff
export function ErrorBoundary() {
- const rootData = useLoaderData<typeof loader>();

  return (
-    <html>
-    ...
-      <body>
-        <Layout {...rootData}>
-          <div className="route-error">
-            <h1>Error</h1>
-            ...
-          </div>
-        </Layout>
-      </body>
-    </html>
+    <div className="route-error">
+      <h1>Error</h1>
+      ...
+    </div>
  );
}
```

### [Breaking Change] `<VariantSelector />` improved handling of options [#1198](https://github.com/Shopify/hydrogen/pull/1198)

#### Update options prop when using <VariantSelector />
[#1198](https://github.com/Shopify/hydrogen/pull/1198)
```diff
 <VariantSelector
   handle={product.handle}
+  options={product.options.filter((option) => option.values.length > 1)}
-  options={product.options}
   variants={variants}>
 </VariantSelector>
```

### Fix a bug where cart could be null, even though a new cart was created by adding a line item. [#1865](https://github.com/Shopify/hydrogen/pull/1865)

#### Example
[#1865](https://github.com/Shopify/hydrogen/pull/1865)
```ts
import {
  createCartHandler,
  cartGetIdDefault,
  cartSetIdDefault,
} from '@shopify/hydrogen';

const cartHandler = createCartHandler({
  storefront,
  getCartId: cartGetIdDefault(request.headers),
  setCartId: cartSetIdDefault(),
  cartQueryFragment: CART_QUERY_FRAGMENT,
  cartMutateFragment: CART_MUTATE_FRAGMENT,
});

await cartHandler.addLines([{merchandiseId: '...'}]);
// .get() now returns the cart as expected
const cart = await cartHandler.get();
```

### Update Vite plugin imports, and how their options are passed to Remix [#1935](https://github.com/Shopify/hydrogen/pull/1935)

#### vite.config.js
[#1935](https://github.com/Shopify/hydrogen/pull/1935)
```diff
-import {hydrogen, oxygen} from '@shopify/cli-hydrogen/experimental-vite';
+import {hydrogen} from '@shopify/hydrogen/vite';
+import {oxygen} from '@shopify/mini-oxygen/vite';
import {vitePlugin as remix} from '@remix-run/dev';

export default defineConfig({
    hydrogen(),
    oxygen(),
    remix({
-     buildDirectory: 'dist',
+     presets: [hydrogen.preset()],
      future: {
```

### Change `storefrontRedirect` to ignore query parameters when matching redirects [#1900](https://github.com/Shopify/hydrogen/pull/1900)

#### This is a breaking change. If you want to retain the legacy functionality that is query parameter sensitive, pass matchQueryParams to storefrontRedirect():
[#1900](https://github.com/Shopify/hydrogen/pull/1900)
```js
storefrontRedirect({
  request,
  response,
  storefront,
+  matchQueryParams: true,
});
```

### Fix types returned by the session object [#1869](https://github.com/Shopify/hydrogen/pull/1869)

#### In remix.env.d.ts or env.d.ts, add the following types
[#1869](https://github.com/Shopify/hydrogen/pull/1869)
```diff
import type {
  // ...
  HydrogenCart,
+ HydrogenSessionData,
} from '@shopify/hydrogen';

// ...

declare module '@shopify/remix-oxygen' {
  // ...

+ interface SessionData extends HydrogenSessionData {}
}
```

### Fix 404 not working on certain unknown and i18n routes [#1732](https://github.com/Shopify/hydrogen/pull/1732)

#### Add a `($locale).tsx` route with the following contents
[#1732](https://github.com/Shopify/hydrogen/pull/1732)
```js
import {type LoaderFunctionArgs} from '@remix-run/server-runtime';

export async function loader({params, context}: LoaderFunctionArgs) {
  const {language, country} = context.storefront.i18n;

  if (
    params.locale &&
    params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    // If the locale URL param is defined, yet we still are still at the default locale
    // then the the locale param must be invalid, send to the 404 page
    throw new Response(null, {status: 404});
  }

  return null;
}
```

### Use new `variantBySelectedOptions` parameters introduced in Storefront API v2024-01 to fix redirection to the product's default variant when there are unknown query params in the URL. [#1642](https://github.com/Shopify/hydrogen/pull/1642)

#### Update the `product` query to include the `variantBySelectedOptions` parameters `ignoreUnknownOptions` and `caseInsensitiveMatch`
[#1642](https://github.com/Shopify/hydrogen/pull/1642)
```diff
-   selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
+   selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
```

### In TypeScript projects, when updating to the latest `@shopify/remix-oxygen` adapter release, please update also to the latest version of `@shopify/oxygen-workers-types` [#1494](https://github.com/Shopify/hydrogen/pull/1494)

#### Upgrade @shopify/oxygen-workers-types dependency
[#1494](https://github.com/Shopify/hydrogen/pull/1494)
```diff
"devDependencies": {
  "@remix-run/dev": "2.1.0",
  "@remix-run/eslint-config": "2.1.0",
- "@shopify/oxygen-workers-types": "^3.17.3",
+ "@shopify/oxygen-workers-types": "^4.0.0",
  "@shopify/prettier-config": "^1.1.2",
  ...
},
```

### Updated internal dependencies for bug resolution [#1496](https://github.com/Shopify/hydrogen/pull/1496)

#### Update the `@shopify/cli` dependency in your app to avoid duplicated subdependencies:
[#1496](https://github.com/Shopify/hydrogen/pull/1496)
```diff
  "dependencies": {
-   "@shopify/cli": "3.50.2",
+   "@shopify/cli": "3.51.0",
  }
```

### Add `@remix-run/server-runtime` as a dev dependency.  [#1489](https://github.com/Shopify/hydrogen/pull/1489)

#### Since Remix is now a peer dependency of `@shopify/remix-oxygen`, you need to add `@remix-run/server-runtime` to your dependencies with the same version you have for the rest of Remix dependencies
[#1489](https://github.com/Shopify/hydrogen/pull/1489)
```diff
"dependencies": {
  "@remix-run/react": "2.1.0"
+ "@remix-run/server-runtime": "2.1.0"
  ...
}
```

### Custom cart methods are now stable [#1440](https://github.com/Shopify/hydrogen/pull/1440)

#### Update `createCartHandler` if needed
[#1440](https://github.com/Shopify/hydrogen/pull/1440)
// server.ts

```diff
const cart = createCartHandler({
   storefront,
   getCartId,
   setCartId: cartSetIdDefault(),
-  customMethods__unstable: {
+  customMethods: {
     addLines: async (lines, optionalParams) => {
      // ...
     },
   },
 });
```

### Updated CLI dependencies to improve terminal output. [#1456](https://github.com/Shopify/hydrogen/pull/1456)

#### Upgrade `@shopify/cli dependency`
[#1456](https://github.com/Shopify/hydrogen/pull/1456)
```bash
npm add @shopify/cli@3.50.0
```

### Updated the starter template `Header` and `Footer` menu components for 2023.10.0 [#1465](https://github.com/Shopify/hydrogen/pull/1465)

#### Step: 1. Update the HeaderMenu component to accept a primaryDomainUrl and include it in the internal url check [#1465](https://github.com/Shopify/hydrogen/pull/1465)

[#1465](https://github.com/Shopify/hydrogen/pull/1465)
```diff
// app/components/Header.tsx

+ import type {HeaderQuery} from 'storefrontapi.generated';

export function HeaderMenu({
  menu,
+  primaryDomainUrl,
  viewport,
}: {
  menu: HeaderProps['header']['menu'];
+  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
  viewport: Viewport;
}) {

  // ...code

  // if the url is internal, we strip the domain
  const url =
    item.url.includes('myshopify.com') ||
    item.url.includes(publicStoreDomain) ||
+   item.url.includes(primaryDomainUrl)
      ? new URL(item.url).pathname
      : item.url;

   // ...code

}
```

#### Step: 2. Update the FooterMenu component to accept a primaryDomainUrl prop and include it in the internal url check [#1465](https://github.com/Shopify/hydrogen/pull/1465)

[#1465](https://github.com/Shopify/hydrogen/pull/1465)
```diff
// app/components/Footer.tsx

- import type {FooterQuery} from 'storefrontapi.generated';
+ import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

function FooterMenu({
  menu,
+  primaryDomainUrl,
}: {
  menu: FooterQuery['menu'];
+  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
}) {
  // code...

  // if the url is internal, we strip the domain
  const url =
    item.url.includes('myshopify.com') ||
    item.url.includes(publicStoreDomain) ||
+   item.url.includes(primaryDomainUrl)
      ? new URL(item.url).pathname
      : item.url;

   // ...code

  );
}
```

#### Step: 3. Update the Footer component to accept a shop prop [#1465](https://github.com/Shopify/hydrogen/pull/1465)

[#1465](https://github.com/Shopify/hydrogen/pull/1465)
```diff
export function Footer({
  menu,
+ shop,
}: FooterQuery & {shop: HeaderQuery['shop']}) {
  return (
    <footer className="footer">
-      <FooterMenu menu={menu} />
+      <FooterMenu menu={menu} primaryDomainUrl={shop.primaryDomain.url} />
    </footer>
  );
}
```

#### Step: 4. Update Layout.tsx to pass the shop prop [#1465](https://github.com/Shopify/hydrogen/pull/1465)

[#1465](https://github.com/Shopify/hydrogen/pull/1465)
```diff
export function Layout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
}: LayoutProps) {
  return (
    <>
      <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside menu={header.menu} shop={header.shop} />
      <Header header={header} cart={cart} isLoggedIn={isLoggedIn} />
      <main>{children}</main>
      <Suspense>
        <Await resolve={footer}>
-          {(footer) => <Footer menu={footer.menu}  />}
+          {(footer) => <Footer menu={footer.menu} shop={header.shop} />}
        </Await>
      </Suspense>
    </>
  );
}
```

### Enhance useMatches returned type inference [#1289](https://github.com/Shopify/hydrogen/pull/1289)

#### If you are calling `useMatches()` in different places of your app to access the data returned by the root loader, you may want to update it to the following pattern to enhance types:
[#1289](https://github.com/Shopify/hydrogen/pull/1289)
```ts
// root.tsx

import {useMatches} from '@remix-run/react';
import {type SerializeFrom} from '@shopify/remix-oxygen';

export const useRootLoaderData = () => {
  const [root] = useMatches();
  return root?.data as SerializeFrom<typeof loader>;
};

export function loader(context) {
  // ...
}
```

### Fix the Pagination component to reset internal state when the URL changes [#1291](https://github.com/Shopify/hydrogen/pull/1291)

#### Add `startCursor` to the query pageInfo
> Update pageInfo in all pagination queries. Here is an example route with a pagination query
[#1291](https://github.com/Shopify/hydrogen/pull/1291)
```diff
query CollectionDetails {
   collection(handle: $handle) {
     ...
     pageInfo {
       hasPreviousPage
       hasNextPage
       hasNextPage
       endCursor
+      startCursor
     }
   }
}
```

### Stabilize the createWithCache function [#1151](https://github.com/Shopify/hydrogen/pull/1151)

#### Rename createWithCache_unstable to createWithCache
[#1151](https://github.com/Shopify/hydrogen/pull/1151)
```diff
- import {createWithCache_unstable} from '@shopify/hydrogen';
+ import {createWithCache} from '@shopify/hydrogen';
```

### Add a default Powered-By: Shopify-Hydrogen header [#872](https://github.com/Shopify/hydrogen/pull/872)

#### It can be disabled by passing poweredByHeader: false in the configuration object of createRequestHandler
[#872](https://github.com/Shopify/hydrogen/pull/872)
```ts
import {createRequestHandler} from '@shopify/remix-oxygen';

export default {
  async fetch(request) {
    // ...
    const handleRequest = createRequestHandler({
      // ... other properties included
      poweredByHeader: false,
    });
    // ...
  },
};
```

### Updated CLI prompts [#733](https://github.com/Shopify/hydrogen/pull/733)

#### Update package.json
[#733](https://github.com/Shopify/hydrogen/pull/733)
```diff
"dependencies": {
-  "@shopify/cli": "3.x.x",
+  "@shopify/cli": "3.45.0",
}
```

### Fix active cart session event in Live View [#614](https://github.com/Shopify/hydrogen/pull/614)

#### Introducing getStorefrontHeaders that collects the required Shopify headers for making a Storefront API call.
[#614](https://github.com/Shopify/hydrogen/pull/614)
```ts
+ import {getStorefrontHeaders} from '@shopify/remix-oxygen';
import {createStorefrontClient, storefrontRedirect} from '@shopify/hydrogen';

export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {

    const {storefront} = createStorefrontClient({
      cache,
      waitUntil,
-     buyerIp: getBuyerIp(request),
      i18n: {language: 'EN', country: 'US'},
      publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
      storeDomain: `https://${env.PUBLIC_STORE_DOMAIN}`,
      storefrontApiVersion: env.PUBLIC_STOREFRONT_API_VERSION || '2023-01',
      storefrontId: env.PUBLIC_STOREFRONT_ID,
-     requestGroupId: request.headers.get('request-id'),
+     storefrontHeaders: getStorefrontHeaders(request),
    });
```
