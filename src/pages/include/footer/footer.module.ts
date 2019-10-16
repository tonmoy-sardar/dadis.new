import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FooterPage } from './footer';

import {CoreModule} from '../../../core/core.module';

@NgModule({
  declarations: [
    FooterPage,
  ],
  imports: [
    IonicPageModule.forChild(FooterPage),
    CoreModule
  ],
})
export class FooterPageModule {}
