import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {LanguageService} from "../../services/language-service";
import {MatDialog} from "@angular/material/dialog";
import {DialogMaxWordsComponent} from "../dialog-max-words/dialog-max-words.component";
import {EditionService} from "../../services/edition-service";
import {SaveDataService} from "../../services/save-data.service";

declare var monitorInput:any;
declare var getUrlPicto:any;
declare var getTokensForTS:any;
declare var getKeyPicto:any;
declare var clearUrlImageJS:any;
declare var getLemmaText:any;
declare var lemmaText:any;

@Component({
  selector: 'app-translate-picto',
  templateUrl: './translate-picto.component.html',
  styleUrls: ['./translate-picto.component.css']
})
export class TranslatePictoComponent implements OnInit {

  result:string[][] = [];
  displayResult:string[][] = [];
  resultTab:string[] = [];
  cellsToScroll:number = 4;
  wordSearch:string = '';
  banksChecked:string[] = ['arasaac', 'mulberry'];
  wordsText: any;
  keyPicto:string[][] = [];
  dataRegisterChecked: boolean = true;
  keyDouble: boolean = false;
  loading: boolean = false;

  constructor(public languageService: LanguageService,
              public editionService: EditionService,
              public saveData: SaveDataService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.editionService.isSearch = false;
  }

  onSubmit(formText: NgForm) {
    if (!this.loading){
      this.loading = true;
      this.resetRequest();
      this.wordSearch = this.getTextWhitoutChariot(formText.form.value.text);
      const numberOfWord = this.wordSearch.split(' ');
      console.log(numberOfWord);
      this.editionService.wordsSearchTab = numberOfWord;
      if(numberOfWord.length > 50){
        this.openDialog();
        return;
      }
      let textLemma: string[] = [""];
      lemmaText(this.wordSearch);
      let lemmaTextInterval = setInterval(() => {
        if (textLemma[0] == ""){
          textLemma = getLemmaText();
        }else {
          clearInterval(lemmaTextInterval);
          this.getPicto(numberOfWord, textLemma);
        }
      }, 2000);
    }
  }

  getPicto(numberOfWord: string[], text: any){
    monitorInput(this.convertTextToString(text), this.languageService.languageSearch);
    setTimeout(()=> {
      this.loading = false;
      this.result = getUrlPicto();
      this.editionService.result = this.result;
      this.keyPicto = getKeyPicto();
      for (let i=0; i<this.result.length; i = i+1){
        this.result[i].forEach(value => {
          const tabValue = value.split('/');
          if(this.banksChecked.includes(tabValue[5])){
            this.resultTab.push(value);
          }
        });
        this.displayResult.push(this.resultTab);
        this.resultTab = [];
      }
      this.wordsText = getTokensForTS();
      this.editionService.wordsText = this.wordsText;
      this.editionService.wordsTextSave = JSON.parse(JSON.stringify(this.wordsText));
      this.editionService.isSearch = true;
      if(this.dataRegisterChecked){
        this.saveData.dataRegisterChecked = true;
        this.saveData.addDataSearched(this.editionService.wordsText);
      }else{
        this.saveData.dataRegisterChecked = false;
      }
      numberOfWord.forEach(word => {
        this.editionService.imageSelected.push('null');
      });
      this.duplicateCaseKey(this.keyPicto);
    },numberOfWord.length * 3000);
  }

  convertTextToString(text: any){
    text = text.replace("[", "");
    text = text.replace("]", "");
    text = text.replaceAll("'", "");
    text = text.replace(',', "");
    text = this.getTextWhitoutChariot(text);
    console.log(text.split(" "));
    return text;
  }

  getTextWhitoutChariot(text: string){
    if (text.includes("\r") || text.includes("\n")){
      text = text.replace(/\n|\r/g,'');
      return text;
    }else {
      return text;
    }
  }

