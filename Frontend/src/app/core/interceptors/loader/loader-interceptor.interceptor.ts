import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../../services/loader.service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  const dontShowLoader = req.params.get('dontShowLoader') === 'true';

  // keep request count using a closure variable
  const requestCountRef = loaderInterceptorRequestCounter();

  if (!dontShowLoader) {
    requestCountRef.count++;
    loaderService.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (!dontShowLoader) {
        requestCountRef.count--;
        if (requestCountRef.count <= 0) {
          requestCountRef.count = 0;
          loaderService.hide();
        }
      }
    })
  );
};

// Keep a single counter instance (closure workaround for shared state)
function loaderInterceptorRequestCounter() {
  const ref = (loaderInterceptor as any)._counter ?? { count: 0 };
  (loaderInterceptor as any)._counter = ref;
  return ref;
}
