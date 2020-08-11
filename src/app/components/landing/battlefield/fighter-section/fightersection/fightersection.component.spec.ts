import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FightersectionComponent } from './fightersection.component';

describe('FightersectionComponent', () => {
  let component: FightersectionComponent;
  let fixture: ComponentFixture<FightersectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FightersectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FightersectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
