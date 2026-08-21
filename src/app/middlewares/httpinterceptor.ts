import {HttpInterceptor,HttpEvent,HttpHandler,HttpRequest,HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class HttpInterceptorService implements HttpInterceptor {
  private isPopupOpen = false;

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const tenantId = environment.tenantId;
    const headersToSet: { [header: string]: string } = {
      'x-tenant-id': tenantId
    };

    const clonedRequest = req.clone({
      setHeaders: headersToSet
    });

    //this.loaderService.show();

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (!this.isPopupOpen) {
          this.isPopupOpen = true;

          let title = 'Unexpected Error';
          let message = 'An unexpected error occurred, Please check your connection or tenant and try again.';

          switch (error.status) {
            case 400:
              title = 'Bad Request';
              message = 'Server received an incorrect or corrupted request, often due to malformed data, incorrect URL, or invalid input.';
              break;
            case 403:
              title = 'Forbidden ';
              message = 'Do not have permission to access the requested resource';
              break;
            case 500:
              title = 'Internal Server Error';
              message = 'Something went wrong on the server. Please try again later.';
              break;
          }
          console.log("Error :",error.status);
          if(error.status != 0){
            /*this.popUpService.openPopup({title,message,buttons: [{ title: 'OK', action: 'ok' }]}).subscribe(() => {
                this.isPopupOpen = false;
            });*/
          }
      }

        return throwError(() => error);
      }),
      finalize(() => {
      //  this.loaderService.hide();
      })
    );
  }
}
