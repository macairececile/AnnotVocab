import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslatePictoComponent } from './translate-picto.component';
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";

describe('TranslatePictoComponent', () => {
  let component: TranslatePictoComponent;
  let fixture: ComponentFixture<TranslatePictoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranslatePictoComponent ],
      imports: [FormsModule, TranslateModule.forRoot(), MatDialogModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslatePictoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
