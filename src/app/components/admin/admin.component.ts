import { Component } from '@angular/core';

declare var getAllAnnotVocabRequest:any;
declare var getAnnotVocabRequest:any;
declare var getAllPostEditionRequest:any;
declare var getPostEditionRequest:any;

declare var removeAnnotVocabRequest:any;
declare var removePostEditionRequest:any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent{

  numberOfTry: number = 5;
  allRequests: string[][][] = [];
  getResponse: any = "";
  getRequests: boolean = false;
  showError: boolean = false;
  isAnnotVocab: boolean = false;
  isPostEdition: boolean = false;
  disableButtons: boolean = false;
  needReset: boolean = false;
  requestType: string = "";

  constructor() { }

  getAllAnnotVocabRequestFromServer(){
    if (!this.isAnnotVocab){
      this.isPostEdition = false;
      this.isAnnotVocab = true;
      this.disableButtons = true;
      this.requestType = "AnnotVocab";
      this.needReset = false;

      getAllAnnotVocabRequest();

      let tryRequest = 0;
      let requestInterval = setInterval(() => {
        if (this.getResponse == ""){
          this.getResponse = getAnnotVocabRequest();
          tryRequest++;
          if (tryRequest == this.numberOfTry){
            clearInterval(requestInterval);
            this.showError = true;
            this.disableButtons = false;
          }
        }else {
          clearInterval(requestInterval);
          this.getRequests = true;
          this.generateTabFromRequests(this.getResponse);
          this.disableButtons = false;
          if (this.needReset){
            this.getAllAnnotVocabRequestFromServer();
          }
        }
      }, 2000);
    }
  }

  getAllPostEditionRequestFromServer(){
    if (!this.isPostEdition){
      this.isPostEdition = true;
      this.isAnnotVocab = false;
      this.disableButtons = true;
      this.requestType = "PostEdition";
      this.needReset = false;

      getAllPostEditionRequest();

      let tryRequest = 0;
      let requestInterval = setInterval(() => {
        if (this.getResponse == ""){
          this.getResponse = getPostEditionRequest();
          tryRequest++;
          if (tryRequest == this.numberOfTry){
            clearInterval(requestInterval);
            this.showError = true;
            this.disableButtons = false;
          }
        }else {
          clearInterval(requestInterval);
          this.getRequests = true;
          this.generateTabFromRequests(this.getResponse);
          this.disableButtons = false;
          if (this.needReset){
            this.getAllPostEditionRequestFromServer();
          }
        }
      }, 2000);
    }
  }

  generateTabFromRequests(value: any){
    let tmpValue: any = value;
    let tmpTab: string[];
    let result: string[][][] = [];

    tmpValue = tmpValue.replace("[", "");
    tmpValue = tmpValue.replace("]", "");
    tmpValue = tmpValue.replaceAll("{", "");
    tmpValue = tmpValue.replaceAll("}", "");
    tmpValue = tmpValue.replaceAll('"', "");
    tmpTab = tmpValue.split(",");

    let tmpData: string[][] = [];
    let index: number = 0;

    for (let i=0; i<tmpTab.length; i++){
      tmpData.push(tmpTab[i].split(':'));
      if (index === 4){
        result.push(tmpData);
        tmpData = [];
        index = 0;
      }else {
        index++;
      }
    }
    this.checkForDuplicate(result);
    this.allRequests = result;
  }

  checkForDuplicate(tab: string[][][]){

    for (let i=0; i<tab.length; i++){
      for (let j=0; j<tab.length; j++){
        if (i != j){
          if (tab[i][2][1] == tab[j][2][1]){
            if (tab[i][3][1] == tab[j][3][1]){
              if (tab[i][1][1] == tab[j][1][1]){
                const nameRequest = tab[i][0][1].split(".");
                this.deleteRequest(nameRequest[0]);
                this.needReset = true;
              }else {
                const date1 = tab[i][1][1].split("/");
                const date2 = tab[j][1][1].split("/");

                if (Number(date1[2]) == Number(date2[2])){
                  if (Number(date1[1]) == Number(date2[1])){
                    if (Number(date1[0]) > Number(date2[0])){
                      const nameRequest = tab[j][0][1].split(".");
                      this.deleteRequest(nameRequest[0]);
                    }else {
                      const nameRequest = tab[i][0][1].split(".");
                      this.deleteRequest(nameRequest[0]);
                    }
                  }else {
                    if (Number(date1[1]) > Number(date2[1])){
                      const nameRequest = tab[j][0][1].split(".");
                      this.deleteRequest(nameRequest[0]);
                    }else {
                      const nameRequest = tab[i][0][1].split(".");
                      this.deleteRequest(nameRequest[0]);
                    }
                  }
                }else {
                  if (Number(date1[2]) > Number(date2[2])){
                    const nameRequest = tab[j][0][1].split(".");
                    this.deleteRequest(nameRequest[0]);
                  }else {
                    const nameRequest = tab[i][0][1].split(".");
                    this.deleteRequest(nameRequest[0]);
                  }
                }
                this.needReset = true;
              }
            }
          }
        }
      }
    }
  }

  deleteRequest(nameRequest: string){
    if (this.requestType == "AnnotVocab"){
      removeAnnotVocabRequest(nameRequest);
    }else {
      removePostEditionRequest(nameRequest);
    }
  }
}
