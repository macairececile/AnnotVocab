import { Component, OnInit } from '@angular/core';
import {timeInterval} from "rxjs/operators";

declare var getAllAnnotVocabRequest:any;
declare var getAnnotVocabRequest:any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  numberOfTry: number = 5;
  allRequestsAnnotVocab: string[][][] = [];
  getResponse: any = "";
  getRequests: boolean = false;
  showError: boolean = false;

  constructor() { }

  ngOnInit(): void {
    getAllAnnotVocabRequest();

    let tryRequest = 0;
    let requestInterval = setInterval(() => {
      if (this.getResponse == ""){
        this.getResponse = getAnnotVocabRequest();
        tryRequest++;
        if (tryRequest == this.numberOfTry){
          clearInterval(requestInterval);
          this.showError = true;
        }
      }else {
        clearInterval(requestInterval);
        this.getRequests = true;
        this.generateTabFromRequests(this.getResponse);
      }
    }, 2000);
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
    this.allRequestsAnnotVocab = result;
  }
}
