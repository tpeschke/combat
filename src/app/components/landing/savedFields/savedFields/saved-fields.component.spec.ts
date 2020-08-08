import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedFieldsComponent } from './saved-fields.component';

describe('SavedFieldsComponent', () => {
  let component: SavedFieldsComponent;
  let fixture: ComponentFixture<SavedFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
