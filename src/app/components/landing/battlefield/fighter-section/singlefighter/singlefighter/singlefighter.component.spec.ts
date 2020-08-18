import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglefighterComponent } from './singlefighter.component';

describe('SinglefighterComponent', () => {
  let component: SinglefighterComponent;
  let fixture: ComponentFixture<SinglefighterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SinglefighterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SinglefighterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
