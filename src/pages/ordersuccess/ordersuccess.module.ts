import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrdersuccessPage } from './ordersuccess';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [
    OrdersuccessPage,
  ],
  imports: [
    IonicPageModule.forChild(OrdersuccessPage),
    CoreModule
  ],
})
export class OrdersuccessPageModule {}
