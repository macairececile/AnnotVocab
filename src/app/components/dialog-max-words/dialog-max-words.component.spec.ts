import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMaxWordsComponent } from './dialog-max-words.component';
import {TranslateModule} from "@ngx-translate/core";

describe('DialogMaxWordsComponent', () => {
  let component: DialogMaxWordsComponent;
  let fixture: ComponentFixture<DialogMaxWordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMaxWordsComponent ],
      imports: [TranslateModule.forRoot()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMaxWordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
