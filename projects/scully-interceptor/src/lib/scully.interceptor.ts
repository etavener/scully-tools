import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { TransferStateService } from '@scullyio/ng-lib';
import { switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class ScullyInterceptor implements HttpInterceptor {

  constructor(
    private transferState: TransferStateService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.method === 'GET') {
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

