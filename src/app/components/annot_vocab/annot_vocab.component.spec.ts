import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Annot_vocabComponent } from './annot_vocab.component';
import {TranslateModule} from "@ngx-translate/core";
import {MatDialogModule} from "@angular/material/dialog";
import {RouterTestingModule} from "@angular/router/testing";

describe('PostEditionComponent', () => {
  let component: Annot_vocabComponent;
  let fixture: ComponentFixture<Annot_vocabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Annot_vocabComponent ],
      imports: [RouterTestingModule, TranslateModule.forRoot(), MatDialogModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Annot_vocabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
