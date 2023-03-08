import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPictoComponent } from './select-picto.component';

describe('SelectPictoComponent', () => {
  let component: SelectPictoComponent;
  let fixture: ComponentFixture<SelectPictoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectPictoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPictoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
