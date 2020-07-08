# Scully Wordpress Plugin

## Installing
```
npm install scully-wordpress-plugin --save
```
## Import module

For the route '/:post' get the wordpress posts from https://www.your-wordpress.com and 
for each post returned replace the parameter with the slug:
```typescript
import { ScullyConfig } from '@scullyio/scully';
import { WordpressData } from 'scully-wordpress-plugin';
export const config: ScullyConfig = {
  ...
  routes: {
    '/:post': {
      type: WordpressData, // specify the wordpress plugin
      url: 'https://www.your-wordpress.com', // the wordpress URL
      'post': {
        data: 'posts', // the type of data to be returned from Wordpress
        property: 'slug' // the name of the property to map the paramater to
      },
    }
  }
};
```

For the route '/:page' get the wordpress pages from https://www.your-wordpress.com and 
for each page returned replace the parameter with the slug:
```typescript
import { ScullyConfig } from '@scullyio/scully';
import { WordpressData } from 'scully-wordpress-plugin';
export const config: ScullyConfig = {
  ...
  routes: {
    '/:page': {
      type: WordpressData,
      url: 'https://www.your-wordpress.com',
      'page': {
        data: 'pages',
        property: 'slug'
      }
    }
  }
};
```

A more complex example:
```typescript
import { ScullyConfig } from '@scullyio/scully';
import { WordpressData } from 'scully-wordpress-plugin';
export const config: ScullyConfig = {
  ...
  routes: {
    '/:page/:post': {
      type: WordpressData,
      url: 'https://www.your-wordpress.com',
      'page': {
        data: 'pages', // get pages
        perPage: 20, // maximum of 20 items
        property: 'slug'
      },
      'post': {
        data: 'posts', // get posts
        categoryId: 10, // only posts that have this category id.
        property: 'slug'
      }
    }
  }
};
```
