import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController,Events } from 'ionic-angular';

import { SpinnerDialog } from '@ionic-native/spinner-dialog';

import {PaymentService} from '../../core/services/payment.service';
import {WoocommerceService} from '../../core/services/woocommerce.service';
import * as Globals from '../../core/global';



/**
 * Generated class for the OrdersuccessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ segment: 'ordersuccess/:id' })
@Component({
  selector: 'page-ordersuccess',
  templateUrl: 'ordersuccess.html',
})
export class OrdersuccessPage {

  visible: boolean;
  order_details:any ={};
  order_id: number;
  isLoggedin: boolean;
  logged_user_id: string;
  logged_user_email: string;
  logged_user_name: string;

  constructor(
    private spinnerDialog: SpinnerDialog,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menuCtrl:MenuController,
    private paymentService: PaymentService,
    private woocommerceService: WoocommerceService,
    public events: Events,
    ) {
      this.events.publish('page-name', 'Order Success');
    }

  
  ionViewDidLoad() {
    this.menuCtrl.close();
    this.order_id= this.navParams.get('id');

    if (localStorage.getItem('isLoggedin')) {
      this.isLoggedin = true;
      
      this.logged_user_id = localStorage.getItem('logged_user_id');
      this.logged_user_email = localStorage.getItem('logged_user_email');
      this.logged_user_name = localStorage.getItem('logged_user_name');
      
    }
    else {
      this.isLoggedin = false;
      this.logged_user_id = '';
      this.logged_user_email='';
      this.logged_user_name= '';
    }
    this.getCustomerOrderDetails(this.order_id);
    
  }
  
  
  getCustomerOrderDetails(order_id) {
    this.spinnerDialog.show();
    var email = encodeURIComponent(this.logged_user_email);
        let params = {
          user_email_or_contact: email
        }
        let url = Globals.apiEndpoint + 'orders/' + order_id;

        let orderDeatilsUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

        this.paymentService.getCustomerOrderDetails(orderDeatilsUrl).subscribe(
            res => {
              this.order_details = res;
              this.visible = true;
              this.spinnerDialog.hide();
            },
            error => {
              this.visible = true;
              this.spinnerDialog.hide();
            }
        )
    }  
}
