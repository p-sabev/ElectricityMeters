import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageHeadingComponent } from './page-heading.component';
import { TranslateService } from '@ngx-translate/core';

describe('PageHeadingComponent', () => {
  let component: PageHeadingComponent;
  let fixture: ComponentFixture<PageHeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeadingComponent],
      providers: [{ provide: TranslateService, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
