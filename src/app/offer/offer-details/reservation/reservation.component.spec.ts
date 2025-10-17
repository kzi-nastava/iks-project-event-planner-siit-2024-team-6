import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReservationComponent } from './reservation.component';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../infrastructure/auth/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Service } from '../../model/offer.model';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ReservationComponent', () => {
  let component: ReservationComponent;
  let fixture: ComponentFixture<ReservationComponent>;
  let httpMock: HttpTestingController;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ReservationComponent>>;

  const mockService: Service = {
    id: 1,
    preciseDuration: 60,
    latestReservation: 24,
    name: 'Test Service',
  } as unknown as Service;

  beforeEach(async () => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getRole',
      'getUserId',
    ]);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef<ReservationComponent>', [
      'close',
    ]);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NoopAnimationsModule],
      declarations: [ReservationComponent],
      providers: [
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { service: mockService } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // --- Initialization ---
  it('Creates component', () => {
    expect(component).toBeTruthy();
  });

  it('Skip initialization if user is not organizer', () => {
    authServiceSpy.getRole.and.returnValue('ROLE_USER');
    spyOn(component, 'calculateMinDate');
    component.ngOnInit();
    expect(component.calculateMinDate).not.toHaveBeenCalled();
  });

  it('Should set organizerId when user is organizer', fakeAsync(() => {
    authServiceSpy.getRole.and.returnValue('ROLE_ORGANIZER');
    authServiceSpy.getUserId.and.returnValue(123);

    component.ngOnInit();

    const req = httpMock.expectOne('/api/organizers/future-events');
    req.flush([]);
    tick();

    expect(component.organizerId).toBe(123);
  }));

  it('Should set minDate correctly', fakeAsync(() => {
    authServiceSpy.getRole.and.returnValue('ROLE_ORGANIZER');
    component.ngOnInit();

    const req = httpMock.expectOne('/api/organizers/future-events');
    req.flush([]);
    tick();

    const expected = new Date();
    expected.setDate(expected.getDate() + 1);
    expect(component.minDate.toDateString()).toBe(expected.toDateString());
  }));

  it('Should call calculateMinDate exactly once if ROLE_ORGANIZER', fakeAsync(() => {
    authServiceSpy.getRole.and.returnValue('ROLE_ORGANIZER');
    const spy = spyOn(component, 'calculateMinDate').and.callThrough();

    component.ngOnInit();

    const req = httpMock.expectOne('/api/organizers/future-events');
    req.flush([]);
    tick();

    expect(spy).toHaveBeenCalledTimes(1);
  }));

  it('Should calculate isPreciseDurationDefined properly', fakeAsync(() => {
    authServiceSpy.getRole.and.returnValue('ROLE_ORGANIZER');
    component.ngOnInit();

    const req = httpMock.expectOne('/api/organizers/future-events');
    req.flush([]);
    tick();

    expect(component.isPreciseDurationDefined).toBeTrue();
  }));

  it('Should fetch events successfully', fakeAsync(() => {
    authServiceSpy.getRole.and.returnValue('ROLE_ORGANIZER');
    authServiceSpy.getUserId.and.returnValue(99);

    component.ngOnInit();
    const req = httpMock.expectOne('/api/organizers/future-events');
    req.flush([{ id: 1, name: 'Event A', place: 'Hall', date: '2025-10-01' }]);
    tick();

    expect(component.events.length).toBe(1);
    expect(component.events[0].name).toBe('Event A');
  }));

  it('Should handle any fetch events error and show snackbar', fakeAsync(() => {
    authServiceSpy.getRole.and.returnValue('ROLE_ORGANIZER');
    component.ngOnInit();

    const req = httpMock.expectOne('/api/organizers/future-events');

    req.error(new ErrorEvent('Network error'));

    tick();

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Failed to load events.',
      'Close',
      { duration: 3000 }
    );
  }));

  it('Should handle empty events list without error', fakeAsync(() => {
    authServiceSpy.getRole.and.returnValue('ROLE_ORGANIZER');

    component.ngOnInit();
    const req = httpMock.expectOne('/api/organizers/future-events');
    req.flush([]);
    tick();

    expect(component.events.length).toBe(0);
    expect(snackBarSpy.open).not.toHaveBeenCalled();
  }));

  it('Should handle events with missing fields gracefully', fakeAsync(() => {
    authServiceSpy.getRole.and.returnValue('ROLE_ORGANIZER');

    component.ngOnInit();
    const req = httpMock.expectOne('/api/organizers/future-events');
    req.flush([{ id: 2, place: 'Unknown Hall', date: '2025-12-01' }]);
    tick();

    expect(component.events.length).toBe(1);
    expect(component.events[0].id).toBe(2);
    expect(component.events[0].name).toBeUndefined();
  }));

  // --- Time Handling ---
  it('onFromTimeChange() should call calculateToTime only if fixed duration', () => {
    spyOn(component, 'calculateToTime');
    component.isPreciseDurationDefined = true;
    component.fromTime = '10:00';
    component.onFromTimeChange();
    expect(component.calculateToTime).toHaveBeenCalled();
  });

  it('calculateToTime() should compute correct toTime', () => {
    component.fromTime = '10:00';
    component.isPreciseDurationDefined = true;
    component.service.preciseDuration = 90;
    component.calculateToTime();
    expect(component.toTime).toBe('11:30');
  });

  it('onFromTimeChange() should not call calculateToTime if fromTime is empty', () => {
    spyOn(component, 'calculateToTime');
    component.isPreciseDurationDefined = true;
    component.fromTime = '';
    component.onFromTimeChange();
    expect(component.calculateToTime).not.toHaveBeenCalled();
  });

  it('onFromTimeChange() should not call calculateToTime if duration is not fixed', () => {
    spyOn(component, 'calculateToTime');
    component.isPreciseDurationDefined = false;
    component.fromTime = '10:00';
    component.onFromTimeChange();
    expect(component.calculateToTime).not.toHaveBeenCalled();
  });

  it('calculateToTime() should handle time overflow to next day', () => {
    component.fromTime = '23:30';
    component.isPreciseDurationDefined = true;
    component.service.preciseDuration = 90; // 1h30m
    component.calculateToTime();
    expect(component.toTime).toBe('01:00');
  });

  // --- Validation ---
  it('Should fail if no event selected', () => {
    component.selectedDate = new Date();
    component.fromTime = '10:00';
    component.toTime = '11:00';
    const valid = component.validateFields();
    expect(valid).toBeFalse();
    expect(snackBarSpy.open).toHaveBeenCalled();
  });

  it('Should fail if no date selected', () => {
    component.selectedEvent = {
      id: 1,
      name: 'Event',
      place: 'Place',
      date: '2025-10-01',
    };
    component.fromTime = '10:00';
    component.toTime = '11:00';
    const valid = component.validateFields();
    expect(valid).toBeFalse();
    expect(snackBarSpy.open).toHaveBeenCalled();
  });

  it('Should fail if fromTime is missing', () => {
    component.selectedEvent = {
      id: 1,
      name: 'Event',
      place: 'Place',
      date: '2025-10-01',
    };
    component.selectedDate = new Date();
    component.toTime = '11:00';

    const valid = component.validateFields();

    expect(valid).toBeFalse();
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Please select a time for your reservation.',
      'Close',
      { duration: 3000 }
    );
  });

  it('Should fail if toTime is missing', () => {
    component.selectedEvent = {
      id: 1,
      name: 'Event',
      place: 'Place',
      date: '2025-10-01',
    };
    component.selectedDate = new Date();
    component.fromTime = '10:00';

    const valid = component.validateFields();

    expect(valid).toBeFalse();
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Please select a time for your reservation.',
      'Close',
      { duration: 3000 }
    );
  });

  it('Should pass if all fields valid', () => {
    component.selectedEvent = {
      id: 1,
      name: 'Event',
      place: 'Place',
      date: '2025-10-01',
    };
    component.selectedDate = new Date();
    component.fromTime = '10:00';
    component.toTime = '11:00';
    const valid = component.validateFields();
    expect(valid).toBeTrue();
  });

  it('Should fail if selected date is before minDate', () => {
    component.selectedEvent = {
      id: 1,
      name: 'Event',
      place: 'Place',
      date: '2025-10-01',
    };

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    component.selectedDate = yesterday;
    component.fromTime = '10:00';
    component.toTime = '11:00';

    const valid = component.validateFields();

    expect(valid).toBeFalse();
    expect(snackBarSpy.open).toHaveBeenCalled();
  });

  it('Should fail if end time is before start time', () => {
    component.selectedEvent = {
      id: 1,
      name: 'Event',
      place: 'Place',
      date: '2025-10-01',
    };
    component.selectedDate = new Date();

    component.fromTime = '12:00';
    component.toTime = '11:00';

    const valid = component.validateFields();

    expect(valid).toBeFalse();
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'End time must be after start time.',
      'Close',
      { duration: 3000 }
    );
  });

  it('Should fail if end time is equal to start time', () => {
    component.selectedEvent = {
      id: 1,
      name: 'Event',
      place: 'Place',
      date: '2025-10-01',
    };
    component.selectedDate = new Date();

    component.fromTime = '10:00';
    component.toTime = '10:00';

    const valid = component.validateFields();

    expect(valid).toBeFalse();
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'End time must be after start time.',
      'Close',
      { duration: 3000 }
    );
  });

  // --- Booking ---
  it('Should not call API if validation fails', () => {
    spyOn(component, 'validateFields').and.returnValue(false);

    component.book();

    httpMock.expectNone('/api/reservations/');
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
    expect(snackBarSpy.open).not.toHaveBeenCalled();
  });

  it('Should send correct DTO if valid', fakeAsync(() => {
    spyOn(component, 'validateFields').and.returnValue(true);
    component.selectedDate = new Date(2025, 0, 1);
    component.fromTime = '10:00';
    component.toTime = '11:00';
    component.selectedEvent = {
      id: 7,
      name: 'E',
      place: 'P',
      date: '2025-01-01',
    };

    component.book();
    const req = httpMock.expectOne('/api/reservations/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      startTime: '2025-01-01T10:00:00',
      endTime: '2025-01-01T11:00:00',
      serviceId: 1,
      eventId: 7,
    });
    req.flush({});
    tick();

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Reservation confirmed!',
      'Close',
      { duration: 5000 }
    );
    expect(dialogRefSpy.close).toHaveBeenCalled();
  }));

  it('Should show backend error message on failure', fakeAsync(() => {
    spyOn(component, 'validateFields').and.returnValue(true);
    component.selectedDate = new Date(2025, 0, 1);
    component.fromTime = '10:00';
    component.toTime = '11:00';
    component.selectedEvent = {
      id: 7,
      name: 'E',
      place: 'P',
      date: '2025-01-01',
    };

    component.book();
    const req = httpMock.expectOne('/api/reservations/');
    req.flush(
      { message: 'Reservation can not be made' },
      { status: 400, statusText: 'Bad Request' }
    );
    tick();

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Reservation can not be made',
      'Close',
      {
        duration: 5000,
      }
    );
  }));

  it('Should close dialog on success', fakeAsync(() => {
    spyOn(component, 'validateFields').and.returnValue(true);
    component.selectedDate = new Date(2025, 0, 1);
    component.fromTime = '10:00';
    component.toTime = '11:00';
    component.selectedEvent = { id: 99, name: 'E', place: 'P', date: '' };

    component.book();
    const req = httpMock.expectOne('/api/reservations/');
    req.flush({ id: 123, status: 'OK' });
    tick();

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Reservation confirmed!',
      'Close',
      { duration: 5000 }
    );
    expect(dialogRefSpy.close).toHaveBeenCalled();
  }));

  it('Should show fallback error when backend does not provide message', fakeAsync(() => {
    spyOn(component, 'validateFields').and.returnValue(true);
    component.selectedDate = new Date(2025, 0, 1);
    component.fromTime = '10:00';
    component.toTime = '11:00';
    component.selectedEvent = {
      id: 7,
      name: 'E',
      place: 'P',
      date: '2025-01-01',
    };

    component.book();
    const req = httpMock.expectOne('/api/reservations/');
    req.flush({}, { status: 500, statusText: 'Server Error' });
    tick();

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'An unexpected error occurred.',
      'Close',
      { duration: 5000 }
    );
  }));
  it('Should handle network error gracefully', fakeAsync(() => {
    spyOn(component, 'validateFields').and.returnValue(true);
    component.selectedDate = new Date(2025, 0, 1);
    component.fromTime = '10:00';
    component.toTime = '11:00';
    component.selectedEvent = { id: 1, name: '', place: '', date: '' };

    component.book();
    const req = httpMock.expectOne('/api/reservations/');
    req.error(new ErrorEvent('Network error'));
    tick();

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'An unexpected error occurred.',
      'Close',
      { duration: 5000 }
    );
  }));
});
