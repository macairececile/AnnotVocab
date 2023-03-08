import { Component, OnInit } from '@angular/core';
import {EditionService} from "../../services/edition-service";
import {MatRadioButton} from "@angular/material/radio";
import {Router} from "@angular/router";
import {MatExpansionPanel} from "@angular/material/expansion";
import {SaveDataService} from "../../services/save-data.service";
declare var mkdirJ:any;
declare var setDataTS:any;

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  numberOfCols: number = 2;
  police: string = 'Arial';
  defaultPoliceSize: number = 16;
  defaultBorderSize: number = 5;
  typeOfBorder: string = 'solid';
  policeSize: string = "16";
  borderSize: string = "5";
  transformationValue: string = "aucun";
  location: string = "dans";
  bottomTop:string = "bottom"

  constructor(public editionService: EditionService,
              public saveDataService: SaveDataService,
              public router: Router) { }

  ngOnInit(): void {
    this.reset();
  }

  generatePDF() {
    // recuperation de toutes les valeurs que j'aurai besoin pour la génération de PDF ou création du picto
    this.editionService.policeSize = Number(this.policeSize);
    this.editionService.police = this.police;
    this.editionService.typeOfBorder = this.typeOfBorder;
    this.editionService.borderSize = Number(this.borderSize);
    this.editionService.location = this.location;
    if(this.saveDataService.dataRegisterChecked){
      this.sendUsersDataToServer();
    }
    this.router.navigate(['/print']);
  }

  replaceAll(text: any){
    while (text.includes("/")){
      text = text.replace("/", "_")
    }
    return text;
  }

  transformation(buton: MatRadioButton) {
    this.transformationValue = buton.value;
    this.editionService.transformationValue = this.transformationValue;
    switch (this.transformationValue){
      case 'aucun':
        this.editionService.wordsText = JSON.parse(JSON.stringify(this.editionService.wordsTextSave));
        break;
      case 'minuscule':
        this.editionService.wordsText.forEach(list => {list.text = list.text.toLowerCase()});
        break;
      case 'majuscule':
        this.editionService.wordsText.forEach(list => {list.text = list.text.toUpperCase()});
        break;
      case 'capitale':
        break;
      default:
        break;
    }
  }

  numberOfPictoPerLines(buton: MatRadioButton) {
    this.numberOfCols = Number(buton.value);
    this.editionService.numberOfCols = this.numberOfCols;
  }

  wordLocation(buton: MatRadioButton) {
    this.location = buton.value;
    this.editionService.location = this.location;
  }
  wordBottomTop(buton: MatRadioButton) {
    this.bottomTop = buton.value;
    this.editionService.bottomTop = this.bottomTop;
  }

  reset(){
    this.numberOfCols = 2;
    this.police = 'Arial';
    this.typeOfBorder = 'solid';
    this.policeSize = "16";
    this.borderSize = "5";
    this.transformationValue = "aucun";
    this.location = "dans";
  }

  scrollToBottom(expansionPanel: MatExpansionPanel){
    let goTo = document.getElementById(expansionPanel.id);
    // @ts-ignore
    goTo.scrollIntoView(true);
  }

  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        this.editionService.imageSelected[index] = reader.result;
      }
    };

    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  }

  private sendUsersDataToServer() {
    let urlPictoDataSelected : string[] = JSON.parse(JSON.stringify(this.editionService.imageSelected));
    urlPictoDataSelected.forEach((url,index) => {
      if(urlPictoDataSelected[index] == null || urlPictoDataSelected[index].length > 100){
        urlPictoDataSelected[index] = "null";
      }
      else{
        urlPictoDataSelected[index] = this.replaceAll(url);
      }
    });
    let words: string[] = [];
    let synsets: string[] = [];
    this.editionService.wordsText.forEach(word => {
      words.push(word.text);
      synsets.push(word.synsets[0]);
    })
    const data = [words, synsets, urlPictoDataSelected];
    setDataTS(data);
    mkdirJ();
  }
}
