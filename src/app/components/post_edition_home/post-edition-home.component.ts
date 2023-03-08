import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-post-edition-home',
  templateUrl: './post-edition-home.component.html',
  styleUrls: ['./post-edition-home.component.css']
})
export class PostEditionHomeComponent implements OnInit {

  is_checked: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToPage(): void {
    if(this.is_checked) {
      this.router.navigate(['post_edition']);
    }
  };

  toggleEditable(event: Event) {
    // @ts-ignore
    if (event.target.checked) {
      this.is_checked = true;
    }
  }

}
