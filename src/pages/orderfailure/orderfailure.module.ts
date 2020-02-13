import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderfailurePage } from './orderfailure';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [
    OrderfailurePage,
  ],
  imports: [
    IonicPageModule.forChild(OrderfailurePage),
    CoreModule
  ],
})
export class OrderfailurePageModule {}
