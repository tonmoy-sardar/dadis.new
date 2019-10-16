import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyprofilePage } from './myprofile';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [
    MyprofilePage,
  ],
  imports: [
    IonicPageModule.forChild(MyprofilePage),
    CoreModule
  ],
})
export class MyprofilePageModule {}
