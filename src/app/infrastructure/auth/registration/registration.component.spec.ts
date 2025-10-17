import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationComponent } from './registration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NavBarComponent } from '../../../layout/nav-bar/nav-bar.component';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [RegistrationComponent, NavBarComponent],
      providers: [{ provide: Router, useValue: routerMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should submit organizer registration form and send correct data', () => {
    component.registrationForm.patchValue({
      name: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: '123456',
      address: 'Main Street',
      phoneNumber: '123456789',
      photoUrl: 'photo.jpg',
      role: 'organizer',
    });

    component.onSubmit();

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(
      jasmine.objectContaining({
        name: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        role: 'organizer',
      })
    );

    req.flush({ message: 'Success' });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should submit provider registration form with provider fields', () => {
    component.toggleProvider(true);

    component.registrationForm.patchValue({
      name: 'Anna',
      lastname: 'Smith',
      email: 'anna@example.com',
      password: 'secure123',
      role: 'provider',
      companyEmail: 'contact@company.com',
      companyName: 'Cool Company',
      companyAddress: 'Company St',
      description: 'Best service',
      openingTime: '09:00',
      closingTime: '17:00',
      companyPhoto: 'photo.png',
    });

    component.onSubmit();

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(
      jasmine.objectContaining({
        email: 'anna@example.com',
        role: 'provider',
        companyName: 'Cool Company',
        companyEmail: 'contact@company.com',
      })
    );

    req.flush({ message: 'Provider registered' });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should not submit if form is invalid', () => {
    component.registrationForm.patchValue({
      email: '',
      password: '',
    });

    component.onSubmit();

    httpMock.expectNone('/api/users');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
