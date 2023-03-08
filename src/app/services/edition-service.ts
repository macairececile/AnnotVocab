import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditionService {

  constructor() { }

  wordsSearchTab: string[] = [];

  bottomTop: string = "bottom";
  location: string = "dans";

  isSearch:boolean = false;

  transformationValue: string = 'aucun';

  result:string[][] = [];

  wordsText: any[] = [];
  wordsTextSave: any[] = [];

  imageSelected:string[] = [];

  numberOfCols:number = 2;

  police:string = 'Arial';

  policeColor:string = '#d3d3d3';

  policeSize:number = 16;

  curentBorderColor:string = 'black';

  typeOfBorder:string = 'solid';

  borderSize:number = 5;

}
