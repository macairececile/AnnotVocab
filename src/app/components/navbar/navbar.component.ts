import { Component, OnInit } from '@angular/core';
import {GetIconServiceService} from "../../services/get-icon-service.service";
import {LanguageService} from "../../services/language-service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  language:string = "FR";

  constructor(public getIconService: GetIconServiceService,
              public languageService: LanguageService) { }

  ngOnInit(): void {
  }

  closeWindow(){
    window.close();
  }

  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

  switchLanguage() {
    if(this.language === "FR"){
      this.language = "EN";
      this.languageService.languageSearch = "eng";
    }
    else{
      this.language = "FR";
      this.languageService.languageSearch = "fra";
    }
    this.languageService.switchLanguage(this.language);
  }
}
