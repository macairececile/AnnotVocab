import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import { TranslatePictoComponent } from './components/translate-picto/translate-picto.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IvyCarouselModule} from "angular-responsive-carousel";
import {MatInputModule} from "@angular/material/input";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {MatGridListModule} from "@angular/material/grid-list";
import { DialogMaxWordsComponent } from './components/dialog-max-words/dialog-max-words.component';
import {MatDialogModule} from "@angular/material/dialog";
import { LayoutComponent } from './components/layout/layout.component';
import {MatListModule} from "@angular/material/list";
import {MatRadioModule} from "@angular/material/radio";
import {MatExpansionModule} from "@angular/material/expansion";
import {ColorPickerModule} from "ngx-color-picker";
import {MatSelectModule} from "@angular/material/select";
import { SelectPictoComponent } from './components/select-picto/select-picto.component';
import {AppRoutingModule} from "./app-routing.module";
import { VersionComponent } from './components/version/version.component';
import {AnnotVocabComponent} from './components/annot_vocab/annot_vocab.component';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatProgressBarModule} from "@angular/material/progress-bar";
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TranslatePictoComponent,
    DialogMaxWordsComponent,
    LayoutComponent,
    SelectPictoComponent,
    VersionComponent,
    AnnotVocabComponent
  ],
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
      }
    }),
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    IvyCarouselModule,
    MatInputModule,
    HttpClientModule,
    MatGridListModule,
    MatDialogModule,
    MatListModule,
    MatRadioModule,
    MatExpansionModule,
    ColorPickerModule,
    MatSelectModule,
    AppRoutingModule,
    DragDropModule,
    MatProgressBarModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
