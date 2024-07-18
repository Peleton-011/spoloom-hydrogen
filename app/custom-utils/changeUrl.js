function changeUrl(url) {
  const parts = url.split('/');
  const id = parts[parts.length - 2];
  return 'https://cdn.shopify.com/videos/c/o/v/' + id + '.mp4';
}

export default changeUrl;
