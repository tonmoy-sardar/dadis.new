import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation} from '@ionic-native/geolocation';

// core module
import { CoreModule } from '../../src/core/core.module';
import { AddressPage } from '../pages/address/address';
import { FooterPage } from '../pages/include/footer/footer';

@NgModule({
  declarations: [
    MyApp,
    AddressPage,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AddressPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
  ]
})
export class AppModule {}
