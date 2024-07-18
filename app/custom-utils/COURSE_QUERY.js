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
          id
          mediaContentType
          sources {
            url
            mimeType
            format
            height
            width
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
              title: field (key: "title") {
                  value
              }
              sections: field (key: "sections") {
                  value
                  references(first: 10) {
                      edges {
                          node {
                      ... on Metaobject {
                          title: field (key: "title") {
                              value
                          }
                          description: field (key: "description") {
                              value
                          }
                          lessons: field (key: "lessons") {
                              value
                              references(first: 20) {
                                  edges {
                                      node {
                                  ... on Metaobject {
                                      title: field (key: "title") {
                                          value
                                      }
                                      description: field (key: "description") {
                                          value
                                      }
                                      duration: field (key: "duration") {
                                          value
                                      }
                                      video: field (key: "video") {
                                          value
                                          reference {
                                              ... on Video {
                                                  id
                                                  mediaContentType
                                                  sources {
                                                      url
                                                      mimeType
                                                      format
                                                      height
                                                      width
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
                  }
                      }
                  }
              }
              description: field (key: "description") {
                value
              }
          }
      }
    }
  
  }
}
`;

export default COURSE_QUERY;
