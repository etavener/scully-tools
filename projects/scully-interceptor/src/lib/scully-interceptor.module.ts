import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ScullyInterceptor } from './scully.interceptor';

@NgModule({
  declarations: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ScullyInterceptor,
      multi: true,
    }
  ],
  imports: [],
  exports: []
})
export class ScullyInterceptModule { }
