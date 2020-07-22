import { ModuleWithProviders, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ScullyInterceptor } from './scully.interceptor';
import { IgnoreRoutes } from './IgnoreRoutes.service';

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
export class ScullyInterceptModule {
  static forRoot( ignoreRoutes: string[] = []): ModuleWithProviders {
    return {
      ngModule: ScullyInterceptModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ScullyInterceptor,
          multi: true
        },
        {
          provide: IgnoreRoutes,
          useValue: ignoreRoutes
        }
      ]
    }
  }
}


