import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TokenInterceptor } from './token-interceptor.interceptor';
import { AuthService } from '../../services/auth.service';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

describe('TokenInterceptor', () => {
  let httpMock: HttpTestingController;
  let authService: AuthService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TokenInterceptor,
        AuthService,
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    httpClient = TestBed.inject(HttpClient);

    spyOn(authService, 'getToken').and.returnValue('fake-token');
    spyOn(authService, 'logout');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header if token is present', () => {
    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');

    req.flush({});
  });

  it('should not add Authorization header if token is not present', () => {
    (authService.getToken as jasmine.Spy).and.returnValue(null);
    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeFalse();

    req.flush({});
  });

  it('should call logout on 401 error', () => {
    httpClient.get('/test').subscribe({
      error: () => {},
    });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(authService.logout).toHaveBeenCalledWith(true);
  });

  it('should not call logout on non-401 error', () => {
    httpClient.get('/test').subscribe({
      error: () => {},
    });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 500, statusText: 'Server Error' });

    expect(authService.logout).not.toHaveBeenCalled();
  });
});
