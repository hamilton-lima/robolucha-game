import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleGuardComponent } from './role-guard/role-guard.component';
import { GameBackgroundComponent } from './game-background/game-background.component';
import { RoundButtonComponent } from './round-button/round-button.component';
import { HomeButtonComponent } from './home-button/home-button.component';
import { HeaderComponent } from './header/header.component';
import { GameCardComponent } from './game-card/game-card.component';
import { BigButtonComponent } from './big-button/big-button.component';
import { MaterialAllComponentsModule } from '../material-all-components-module';
import { CodeAccordionComponent } from './code-accordion/code-accordion.component';
import { MarkDownComponent } from './mark-down/mark-down.component';
import { CodeBlocklyComponent } from './code-blockly/code-blockly.component';
import { CodeEditorComponent } from './code-editor/code-editor.component';
import { MessageComponent } from './message/message.component';
import { AceEditorModule } from 'ng2-ace-editor';
import { FileUploadComponent } from './file-upload/file-upload.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialAllComponentsModule,
    AceEditorModule,
  ],
  declarations: [
    BigButtonComponent,
    GameBackgroundComponent,
    GameCardComponent,
    HeaderComponent,
    HomeButtonComponent,
    RoleGuardComponent,
    RoundButtonComponent,
    CodeAccordionComponent,
    MarkDownComponent,
    CodeBlocklyComponent,
    CodeEditorComponent,
    MessageComponent,
    FileUploadComponent
  ],
  exports:[
    BigButtonComponent,
    GameBackgroundComponent,
    GameCardComponent,
    HeaderComponent,
    HomeButtonComponent,
    RoleGuardComponent,
    RoundButtonComponent,
    CodeAccordionComponent,
    MarkDownComponent,
    CodeBlocklyComponent,
    CodeEditorComponent,
    MessageComponent,
    FileUploadComponent
  ]
})
export class SharedModule { }
