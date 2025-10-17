import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

import { ProviderServiceFormComponent } from './provider-service-form.component';

import { OfferService } from '../offer.service';
import { EventService } from '../../event/event.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

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
      ],
      providers: [
        { provide: OfferService, useValue: offerService },
        { provide: EventService, useValue: eventService },
        { provide: MatDialog, useValue: dialog },
        { provide: MatSnackBar, useValue: snackBar },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderServiceFormComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);

    fixture.detectChanges(); // ngOnInit
  });

  function selectEventType(name = 'Wedding') {
    component.onEventTypeChange(name, { target: { checked: true } } as any);
    fixture.detectChanges();
  }

  function fillValidFixedForm() {
    selectEventType('Wedding');
    component.onDurationTypeChange('fixed');
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
      category: 'VENUE', 
    });
    component.serviceForm.updateValueAndValidity({ emitEvent: false });
    fixture.detectChanges();
  }

  function fillValidVariedForm() {
    selectEventType('Conference');
    component.onDurationTypeChange('varied');
    component.serviceForm.patchValue({
      name: 'Catering',
      description: 'Buffet catering',
      price: 500,
      discount: 50,
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
      category: 'VENUE', 
    });
    component.serviceForm.updateValueAndValidity({ emitEvent: false });
    fixture.detectChanges();
  }

  it('gets all categories and event types; category starts empty and required', () => {
    expect(offerService.getAllCategories).toHaveBeenCalled();
    expect(eventService.getAllNames).toHaveBeenCalled();

    const catCtrl = component.serviceForm.get('category')!;
    expect(catCtrl.value).toBe(''); // placeholder (empty)
    expect(catCtrl.hasError('required')).toBeTrue(); // explicit choice required
    expect(component.eventTypes).toEqual(['Wedding', 'Conference']);
  });

  it('custom validator for eventTypes: at least one must be selected', () => {
    const ctrl = component.serviceForm.get('eventTypes')!;
    expect(ctrl.errors?.['noEventTypesSelected']).toBeTrue();

    selectEventType('Wedding');
    expect(ctrl.errors).toBeNull();
  });

  it('toggles duration (fixed -> varied)', () => {
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

  it('when newCategory is proposed, DTO includes categorySuggestion and category remains null', () => {
    fillValidFixedForm();

    // simulate category proposing
    component.newCategory = { name: 'CustomCat', description: '' } as any;
    component.proposedCategory = true;
    component.serviceForm.patchValue({ newCategory: 'CustomCat', category: null });
    
    component['updateCategoryValidation']?.();
    component.serviceForm.updateValueAndValidity({ emitEvent: false });
    fixture.detectChanges();

    component.onSubmit();

    const sent = offerService.createService.calls.mostRecent().args[0];
    expect(sent.category).toBeNull(); // default is null when proposing
    expect(sent.categorySuggestion).toEqual(jasmine.objectContaining({ name: 'CustomCat' }));
  });

  it('addPhotoUrl adds new photo url and updates form', () => {
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

  it('is invalid when discount > price', () => {
    fillValidFixedForm();
    component.serviceForm.patchValue({ price: 100, discount: 150 });
    component.serviceForm.updateValueAndValidity({ emitEvent: false });
    fixture.detectChanges();

    expect(component.serviceForm.invalid).toBeTrue();
    component.onSubmit();
    expect(offerService.createService).not.toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalled();
  });

  it('is invalid in VARIED mode when minDuration > maxDuration', () => {
    fillValidVariedForm();
    component.serviceForm.patchValue({ minDuration: 200, maxDuration: 120 });
    component.serviceForm.updateValueAndValidity({ emitEvent: false });
    fixture.detectChanges();

    expect(component.serviceForm.invalid).toBeTrue();
    component.onSubmit();
    expect(offerService.createService).not.toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalled();
  });

  it('includes multiple selected event types in the payload', () => {
    fillValidFixedForm();
    selectEventType('Conference'); // second event type
    component.serviceForm.updateValueAndValidity({ emitEvent: false });
    fixture.detectChanges();

    component.onSubmit();

    const sent = offerService.createService.calls.mostRecent().args[0];
    const names = sent.eventTypes.map((et: any) => et.name);
    expect(names).toContain('Wedding');
    expect(names).toContain('Conference');
  });

  it('the form is invalid without the name', () => {
    fillValidFixedForm();
    component.serviceForm.patchValue({ name: null });
    component.serviceForm.updateValueAndValidity({ emitEvent: false });
    component.onSubmit();
    expect(offerService.createService).not.toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalled();
  });

  it('the form is invalid without a description', () => {
    fillValidFixedForm();
    component.serviceForm.patchValue({ description: null });
    component.serviceForm.updateValueAndValidity({ emitEvent: false });
    component.onSubmit();
    expect(offerService.createService).not.toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalled();
  });

  it('price=0 is invalid', () => {
    fillValidFixedForm();
    component.serviceForm.patchValue({ price: 0 });
    component.serviceForm.updateValueAndValidity({ emitEvent: false });
    expect(component.serviceForm.invalid).toBeTrue();
    component.onSubmit();
    expect(offerService.createService).not.toHaveBeenCalled();
  });

  it('in FIXED mode duration=0 is invalid', () => {
    fillValidFixedForm();
    component.serviceForm.patchValue({ duration: 0 });
    component.serviceForm.updateValueAndValidity({ emitEvent: false });
    expect(component.serviceForm.invalid).toBeTrue();
  });

  it('reservationDeadline=0 is invalid', () => {
    fillValidFixedForm();
    component.serviceForm.patchValue({ reservationDeadline: 0 });
    component.serviceForm.updateValueAndValidity({ emitEvent: false });
    expect(component.serviceForm.invalid).toBeTrue();
  });

  it('cancellationDeadline=0 is invalid', () => {
    fillValidFixedForm();
    component.serviceForm.patchValue({ cancellationDeadline: 0 });
    component.serviceForm.updateValueAndValidity({ emitEvent: false });
    expect(component.serviceForm.invalid).toBeTrue();
  });

  it('in FIXED mode with manual confirmation, auto-approve is false', () => {
    fillValidFixedForm();
    component.serviceForm.patchValue({ confirmation: 'manual' });
    component.serviceForm.updateValueAndValidity({ emitEvent: false });
    component.onSubmit();
    const sent = offerService.createService.calls.mostRecent().args[0];
    expect(sent.isReservationAutoApproved).toBeFalse();
  });

  it('from VARIED to FIXED remove min>max error and validates to true', () => {
    fillValidVariedForm();
    component.serviceForm.patchValue({ minDuration: 200, maxDuration: 120 });
    component.serviceForm.updateValueAndValidity({ emitEvent: false });
    expect(component.serviceForm.hasError('minGreaterThanMax')).toBeTrue();

    component.onDurationTypeChange('fixed');
    component.serviceForm.patchValue({ duration: 60 });
    component.serviceForm.updateValueAndValidity({ emitEvent: false });

    expect(component.isFixedDuration).toBeTrue();
    expect(component.serviceForm.hasError('minGreaterThanMax')).toBeFalse();
    expect(component.serviceForm.valid).toBeTrue();
  });

  it('goBack navigates to /my-services', () => {
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/my-services']);
  });

  it('DTO contains exactly the remaining photos after removing some', () => {
    fillValidFixedForm();
    component.addPhotoUrl('http://a.png');
    component.addPhotoUrl('http://b.png');
    component.removePhoto(0); // remove 'a.png'

    component.onSubmit();
    const sent = offerService.createService.calls.mostRecent().args[0];
    expect(sent.photos).toEqual(['http://b.png']);
  });

  it('when discount is not given (null), the sale field in DTO is null', () => {
    fillValidFixedForm();
    component.serviceForm.patchValue({ discount: null });
    component.serviceForm.updateValueAndValidity({ emitEvent: false });

    component.onSubmit();
    const sent = offerService.createService.calls.mostRecent().args[0];
    expect(sent.sale).toBeNull(); 
  });

  it('shows error when no category is selected and no category is proposed', () => {
    component.proposedCategory = false; 
    const categoryCtrl = component.serviceForm.get('category')!;
    categoryCtrl.setValue(''); 
    categoryCtrl.markAsTouched(); 

    component.serviceForm.updateValueAndValidity({ emitEvent: false });
    fixture.detectChanges();

    expect(categoryCtrl.hasError('required')).toBeTrue();
    expect(component.proposedCategory).toBeFalse();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const errMsg = compiled.querySelector('.error-message');
    expect(errMsg?.textContent).toContain('You must either select a category or propose a new one');
  });

});
