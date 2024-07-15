// src/components/VideosCategoryProducts.jsx
import React, {useEffect, useState} from 'react';
import {useShopQuery, gql} from '@shopify/hydrogen';

const VIDEOS_CATEGORY_PRODUCTS_QUERY = gql`
  query VideosCategoryProducts {
    products(first: 20, query: "tag:Videos") {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
  }
`;

export function VideoProducts({selectProductId}) {
  const {data} = useShopQuery({
    query: VIDEOS_CATEGORY_PRODUCTS_QUERY,
    cache: {maxAge: 60 * 60}, // Cache for an hour
  });

  return (
    <div>
      <h1>Videos Category Products</h1>
      <ul>
        {data.products.edges.map(({node}) => (
          <li key={node.id} onClick={() => selectProductId(node.handle)}>
            {node.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