  chooseBank(arasaac: HTMLInputElement, mulberry: HTMLInputElement) {
    if(!arasaac.checked){
      this.banksChecked = this.banksChecked.filter((bank) => bank != arasaac.value);
    }
    if(!mulberry.checked){
      this.banksChecked = this.banksChecked.filter((bank) => bank != mulberry.value);
    }
    if(arasaac.checked){
      this.banksChecked.push(arasaac.value);
    }
    if(mulberry.checked){
      this.banksChecked.push(mulberry.value);
    }
  }

  resetRequest(){
    clearUrlImageJS();
    this.result = [];
    this.result.length = 0;
    this.editionService.result = [];
    this.editionService.imageSelected = [];
    this.displayResult = [];
    this.displayResult.length = 0;
    this.keyPicto.length = 0;
    this.wordSearch = '';
    this.keyDouble = false;
  }

  Download( url: any, filename: any ) {
    let setFetching = false;
    let setError = false;

    const download = (url: RequestInfo, name: string | any[]) => {
      if (!url) {
        throw new Error("Resource URL not provided! You need to provide one");
      }
      setFetching =true;
      fetch(url)
        .then(response => response.blob())
        .then(blob => {
          setFetching =false;
          const blobURL = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = blobURL;

          if (name && name.length) if (typeof name === "string") {
            a.download = name;
          }
          document.body.appendChild(a);
          a.click();
        })
        .catch(() => setError = true);
    };

    download(url,filename);
  }

  openDialog(){
    this.dialog.open(DialogMaxWordsComponent, {
      height: '20%',
      width: '30%',
    });
  }

  erase() {
    (<HTMLInputElement>document.getElementById("sentence-input")).value = "";
  }

  select(image: string,index: number) {
    this.editionService.imageSelected[index] = image;
  }

  dataRegister(data: HTMLInputElement) {
    this.dataRegisterChecked = data.checked;
  }

  replaceAllElem (text:string) {
    while (text.includes("e")){
      text = text.replace("e", "");
    }
    return text;
  }
  //duplication par clé
  duplicateCaseKey(keys :string[][]){
    this.keyDoublon(keys);
    keys.forEach((listKeys,indexListKeys) => {
      listKeys = [...new Set(listKeys)];
      //delete all "e" in keys
      listKeys.forEach((key,indexKey) => {
        listKeys[indexKey] = this.replaceAllElem(key);
      });
      listKeys.forEach((key) => {
        const allKeys = key.split('-');
        // we don't want to do something about the first key
        let first = true
        allKeys.forEach((keySplited) => {
          const index = Number(keySplited);
          let indexForResult = listKeys.indexOf(keySplited);
          if(indexListKeys-1 > 0){
            if(listKeys[0].includes('-') && keys[indexListKeys-1][0][0] === listKeys[0][0]){
              indexForResult = 0;
            }
          }
          if(!first && indexForResult === -1){
            this.displayResult.splice(index,0,this.displayResult[Number(allKeys[0])]);
            this.result.splice(index,0,this.result[Number(allKeys[0])]);
          }else{
            first = false;
          }
          });
      });
    });
  }

  private keyDoublon(keys: string[][]) {
    let indexToDeleteInUrlArray: number[] = [];
    keys.forEach((key,indexDoubleKey) => {
      if(key[0].includes('-')){
        const splitKey = key[0].split('-');
        splitKey.forEach(keySplited => {
          keys.forEach((keytab, indexKeytab) => {
            const indexForResult = keytab.indexOf(keySplited);
            if(indexForResult !== -1){
              indexToDeleteInUrlArray.push(indexDoubleKey);
              this.displayResult[indexDoubleKey].forEach(url => {
                this.displayResult[indexKeytab].push(url);
                this.result[indexKeytab].push(url);
              });
            }
          });
        });
      }
    });
    indexToDeleteInUrlArray = [... new Set(indexToDeleteInUrlArray)];
    //reverse because if we delete first element, the other will be at the wrong index
    indexToDeleteInUrlArray.reverse();
    indexToDeleteInUrlArray.forEach(index => {
      this.result.splice(index,1);
      this.displayResult.splice(index,1);
    });
  }
}
