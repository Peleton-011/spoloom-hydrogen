// src/components/ProductMedia.jsx
import React, {useEffect, useState} from 'react';
import {useShopQuery, gql} from '@shopify/hydrogen';

const PRODUCT_MEDIA_QUERY = gql`
  query ProductMedia($id: ID!) {
    product(id: $id) {
      media(first: 10) {
        edges {
          node {
            mediaContentType
            alt
            ... on MediaImage {
              image {
                originalSrc
                altText
              }
            }
            ... on Video {
              sources {
                url
                mimeType
              }
            }
          }
        }
      }
    }
  }
`;

export function ProductMedia({productId}) {
  const {data} = useShopQuery({
    query: PRODUCT_MEDIA_QUERY,
    variables: {id: productId},
    cache: {maxAge: 60 * 60}, // Cache for an hour
  });

  return (
    <div>
      <h1>Product Media</h1>
      <ul>
        {data.product.media.edges.map(({node}, index) => (
          <li key={index}>
            {node.mediaContentType === 'IMAGE' && (
              <img
                src={node.image.originalSrc}
                alt={node.image.altText || 'Product Image'}
              />
            )}
            {node.mediaContentType === 'VIDEO' && (
              <video controls>
                <source
                  src={node.sources[0].url}
                  type={node.sources[0].mimeType}
                />
                Your browser does not support the video tag.
              </video>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
