import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController ,ModalController,Events} from 'ionic-angular';

import { SpinnerDialog } from '@ionic-native/spinner-dialog';

import {PaymentService} from '../../core/services/payment.service';
import {CartService} from '../../core/services/cart.service';
import {CategoryService} from '../../core/services/category.service';
import {WoocommerceService} from '../../core/services/woocommerce.service';
import * as Globals from '../../core/global';

import { AddressPage } from '../address/address';


//import { CheckOutPage } from '../check-out/check-out';


/**
 * Generated class for the MyprofilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-myprofile',
  templateUrl: 'myprofile.html',
})
export class MyprofilePage {

  visible: boolean;
  customer_address_list: any = [];
  order_id: number;
  isLoggedin: boolean;
  logged_user_id: string;
  logged_user_email: string;
  logged_user_name: string;
  logged_user_contact_no: string;

  constructor(
    private spinnerDialog: SpinnerDialog,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menuCtrl:MenuController,
    private paymentService: PaymentService,
    private categoryService: CategoryService,
    private woocommerceService: WoocommerceService,
    private cartService: CartService,
    private modalCtrl: ModalController,
    public events: Events
    ) {
      this.events.publish('page-name', 'My Profile');
    }

  
  ionViewDidLoad() {
    this.menuCtrl.close();
    console.log('ionViewDidLoad MyprofilePage');

    if (localStorage.getItem('isLoggedin')) {
      this.isLoggedin = true;
      
      this.logged_user_id = localStorage.getItem('logged_user_id');
      this.logged_user_email = localStorage.getItem('logged_user_email');
      this.logged_user_name = localStorage.getItem('logged_user_name');
      this.logged_user_contact_no = localStorage.getItem('logged_user_contact_no');
      
    }
    else {
      this.isLoggedin = false;
      this.logged_user_id = '';
      this.logged_user_email='';
      this.logged_user_name= '';
      this.logged_user_contact_no='';
    }

    this.getCustomerAddressList(this.logged_user_id);

  }

  getCustomerAddressList(id) {
    this.spinnerDialog.show();
    let params = {

    }
    let url = Globals.apiEndpoint + 'get_user_multiple_address/';
    let getAddressUrl: string = this.woocommerceService.authenticateApi('POST', url, params);

    let data = {
        user_id: id
    }
    this.paymentService.getCustomerAddressList(getAddressUrl, data).subscribe(
        res => {       
            this.customer_address_list = res['user_multiple_address'];
            this.visible = true;
            this.spinnerDialog.hide();
        },
        error => {
          this.visible = true;
          this.spinnerDialog.hide();
        }
    )
  }

  gotoPage(page)
  {
    this.navCtrl.push(page);
  }


  public openAddModal(){
    var data = { type : '' };
    var modalPage = this.modalCtrl.create(AddressPage,data);
    modalPage.onDidDismiss(() => {
      // Call the method to do whatever in your home.ts
      console.log('Modal closed');
      this.getCustomerAddressList(localStorage.getItem('logged_user_id'));
    });
    modalPage.present();
  }  
  public openEditModal(address){
    var data = { type : 'edit',addressData:address };
    var modalPage = this.modalCtrl.create(AddressPage,data);
    modalPage.onDidDismiss(() => {
      // Call the method to do whatever in your home.ts
      console.log('Modal closed');
      this.getCustomerAddressList(localStorage.getItem('logged_user_id'));
    });
    modalPage.present();
  } 
}
