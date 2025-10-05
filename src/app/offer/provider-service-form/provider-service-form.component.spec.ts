// provider-service-form.component.spec.ts
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { ProviderServiceFormComponent } from './provider-service-form.component';

// VAŽNO: iste putanje kao u komponenti
import { OfferService } from '../offer.service';
import { EventService } from '../../event/event.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProviderServiceFormComponent', () => {
  let fixture: ComponentFixture<ProviderServiceFormComponent>;
  let component: ProviderServiceFormComponent;

  // koristimo SPY objekte umesto pravih servisa
  let offerService: jasmine.SpyObj<OfferService>;
  let eventService: jasmine.SpyObj<EventService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let router: Router;

  beforeEach(async () => {
    // napravimo spy instance pre TestBed-a
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

    // default stubovi
    offerService.getAllCategories.and.returnValue(of(['VENUE', 'MUSIC']));
    // kast na any da utišamo tip razliku u testu
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
      discount: 50,
      durationType: 'varied',
      duration: null,
      minDuration: 30,
      maxDuration: 120,
      reservationDeadline: 48,
      cancellationDeadline: 24,
      confirmation: 'automatic', // ignorisano (disabled) pod 'varied'
      visibility: false,
      availability: true,
      specifics: '',
      photos: [],
      newCategory: '',
    });
    fixture.detectChanges();
  }

  // ===== Testovi =====
  it('učitava kategorije i tipove događaja i postavlja podrazumevanu kategoriju', () => {
    expect(offerService.getAllCategories).toHaveBeenCalled();
    expect(eventService.getAllNames).toHaveBeenCalled();

    const catVal = component.serviceForm.get('category')?.value;
    expect(catVal).toBe('VENUE');
    expect(component.eventTypes).toEqual(['Wedding', 'Conference']);
  });

  it('custom validator za eventTypes: zahteva bar jedan izabran', () => {
    const ctrl = component.serviceForm.get('eventTypes')!;
    expect(ctrl.errors?.['noEventTypesSelected']).toBeTrue();

    selectEventType('Wedding');
    expect(ctrl.errors).toBeNull();
  });

  it('toggling trajanja radi (fixed -> varied)', () => {
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

  it('ne submituje ako forma nije validna (prikaže grešku)', () => {
    component.onSubmit();
    expect(offerService.createService).not.toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalled();
  });

  it('submituje za FIXED kada je validno (payload, toast, navigate)', () => {
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

  it('submituje za VARIED i forsira isReservationAutoApproved=false', () => {
    fillValidVariedForm();
    component.onSubmit();

    expect(eventService.getEventTypeByName).toHaveBeenCalledWith('Conference');
    const sent = offerService.createService.calls.mostRecent().args[0];

    expect(sent.preciseDuration).toBe(0);
    expect(sent.minDuration).toBe(30);
    expect(sent.maxDuration).toBe(120);
    expect(sent.isReservationAutoApproved).toBeFalse(); // confirmation disabled
  });

  it('prikaže grešku kada lookup event type padne', () => {
    fillValidFixedForm();
    eventService.getEventTypeByName.and.returnValue(throwError(() => new Error('boom')));

    component.onSubmit();
    expect(offerService.createService).not.toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalled();
  });

  it('prikaže grešku kada createService padne', () => {
    fillValidFixedForm();
    offerService.createService.and.returnValue(throwError(() => new Error('save failed')));

    component.onSubmit();
    expect(snackBar.open).toHaveBeenCalled();
  });

  it('proposeCategory otvara dijalog i čuva rezultat', () => {
    dialog.open.and.returnValue({ afterClosed: () => of({ name: 'NewCat', description: '' }) } as any);
    component.proposeCategory();
    expect(dialog.open).toHaveBeenCalled();
    expect(component.newCategory).toEqual(jasmine.objectContaining({ name: 'NewCat' }));
    expect(component.proposedCategory).toBeTrue();
  });

  it('addPhotoUrl gura url i ažurira form control', () => {
    component.addPhotoUrl('http://img/test.png');
    expect(component.photos).toContain('http://img/test.png');
    expect(component.serviceForm.get('photos')?.value).toContain('http://img/test.png');
  });

  it('removePhoto briše odgovarajuću fotku', () => {
    component.photos = ['a.png', 'b.png', 'c.png'];
    component.removePhoto(1);
    expect(component.photos).toEqual(['a.png', 'c.png']);
  });

  it('onPhotoError postavlja fallback src', () => {
    const img = document.createElement('img');
    img.src = 'bad.png';
    component.onPhotoError({ target: img } as any);
    expect(img.src).toContain('https://via.placeholder.com/300x200.png?text=404+Not+Found');
  });
});
