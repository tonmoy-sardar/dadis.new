import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductdetailsPage } from './productdetails';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [
    ProductdetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductdetailsPage),
    CoreModule
  ],
})
export class ProductdetailsPageModule {}
