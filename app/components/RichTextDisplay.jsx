import {convertSchemaToHtml} from '@thebeyondgroup/shopify-rich-text-renderer';

export default function RichTextDisplay({content}) {
//   console.log(content);
  const htmlContent = content
    ? convertSchemaToHtml(content, {
        scoped: 'rich-text-wrap',
      })
    : 'Error loading content';

//   console.log(htmlContent);

  return <div dangerouslySetInnerHTML={{__html: htmlContent}}></div>;
}
