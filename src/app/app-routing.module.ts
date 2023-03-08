import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {SelectPictoComponent} from "./components/select-picto/select-picto.component";
import {TranslatePictoComponent} from "./components/translate-picto/translate-picto.component";
import {AnnotVocabComponent} from "./components/annot_vocab/annot_vocab.component";

const routes: Routes = [
  {path: 'print', component:SelectPictoComponent},
  {path: 'picto', component:TranslatePictoComponent},
  {path: 'annot_vocab', component:AnnotVocabComponent},
  {path: '', redirectTo:'picto', pathMatch: 'full'}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {useHash: true})
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
