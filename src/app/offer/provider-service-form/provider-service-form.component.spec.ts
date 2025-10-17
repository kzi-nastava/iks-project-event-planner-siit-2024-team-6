import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { ProviderServiceFormComponent } from './provider-service-form.component';

import { OfferService } from '../offer.service';
import { EventService } from '../../event/event.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProviderServiceFormComponent', () => {
  let fixture: ComponentFixture<ProviderServiceFormComponent>;
  let component: ProviderServiceFormComponent;

  // using SPY objects instead of the real ones
  let offerService: jasmine.SpyObj<OfferService>;
  let eventService: jasmine.SpyObj<EventService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let router: Router;

  beforeEach(async () => {
    // creating spy instances before every test
    offerService = jasmine.createSpyObj<OfferService>('OfferService', [
      'getAllCategories',
      'createService',
    ]);
    eventService = jasmine.createSpyObj<EventService>('EventService', [
      'getAllNames',
      'getEventTypeByName',
    ]);
    dialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    snackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

    // default stubs
    offerService.getAllCategories.and.returnValue(of(['VENUE', 'MUSIC']));
    offerService.createService.and.returnValue(of({ id: 1 } as any));
    eventService.getAllNames.and.returnValue(of(['Wedding', 'Conference']));
    eventService.getEventTypeByName.and.callFake((name: string) => of({ name } as any));

    await TestBed.configureTestingModule({
      declarations: [ProviderServiceFormComponent],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: OfferService, useValue: offerService },
        { provide: EventService, useValue: eventService },
        { provide: MatDialog, useValue: dialog },
        { provide: MatSnackBar, useValue: snackBar },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    // (dodatno osiguranje, ako nešto nadjača provide)
    TestBed.overrideProvider(OfferService, { useValue: offerService });
    TestBed.overrideProvider(EventService, { useValue: eventService });

    fixture = TestBed.createComponent(ProviderServiceFormComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);

    fixture.detectChanges(); // ngOnInit
  });

  // ===== Helperi =====
  function selectEventType(name = 'Wedding') {
    component.onEventTypeChange(name, { target: { checked: true } } as any);
    fixture.detectChanges();
  }

  function fillValidFixedForm() {
    selectEventType('Wedding');
    component.serviceForm.patchValue({
      name: 'Live Band',
      description: 'Great live band for weddings',
      price: 1000,
      discount: 0,
      durationType: 'fixed',
      duration: 60,
      minDuration: null,
      maxDuration: null,
      reservationDeadline: 24,
      cancellationDeadline: 12,
      confirmation: 'automatic',
      visibility: true,
      availability: true,
      specifics: 'PA included',
      photos: [],
      newCategory: '',
      // category postavlja fetchCategories() na 'VENUE'
    });
    component.isFixedDuration = true;
    component.toggleDurationFields();
    fixture.detectChanges();
  }

  function fillValidVariedForm() {
    selectEventType('Conference');
    component.onDurationTypeChange('varied');
    component.serviceForm.patchValue({
      name: 'Catering',
      description: 'Buffet catering',
      price: 500,
      discount: 600,
      durationType: 'varied',
      duration: null,
      minDuration: 30,
      maxDuration: 120,
      reservationDeadline: 48,
      cancellationDeadline: 24,
      confirmation: 'automatic', 
      visibility: false,
      availability: true,
      specifics: '',
      photos: [],
      newCategory: '',
    });
    fixture.detectChanges();
  }

  it('gets all categories and event types and sets default category', () => {
    expect(offerService.getAllCategories).toHaveBeenCalled();
    expect(eventService.getAllNames).toHaveBeenCalled();

    const catVal = component.serviceForm.get('category')?.value;
    expect(catVal).toBe('VENUE');
    expect(component.eventTypes).toEqual(['Wedding', 'Conference']);
  });

  it('custom validator for eventTypes: at least one must be selected', () => {
    const ctrl = component.serviceForm.get('eventTypes')!;
    expect(ctrl.errors?.['noEventTypesSelected']).toBeTrue();

    selectEventType('Wedding');
    expect(ctrl.errors).toBeNull();
  });

  it('toggels duration (fixed -> varied)', () => {
    // initial: fixed
    expect(component.isFixedDuration).toBeTrue();
    expect(component.serviceForm.get('duration')?.enabled).toBeTrue();
    expect(component.serviceForm.get('minDuration')?.disabled).toBeTrue();
    expect(component.serviceForm.get('maxDuration')?.disabled).toBeTrue();
    expect(component.serviceForm.get('confirmation')?.enabled).toBeTrue();

    component.onDurationTypeChange('varied');
    fixture.detectChanges();

    expect(component.isFixedDuration).toBeFalse();
    expect(component.serviceForm.get('duration')?.disabled).toBeTrue();
    expect(component.serviceForm.get('minDuration')?.enabled).toBeTrue();
    expect(component.serviceForm.get('maxDuration')?.enabled).toBeTrue();
    expect(component.serviceForm.get('confirmation')?.disabled).toBeTrue();
  });

  it('shows error if the form is invalid', () => {
    component.onSubmit();
    expect(offerService.createService).not.toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalled();
  });

  it('submits FIXED when valid (payload, toast, navigate)', () => {
    fillValidFixedForm();
    component.onSubmit();

    expect(eventService.getEventTypeByName).toHaveBeenCalledWith('Wedding');
    expect(offerService.createService).toHaveBeenCalledTimes(1);

    const sent = offerService.createService.calls.mostRecent().args[0];
    expect(sent).toEqual(jasmine.objectContaining({
      name: 'Live Band',
      description: 'Great live band for weddings',
      price: 1000,
      sale: 0,
      isVisible: true,
      isAvailable: true,
      type: 'Service',
      preciseDuration: 60,
      minDuration: 0,
      maxDuration: 0,
      latestReservation: 24,
      latestCancelation: 12,
      isReservationAutoApproved: true, // fixed + automatic
      category: 'VENUE',
      photos: [],
      isDeleted: false,
    }));
    expect(Array.isArray(sent.eventTypes)).toBeTrue();
    expect(sent.eventTypes[0]).toEqual(jasmine.objectContaining({ name: 'Wedding' }));

    expect(snackBar.open).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/my-services']);
  });

  it('submits VARIED and forces isReservationAutoApproved=false', () => {
    fillValidVariedForm();
    component.onSubmit();

    expect(eventService.getEventTypeByName).toHaveBeenCalledWith('Conference');
    const sent = offerService.createService.calls.mostRecent().args[0];

    expect(sent.preciseDuration).toBe(0);
    expect(sent.minDuration).toBe(30);
    expect(sent.maxDuration).toBe(120);
    expect(sent.isReservationAutoApproved).toBeFalse(); // confirmation disabled
  });

  it('show error when lookup event type breaks', () => {
    fillValidFixedForm();
    eventService.getEventTypeByName.and.returnValue(throwError(() => new Error('boom')));

    component.onSubmit();
    expect(offerService.createService).not.toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalled();
  });

  it('show error when createServce breaks', () => {
    fillValidFixedForm();
    offerService.createService.and.returnValue(throwError(() => new Error('save failed')));

    component.onSubmit();
    expect(snackBar.open).toHaveBeenCalled();
  });

  it('proposeCategory opens a dialog and saves result', () => {
    dialog.open.and.returnValue({ afterClosed: () => of({ name: 'NewCat', description: '' }) } as any);
    component.proposeCategory();
    expect(dialog.open).toHaveBeenCalled();
    expect(component.newCategory).toEqual(jasmine.objectContaining({ name: 'NewCat' }));
    expect(component.proposedCategory).toBeTrue();
  });

  it('addPhotoUrl adds new photo url and updates from', () => {
    component.addPhotoUrl('http://img/test.png');
    expect(component.photos).toContain('http://img/test.png');
    expect(component.serviceForm.get('photos')?.value).toContain('http://img/test.png');
  });

  it('removePhoto deletes the selected photo', () => {
    component.photos = ['a.png', 'b.png', 'c.png'];
    component.removePhoto(1);
    expect(component.photos).toEqual(['a.png', 'c.png']);
  });

  it('onPhotoError sets fallback src', () => {
    const img = document.createElement('img');
    img.src = 'bad.png';
    component.onPhotoError({ target: img } as any);
    expect(img.src).toContain('https://via.placeholder.com/300x200.png?text=404+Not+Found');
  });
});
