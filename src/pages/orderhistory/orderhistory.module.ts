import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderhistoryPage } from './orderhistory';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [
    OrderhistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderhistoryPage),
    CoreModule
  ],
})
export class OrderhistoryPageModule {}
