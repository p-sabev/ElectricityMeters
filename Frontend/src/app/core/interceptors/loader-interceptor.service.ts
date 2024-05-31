import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class LoaderInterceptorService implements HttpInterceptor {
  constructor(private loaderService: LoaderService) {}

  countOfRequests = 0;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.params.get('dontShowLoader') !== 'true') {
      this.showLoader();
    }

    return next.handle(req).pipe(
      finalize(() => {
        if (req.params.get('dontShowLoader') !== 'true') {
          this.hideLoader();
        }
      })
      // tap(
      //   (event: HttpEvent<any>) => {
      //     if (event instanceof HttpResponse) {
      //       if (req.params.get('dontShowLoader') !== 'true') {
      //         // this.hideLoader();
      //       }
      //     }
      //   },
      //   () => {
      //     // this.hideLoader();
      //   },
      //   () => {
      //     console.log('COMPLETE');
      //     if (req.params.get('dontShowLoader') !== 'true') {
      //       this.hideLoader();
      //     }
      //   }
      // )
    );
  }

  private showLoader(): void {
    this.countOfRequests++;
    this.loaderService.show();
  }

  private hideLoader(): void {
    this.countOfRequests--;
    if (this.countOfRequests <= 0) {
      this.countOfRequests = 0;
      this.loaderService.hide();
    }
  }
}
