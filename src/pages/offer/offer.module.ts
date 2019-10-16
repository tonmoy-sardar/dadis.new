import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OfferPage } from './offer';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [
    OfferPage,
  ],
  imports: [
    IonicPageModule.forChild(OfferPage),
    CoreModule
  ],
})
export class OfferPageModule {}
