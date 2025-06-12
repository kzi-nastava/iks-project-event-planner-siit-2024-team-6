import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesCenterComponent } from './messages-center.component';

describe('MessagesCenterComponent', () => {
  let component: MessagesCenterComponent;
  let fixture: ComponentFixture<MessagesCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessagesCenterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagesCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
