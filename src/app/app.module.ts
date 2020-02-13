import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation} from '@ionic-native/geolocation';

// core module
import { CoreModule } from '../../src/core/core.module';
import { AddressPageModule } from '../pages/address/address.module';
import { Network } from '@ionic-native/network';

@NgModule({
  declarations: [
    MyApp,

  ],
  imports: [
    BrowserModule,
    CoreModule,
    IonicModule.forRoot(MyApp),
    AddressPageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,

  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    Network,
  ]
})
export class AppModule {}
