import { httpGetJson, registerPlugin, routeSplit } from '@scullyio/scully';

export const WordpressData = 'wordpress';
import { yellow } from '@scullyio/scully';

const VALID_PROPERTIES = [ 'pages', 'posts' ];

export const wordpressDataPlugin = async ( route, pathconfig ) => {

  const asyncForEach = async ( array, cb ) => {
    for (let index = 0; index < array.length; index++) {
      await cb( array[index] );
    }
  };

  const { params } = routeSplit( route );

  const getDataForParams = async () => {
    // for each item in params
    await asyncForEach(params, async param => {
      const paramConfig = pathconfig[param.part];

      if( paramConfig.data === 'post' ) {
        paramConfig.data = 'posts';
      }

      if( paramConfig.data === 'page' ) {
        paramConfig.data = 'pages';
      }

      if ( !VALID_PROPERTIES.includes( paramConfig.data ) ) {
        console.error(
          yellow( `Wordpress Router plugin: The value ${paramConfig.data} is not an allowed value. The "data" option only accepts`,
            VALID_PROPERTIES.map(   i => ` "${i}"`) ).toString() );
      } else {
        let api = `${pathconfig.url}/wp-json/wp/v2/${paramConfig.data}?`;
        if (!pathconfig.perPage) {
          pathconfig.perPage = 100;
        }
        api = `${api}&per_page=${pathconfig.perPage}`;
        if (pathconfig.categoryId) {
          api = `${api}&category=${pathconfig.categoryId}`;
        }
        const response = await httpGetJson(api) as any[];
        pathconfig[param.part].values = response.map(r => r[paramConfig.property]);
      }
    });
  };

  const createRoutes = ( index: number = 0 ): any[] => {
    const param = params[ index ];
    const values = pathconfig[ param.part ].values
    const mappedValues = values.map( v => ({ ...param, value: v }));

    if ( index >= params.length - 1 ) {
      return mappedValues;
    } else {
      const nextIndex = index + 1;
      const childRoutes =  createRoutes( nextIndex );
      const currRoutes = [];
      mappedValues.forEach( value => {
        return childRoutes.forEach( r => {
          if ( nextIndex === params.length - 1 ) {
            currRoutes.push([ value, r ]);
          } else {
            currRoutes.push([ value, ...r ]);
          }
        });
      });
      return currRoutes;
    }
  };

  await getDataForParams();
  const routesWithParams = createRoutes();

  return routesWithParams.map( bits => {
    let path = route;

    if ( params.length === 1 ) {
      path = path.replace(`:${bits.part}`, bits.value);
    } else {
      bits.forEach(bit => {
        path = path.replace(`:${bit.part}`, bit.value);
      });
    }

    return {
      route: path,
      type: WordpressData
    };
  });
};

const validator = async options => {
  const errors = [];
  return errors;
};

registerPlugin('router', WordpressData, wordpressDataPlugin, validator );

