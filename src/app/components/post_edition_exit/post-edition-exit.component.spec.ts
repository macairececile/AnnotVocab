import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostEditionExitComponent } from './post-edition-exit.component';

describe('PostEditionExitComponent', () => {
  let component: PostEditionExitComponent;
  let fixture: ComponentFixture<PostEditionExitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostEditionExitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostEditionExitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
