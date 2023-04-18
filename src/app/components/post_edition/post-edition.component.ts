import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
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
declare var mkdirPostEdition:any;

export interface Sentences{
  sentence: string,
  pictos:string
}

@Component({
  selector: 'app-post-edition',
  templateUrl: './post-edition.component.html',
  styleUrls: ['./post-edition.component.css']
})
export class PostEditionComponent implements OnInit {

  num_sentences: number = 0;
  sentence:string = '';
  id_sentence:number = 0;
  progress_bar_style:string = '';
  sentences: Sentences[] = [];
  result:string[][] = [];
  displayResult:string[][] = [];
  resultTab:string[] = [];
  cellsToScroll:number = 4;
  wordSearch:string = '';
  banksChecked:string[] = ['arasaac'];
  wordsText: any;
  keyPicto:string[][] = [];
  dataRegisterChecked: boolean = true;
  keyDouble: boolean = false;
  is_selected:boolean = false;
  selected_image:string = '';
  double_click:boolean = false;
  index_picto_to_delete:number = 0;
  clicked:boolean = false;
  clicked_add:boolean = false;
  pictos:number[] = [];
  pictosStyles:string[] = [];
  pictosVisibility:boolean[] = [];
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
      this.resetRequest();
      this.wordSearch = this.getTextWhitoutChariot(formText.form.value.text);
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
      },numberOfWord.length * 2000);
    }
  }

  getTextWhitoutChariot(text: string){
    if (text.includes("\r") || text.includes("\n")){
      text = text.replace(/\n|\r/g,'');
      return text;
    }else {
      return text;
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
    this.clicked_add = false;
  }

  addPicto(){
    this.pictos.push(Number(this.selected_image));
    this.clicked_add = true;
    this.pictosStyles.push("");
  }

  set_width_translation_box(pictos: number[]){
    let num_pictos = pictos.length;
    return String(num_pictos * 150 + 150);
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

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.pictos, event.previousIndex, event.currentIndex);
  }

  goLoad(nameFile: string){
    let pathJsonFile = '../../../assets/' + nameFile;
    fetch(pathJsonFile).then(res => res.json()).then(jsonData => {
      this.sentences = jsonData;
      this.get_number_sentences();
      this.getPictos(this.sentences[0].pictos)
      this.pictosStyles = new Array(this.get_number_picto_in_sentence()).fill("");
      this.pictosVisibility = new Array(this.num_sentences).fill(true)
      this.pictosVisibility[0] = false
    })
  }

  getPictos(sentence_picto:string){
    this.pictos = sentence_picto.split(',').map(function(item) {
      return parseInt(item, 10)});
  }

  get_number_sentences(){
    this.num_sentences = this.sentences.length;
  }

  get_number_picto_in_sentence(){
    return this.pictos.length
  }

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

  deletePicto() {
    this.pictos.splice(this.index_picto_to_delete, 1)
    this.resetStyle()
  }

  set_progress_bar(index: number){
    let progress = index / this.num_sentences * 100;
    this.progress_bar_style = 'width: ' + progress.toString() + '%;';
    return progress.toString()
  }

  saveUsersDataToServer(index: number, sentence:string){
    let urlPictoDataSelected : string[] = JSON.parse(JSON.stringify(this.pictos));
    const data = [[sentence], [urlPictoDataSelected]];
    setDataTS(data);
    mkdirPostEdition();
  }

  goToNextTask(index: number, sentence:string, pictos:string){
    this.saveUsersDataToServer(index, sentence);
    if (index + 2 > this.num_sentences){
      this.router.navigate(['post_edition_exit']);
    }
    else{
      this.pictosVisibility.fill(true);
      this.pictosVisibility[index+1] = false;
      this.getPictos(pictos);
      this.id_sentence = index+1
      this.set_progress_bar(this.id_sentence+1);
      this.pictosStyles = new Array(this.get_number_picto_in_sentence()).fill("")
    }
  }

  quitStudy(index: number, sentence:string): void {
    this.saveUsersDataToServer(index, sentence);
    this.router.navigate(['post_edition_exit']);
  }

}
