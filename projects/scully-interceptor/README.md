# ScullyInterceptor

Import this Angular Module to automatically intercept all GET HTTP calls and 
get /set the response in Scully's transferState.

This module requires [Scully installed for Static Site Generating](https://scully.io/).

## Installing
```
npm install scully-interceptor --save
```
## Import module

All you need to do is import the module and transferState is dealt with.
```typescript
import { ScullyInterceptModule } from 'scully-interceptor';

@NgModule({
  ...
  imports: [
    ...
    ScullyInterceptModule
  ]
})
export class AppModule { }
```
