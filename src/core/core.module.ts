import { NgModule ,CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders} from '@angular/core';

import { ApiProvider } from '../core/api/api';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as ionicGalleryModal from 'ionic-gallery-modal';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { CallNumber } from '@ionic-native/call-number';


import { SpinnerDialog } from '@ionic-native/spinner-dialog';
//import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FooterPage } from '../pages/include/footer/footer';
import { InAppBrowser } from '@ionic-native/in-app-browser';


// services
import { UserService } from './services/user.service'
import { PaymentService } from './services/payment.service'
import { CategoryService } from './services/category.service'
import { WoocommerceService } from './services/woocommerce.service'
import { CartService } from './services/cart.service'




@NgModule({
  declarations: [
    FooterPage,
  ],
  imports: [
    // Ionic2RatingModule 
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ionicGalleryModal.GalleryModalModule,
  ],
  exports: [
    // Ionic2RatingModule 
    FormsModule,
    ReactiveFormsModule,
    FooterPage,
  ],
  
  providers: [
    ApiProvider,
    SpinnerDialog,
    UserService,
    PaymentService,
    CategoryService,
    CartService,
    WoocommerceService,
    FileTransfer,
    FileTransferObject,
    InAppBrowser,
    CallNumber,
    
    //DocumentViewer,
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CoreModule {

}