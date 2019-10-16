import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderdetailsPage } from './orderdetails';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [
    OrderdetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderdetailsPage),
    CoreModule
  ],
})
export class OrderdetailsPageModule {}
