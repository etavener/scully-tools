import { registerPlugin } from '@scullyio/scully';
import PurgeCSS from 'purgecss';
import * as extractCss from 'extract-css';
import { JSDOM } from 'jsdom';

export const OptimizeCSSPlugin = 'optimizeCSSPlugin';

const getElements = ( doc: any, element: string ) => {
  const elements = doc.getElementsByTagName( element );
  return [ ...elements ];
};

const appendToHead = (html: string, content: string ) => {
  const parts = html.split('</head>');
  return `${parts[0]}${content}</head>${parts[1]}`;
};

const removeElements = ( elements: any[] ) => {
  elements.forEach( el => {
    if ( el && el.parentNode ) {
      el.parentNode.removeChild( el );
    }
  });
};

const addInlineStyle = ( doc, inlineCSS: string ) => {
  const styleEl = doc.createElement('style');
  styleEl.innerHTML = inlineCSS;
  doc.head.append( styleEl );
};

const getElementsWithAttributeValue = ( doc: any, element: string, attribute: string, value: string ) => {
  const elements = doc.getElementsByTagName( element );
  return [ ...elements ].filter( el => el.getAttribute( attribute ) === value );
};

const removeEmptyStyleTags = (html: string): string => {
  return html.replace('<style></style>', '');
};

const getCSS = async (html, config: any = {}): Promise<any> => {

  const pureHTML = removeEmptyStyleTags( html );
  return new Promise((resolve, reject) => {
    extractCss(
      pureHTML,
      {
        url: 'http://localhost:1864',
        applyLinkTags: true,
        applyStyleTags: true,
        removeStyleTags: true,
        removeLinkTags: false,
        ...config
      },
      (err, cleanHtml, css) => {
        new PurgeCSS().purge({
          content: [
            {
              raw: cleanHtml,
              extension: 'html'
            }
          ],
          css: [
            {
              raw: css
            }
          ]
        })
          .then( response => resolve( response[0].css ) )
          .catch( error => reject( error ));
      }
    )
  });
};

const optimizeCSS = async (html) => {

  const dom = new JSDOM(html);
  // get all css links
  const cssLinks = getElementsWithAttributeValue( dom.window.document, 'link', 'rel', 'stylesheet' );
  // get the source for each css link
  const cssRefs = cssLinks.map( file => file.getAttribute( 'href' ) );

  // get only the css needed to render the static page
  const inlineCSS = await getCSS( html );

  // remove all style elements from the DOM
  const styleElements = getElements( dom.window.document, 'style');
  removeElements( styleElements );

  addInlineStyle( dom.window.document, inlineCSS );
  // remove existing links to css files (we will defer these next)
  removeElements( cssLinks );

  /*
    For each css file we will load it but only once the page has loaded (this is the recommended way from google)
  */
  let htmlString = dom.serialize();
  cssRefs.forEach( (cssPath: string) => {
    htmlString = appendToHead( htmlString, `
    <link rel="preload" href="${cssPath}" as="style" onload="this.onload=null;this.rel='stylesheet'">
    `);
    htmlString = appendToHead( htmlString, `
    <noscript><link rel="stylesheet" href="${cssPath}"></noscript>
    `);
  });
  return htmlString
};
registerPlugin('render', OptimizeCSSPlugin, optimizeCSS );
