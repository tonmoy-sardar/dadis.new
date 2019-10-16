import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactusPage } from './contactus';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [
    ContactusPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactusPage),
    CoreModule
  ],
})
export class ContactusPageModule {}
