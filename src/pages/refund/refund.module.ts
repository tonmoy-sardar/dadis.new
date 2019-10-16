import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RefundPage } from './refund';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [
    RefundPage,
  ],
  imports: [
    IonicPageModule.forChild(RefundPage),
    CoreModule
  ],
})
export class RefundPageModule {}
