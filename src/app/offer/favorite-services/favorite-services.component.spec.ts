import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteServicesComponent } from './favorite-services.component';

describe('FavoriteServicesComponent', () => {
  let component: FavoriteServicesComponent;
  let fixture: ComponentFixture<FavoriteServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FavoriteServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoriteServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
