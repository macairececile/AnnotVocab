import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {EditionService} from "../../services/edition-service";
import {LanguageService} from "../../services/language-service";
import {SaveDataService} from "../../services/save-data.service";
import {MatDialog} from "@angular/material/dialog";
import {NgForm} from "@angular/forms";
import {DialogMaxWordsComponent} from "../dialog-max-words/dialog-max-words.component";

declare var monitorInput:any;
declare var getUrlPicto:any;
declare var getTokensForTS:any;
declare var getKeyPicto:any;
declare var clearUrlImageJS:any;
declare var setDataTS:any;
declare var mkdirAnnotVocab:any;

export interface Sentences{
  sentence: string,
  pictos:string
}

@Component({
  selector: 'app-post-edition',
  templateUrl: './annot_vocab.component.html',
  styleUrls: ['./annot_vocab.component.css']
})
export class AnnotVocabComponent implements OnInit {

  num_sentences: number = 0;
  sentence:string = '';
  progress_bar_style:string = '';
  sentences: Sentences[] = [];
  result:string[][] = [];
  displayResult:string[][] = [];
  resultTab:string[] = [];
  wordSearch:string = '';
  banksChecked:string[] = ['arasaac'];
  wordsText: any;
  keyPicto:string[][] = [];
  dataRegisterChecked: boolean = true;
  keyDouble: boolean = false;
  is_selected:boolean = false;
  selected_image:string = '';
  selected_image_with_url:string = '';
  double_click:boolean = false;
  index_picto_to_delete:number = 0;
  clicked:boolean = false;
  clicked_add:boolean = false;
  picto:number = 0;
  pictosStyles:string[] = [];
  pictosVisibility:boolean[] = [];
  text:string = '';
  loading: boolean = false;

  constructor(public languageService: LanguageService,
              public editionService: EditionService,
              public saveData: SaveDataService,
              public dialog: MatDialog,
              private router: Router) { }

  ngOnInit(): void {
    this.editionService.isSearch = false;
    this.goLoad("sentences.json");
  }

  onSubmit(formText: NgForm) {
    if (!this.loading){
      this.loading = true;
      this.clicked_add = false;
      this.resetRequest();
      this.wordSearch = formText.form.value.text;
      const numberOfWord = this.wordSearch.split(' ');
      this.editionService.wordsSearchTab = numberOfWord;
      if(numberOfWord.length > 50){
        this.openDialog();
        return;
      }
      monitorInput(this.wordSearch, this.languageService.languageSearch);
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
      },1000);
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
    this.is_selected = true;
    let tabImage: any[] = image.split('/')
    this.selected_image = tabImage[tabImage.length - 1];
    this.selected_image_with_url = image;
    this.clicked_add = false;
  }

  addPicto(){
    this.picto = Number(this.selected_image);
    this.text = this.wordsText[0].text;
    this.clicked_add = true;
    this.pictosStyles.push("");
    this.saveUsersDataToServer(this.selected_image, this.text)
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

  goLoad(nameFile: string){
    let pathJsonFile = '../../../assets/' + nameFile;
    fetch(pathJsonFile).then(res => res.json()).then(jsonData => {
      this.sentences = jsonData;
      this.get_number_sentences();
      // this.getPictos(this.sentences[0].pictos)
      // this.pictosStyles = new Array(this.get_number_picto_in_sentence()).fill("");
      this.pictosVisibility = new Array(this.num_sentences).fill(true)
      this.pictosVisibility[0] = false
    })
  }

/*  getPictos(sentence_picto:string){
    this.pictos = sentence_picto.split(',').map(function(item) {
      return parseInt(item, 10)});
  }*/

  get_number_sentences(){
    this.num_sentences = this.sentences.length;
  }

/*  get_number_picto_in_sentence(){
    return this.pictos.length
  }*/

  doubleClick(index_picto:number) {
    this.clicked = false
    this.double_click = true
    this.index_picto_to_delete = index_picto

    if (this.pictosStyles[index_picto] === "") {
      this.resetStyle();
      this.pictosStyles[index_picto] = 'border: 5px solid #555;';
    }else {
      this.pictosStyles[index_picto]= "";
    }
  }

  resetStyle(){
    this.pictosStyles.fill("");
  }

  saveUsersDataToServer(index: string, text:string){
    const data = [[text], [index]];
    setDataTS(data);
    mkdirAnnotVocab();
  }

}
