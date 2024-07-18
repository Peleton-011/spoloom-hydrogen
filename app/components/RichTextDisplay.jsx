import {convertSchemaToHtml} from '@thebeyondgroup/shopify-rich-text-renderer';

const defaultOptions = {
  scoped: false,
  newLineToBreak: true, // convert new line character to <br/>
  classes: {
    p: 'mt-3 text-lg text-justify', // paragraph classes
    h1: 'font-bold mb-8 text-2xl md:text-4xl', // heading1 classes
    h2: 'font-bold mb-8 text-xl md:text-3xl', // heading2 classes
    h3: 'font-bold mb-6 text-lg md:text-2xl', // heading3 classes
    h4: 'font-medium mb-6 text-base md:text-lg', // heading4 classes
    h5: 'font-medium mb-5 text-sm md:text-base', // heading5 classes
    h6: 'font-medium mb-4 text-xs md:text-sm', // heading6 classes
    ol: 'my-3 ml-3 flex flex-col gap-y-2 list-decimal', // order list classes
    ul: 'my-3 ml-3 flex flex-col gap-y-2 list-disc', // unordered list classes
    li: 'text-sm md:text-base ml-10', // list item classes
    a: 'underline text-blue-500 hover:text-blue-700', // anchor/link classes
    strong: 'font-bold', // bold/strong classes
    em: 'font-italic', // italic/em classes
  },
};

export function RichTextDisplay({content, options = defaultOptions}) {
  //   console.log(content);
  const htmlContent = content
    ? convertSchemaToHtml(content, options)
    : 'Error loading content';

  //   console.log(htmlContent);

  return <div dangerouslySetInnerHTML={{__html: htmlContent}}></div>;
}
