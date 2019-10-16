import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrivacypolicyPage } from './privacypolicy';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [
    PrivacypolicyPage,
  ],
  imports: [
    IonicPageModule.forChild(PrivacypolicyPage),
    CoreModule
  ],
})
export class PrivacypolicyPageModule {}
