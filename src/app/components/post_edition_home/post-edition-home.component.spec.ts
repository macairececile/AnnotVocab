import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostEditionHomeComponent } from './post-edition-home.component';
import {RouterTestingModule} from "@angular/router/testing";

describe('PostEditionHomeComponent', () => {
  let component: PostEditionHomeComponent;
  let fixture: ComponentFixture<PostEditionHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostEditionHomeComponent ],
      imports: [RouterTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostEditionHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
