import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoaderInterceptorService } from './loader-interceptor.service';
import { LoaderService } from '../../services/loader.service';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

describe('LoaderInterceptorService', () => {
  let httpMock: HttpTestingController;
  let loaderService: LoaderService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LoaderInterceptorService,
        LoaderService,
        { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    loaderService = TestBed.inject(LoaderService);
    httpClient = TestBed.inject(HttpClient);

    spyOn(loaderService, 'show');
    spyOn(loaderService, 'hide');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should show loader on request and hide on response', () => {
    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(loaderService.show).toHaveBeenCalled();

    req.flush({});
    expect(loaderService.hide).toHaveBeenCalled();
  });

  it('should not show loader if dontShowLoader param is true', () => {
    httpClient.get('/test', { params: { dontShowLoader: 'true' } }).subscribe();

    const req = httpMock.expectOne('/test?dontShowLoader=true');
    expect(loaderService.show).not.toHaveBeenCalled();

    req.flush({});
    expect(loaderService.hide).not.toHaveBeenCalled();
  });

  it('should handle multiple requests correctly', () => {
    httpClient.get('/test1').subscribe();
    httpClient.get('/test2').subscribe();

    const req1 = httpMock.expectOne('/test1');
    const req2 = httpMock.expectOne('/test2');
    expect(loaderService.show).toHaveBeenCalledTimes(2);

    req1.flush({});
    expect(loaderService.hide).not.toHaveBeenCalled();

    req2.flush({});
    expect(loaderService.hide).toHaveBeenCalled();
  });

  it('should not hide loader if there are pending requests', () => {
    httpClient.get('/test1').subscribe();
    httpClient.get('/test2').subscribe();

    const req1 = httpMock.expectOne('/test1');
    const req2 = httpMock.expectOne('/test2');
    expect(loaderService.show).toHaveBeenCalledTimes(2);

    req1.flush({});
    expect(loaderService.hide).not.toHaveBeenCalled();

    req2.flush({});
    expect(loaderService.hide).toHaveBeenCalled();
  });
});
