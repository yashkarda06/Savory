import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WasteTrackingComponent } from './waste-tracking.component';

describe('WasteTrackingComponent', () => {
  let component: WasteTrackingComponent;
  let fixture: ComponentFixture<WasteTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WasteTrackingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WasteTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
