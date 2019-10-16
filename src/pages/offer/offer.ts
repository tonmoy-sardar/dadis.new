import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController,Events } from 'ionic-angular';

import { SpinnerDialog } from '@ionic-native/spinner-dialog';

import {PaymentService} from '../../core/services/payment.service'
import {WoocommerceService} from '../../core/services/woocommerce.service';
import * as Globals from '../../core/global';


/**
 * Generated class for the OfferPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-offer',
  templateUrl: 'offer.html',
})
export class OfferPage {

  visible: boolean;
  category_name:string;
  category_id:number;
  offer_list: any = [];
  constructor(
    private spinnerDialog: SpinnerDialog,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menuCtrl:MenuController,
    private paymentService: PaymentService,
    private woocommerceService: WoocommerceService,
    public events: Events,
    ) {
      this.events.publish('page-name', 'Offers');
    }

  
  ionViewDidLoad() {
    this.menuCtrl.close();
    this.visible = true;
    this.getOfferList();
  }

  getOfferList() {
    this.spinnerDialog.show();
    
    let params = {
       
    }
    let url = Globals.apiEndpoint + 'coupons';
    let offerUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.paymentService.getOfferList(offerUrl).subscribe(
        res => {
            this.offer_list = res;
            this.visible = true
            this.spinnerDialog.hide();
        },
        error => {
            this.spinnerDialog.hide();
        }
    )
}

}
