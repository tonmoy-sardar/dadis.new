import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TermsPage } from './terms';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [
    TermsPage,
  ],
  imports: [
    IonicPageModule.forChild(TermsPage),
    CoreModule
  ],
})
export class TermsPageModule {}
