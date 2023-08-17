import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonatedListComponent } from './donated-list.component';

describe('DonatedListComponent', () => {
  let component: DonatedListComponent;
  let fixture: ComponentFixture<DonatedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonatedListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonatedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
