import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../../services/loader.service';

@Injectable()
export class LoaderInterceptorService implements HttpInterceptor {
  constructor(private loaderService: LoaderService) {}

  countOfRequests = 0;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const dontShowLoader = req.params.get('dontShowLoader') === 'true';

    if (!dontShowLoader) {
      this.showLoader();
    }

    return next.handle(req).pipe(
      finalize(() => {
        if (!dontShowLoader) {
          this.hideLoader();
        }
      })
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
