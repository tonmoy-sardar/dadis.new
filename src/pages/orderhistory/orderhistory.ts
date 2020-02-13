import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController,Events } from 'ionic-angular';

import { SpinnerDialog } from '@ionic-native/spinner-dialog';

import {PaymentService} from '../../core/services/payment.service';
import {WoocommerceService} from '../../core/services/woocommerce.service';
import * as Globals from '../../core/global';



/**
 * Generated class for the OrderhistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-orderhistory',
  templateUrl: 'orderhistory.html',
})
export class OrderhistoryPage {

  visible: boolean;
  order_list: any = [];
 
  isLoggedin: boolean;
  logged_user_id: string;
  logged_user_email: string;
  
  constructor(
    private spinnerDialog: SpinnerDialog,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menuCtrl:MenuController,
    private paymentService: PaymentService,
    private woocommerceService: WoocommerceService,
    public events: Events,
    ) {
      this.events.publish('page-name', 'Order History');
    }

  
  ionViewDidLoad() {
    this.menuCtrl.close();
    if (localStorage.getItem('isLoggedin')) {
      this.isLoggedin = true;
      this.logged_user_id = localStorage.getItem('logged_user_id');
      this.logged_user_email = localStorage.getItem('logged_user_email');
    }
    else {
      this.isLoggedin = false;
      this.logged_user_id = '';
      this.logged_user_email='';
    }

    this.getCustomerOrderList(this.logged_user_id)
    
  }

  getCustomerOrderList(customer_id) {
    this.spinnerDialog.show();
    let params = {
        customer: customer_id
    }
    let url = Globals.apiEndpoint + 'orders';
    let orderUrl: string = this.woocommerceService.authenticateApi('GET', url, params);
    this.paymentService.getCustomerOrderList(orderUrl).subscribe(
        res => {

            this.order_list = res;
            this.visible = true;
            this.spinnerDialog.hide();
        },
        error => {
            this.visible = true;
            this.spinnerDialog.hide();
        }
    )
  }


  gotoOrderDetails(id) {
    this.navCtrl.push('OrderdetailsPage',{id:id});
    //this.navCtrl.push('OrdersuccessPage',{id:id});
  }
  

}
