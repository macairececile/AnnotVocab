import { Component, OnInit } from '@angular/core';
import {LanguageService} from "../../services/language-service";

@Component({
  selector: 'app-dialog-max-words',
  templateUrl: './dialog-max-words.component.html',
  styleUrls: ['./dialog-max-words.component.css']
})
export class DialogMaxWordsComponent implements OnInit {

  constructor(public languageService: LanguageService) { }

  ngOnInit(): void {
  }

}
