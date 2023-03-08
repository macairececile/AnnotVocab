import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostEditionComponent } from './post-edition.component';
import {TranslateModule} from "@ngx-translate/core";
import {MatDialogModule} from "@angular/material/dialog";
import {RouterTestingModule} from "@angular/router/testing";

describe('PostEditionComponent', () => {
  let component: PostEditionComponent;
  let fixture: ComponentFixture<PostEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostEditionComponent ],
      imports: [RouterTestingModule, TranslateModule.forRoot(), MatDialogModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
