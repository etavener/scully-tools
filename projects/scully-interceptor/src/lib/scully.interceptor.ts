import { Inject, Injectable, Optional } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { TransferStateService } from '@scullyio/ng-lib';
import { switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { IgnoreRoutes } from './IgnoreRoutes.service';

@Injectable()
export class ScullyInterceptor implements HttpInterceptor {

  private routesToIgnore: string[] = [];

  constructor(
    private transferState: TransferStateService,
    @Optional() @Inject( IgnoreRoutes ) private ignoreRoutes: string[]
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if( this.ignoreRoutes ) {
      this.routesToIgnore = this.ignoreRoutes
    }
    const ignore = this.routesToIgnore.find( r => req.url.startsWith( r ) );
    if (req.method === 'GET' && !ignore ) {
      return this.transferState.getState(req.urlWithParams).pipe(
        switchMap(stored => {
          if (stored) {
            return of(new HttpResponse({body: stored, status: 200}));
          }
          return next.handle(req).pipe(
            tap((apiResponse: HttpResponse<any>) => {
              if ( apiResponse && apiResponse.body && apiResponse.status === 200 ) {
                this.transferState.setState(req.urlWithParams, apiResponse.body);
              }
            })
          );
        })
      );
    }
    return next.handle(req);
  }

}

