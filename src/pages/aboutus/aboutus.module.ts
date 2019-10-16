import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AboutusPage } from './aboutus';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [
    AboutusPage,
  ],
  imports: [
    IonicPageModule.forChild(AboutusPage),
    CoreModule
  ],
})
export class AboutusPageModule {}
