import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {SelectPictoComponent} from "./components/select-picto/select-picto.component";
import {TranslatePictoComponent} from "./components/translate-picto/translate-picto.component";
import {AnnotVocabComponent} from "./components/annot_vocab/annot_vocab.component";
import {PostEditionExitComponent} from "./components/post_edition_exit/post-edition-exit.component";
import {PostEditionComponent} from "./components/post_edition/post-edition.component";
import {PostEditionHomeComponent} from "./components/post_edition_home/post-edition-home.component";

const routes: Routes = [
  {path: 'print', component:SelectPictoComponent},
  {path: 'picto', component:TranslatePictoComponent},
  {path: 'post_edition_home', component:PostEditionHomeComponent},
  {path: 'post_edition', component:PostEditionComponent},
  {path: 'post_edition_exit', component:PostEditionExitComponent},
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
