import { ComponentFixture, TestBed } from '@angular/core/testing';

import {AnnotVocabComponent} from "./annot_vocab.component";
import {TranslateModule} from "@ngx-translate/core";
import {MatDialogModule} from "@angular/material/dialog";
import {RouterTestingModule} from "@angular/router/testing";

describe('PostEditionComponent', () => {
  let component: AnnotVocabComponent;
  let fixture: ComponentFixture<AnnotVocabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnotVocabComponent ],
      imports: [RouterTestingModule, TranslateModule.forRoot(), MatDialogModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotVocabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
