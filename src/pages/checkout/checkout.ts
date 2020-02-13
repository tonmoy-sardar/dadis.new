import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController,ModalController,ToastController,Events } from 'ionic-angular';
import { FormGroup, FormBuilder,FormControl, Validators } from '@angular/forms';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';

import {PaymentService,OrderModule, line_items, coupon_lines, meta_data, PaymentRadioOption, AddressRadioOption} from '../../core/services/payment.service';
import {WoocommerceService} from '../../core/services/woocommerce.service';
import * as Globals from '../../core/global';
import { AddressPage } from '../address/address';

const  $this = {
  woocommerceService:null,
  paymentService:null,
  navCtrl:null,
  ORDERID:null,
  data:null,
};


declare var paytm : any;
/**
 * Generated class for the CheckoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {

  addressForm: FormGroup;
  paymentForm: FormGroup;
  cuponForm: FormGroup;
  visible: boolean;
  customer_cart_data: any = [];
  all_cart_data: any = [];
  total_item_price: number;
  isLoggedin: boolean;
  logged_user_id: number;
  logged_user_email: string;
  logged_user_name: string;
  logged_user_contact_no: string;
  customer_address_list: any = [];
  
  addressOptions: Array<AddressRadioOption>;
  address_selected: boolean;
  selectedAddres: any ={};

  paymentOptions: Array<PaymentRadioOption>;
  payment_option_list: any = [];
  payment_type: string;

  valid_offer;
  coupon_code;
  appliedCoupon: boolean

  offer_list: any = [];

  order: OrderModule;
  paytmFormDetails: any;

  order_id: number;
  order_total_price: number;
  discountPrice:any;
 

  constructor(
    private spinnerDialog: SpinnerDialog,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menuCtrl:MenuController,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    private paymentService: PaymentService,
    private woocommerceService: WoocommerceService,
    private modalCtrl: ModalController,
    public events: Events,
    ) {
      this.events.publish('page-name', 'Checkout');
      this.addressForm = new FormGroup({
        "address_id": new FormControl()
      });

      this.paymentForm = new FormGroup({
        "payment_id": new FormControl()
      });

      this.cuponForm = this.formBuilder.group({
        coupon: [null, Validators.required]
      });

      this.order = new OrderModule();

      $this.navCtrl =  this.navCtrl;
      $this.paymentService = this.paymentService;
      $this.woocommerceService = this.woocommerceService;
      // $this.updateOrder = this.updateOrder();
  
    }

  
  ionViewDidLoad() {
    this.menuCtrl.close();
    if (localStorage.getItem('isLoggedin')) {
      this.isLoggedin = true;
      this.logged_user_id = parseInt(localStorage.getItem('logged_user_id'));
      this.logged_user_email = localStorage.getItem('logged_user_email');
      this.logged_user_name = localStorage.getItem('logged_user_name');
      this.logged_user_contact_no = localStorage.getItem('logged_user_contact_no');
      this.getCustomerAddressList(this.logged_user_id);
    }
    else {
      this.isLoggedin = false;
      //this.logged_user_id = ''
    }
    this.populateData();
    this.getPaymentOption();
    this.getOfferList()
    
  }

  


  populateData() {
    this.spinnerDialog.show();
    if (localStorage.getItem("cart")) {
      this.all_cart_data = JSON.parse(localStorage.getItem("cart"));
      var filteredData = this.all_cart_data.filter(x => x.user_id == this.logged_user_id)
      this.customer_cart_data = filteredData;
      this.getTotalItemPrice();
      
      this.visible = true;
      this.spinnerDialog.hide();
    }
    else {
      this.customer_cart_data = [];
      this.visible = true
      this.spinnerDialog.hide();
    }
  }

  getTotalItemPrice() {
    this.total_item_price = 0;
    this.customer_cart_data.forEach(x => {
      if (x.price > 0) {
        this.total_item_price += (x.price * x.quantity);
      }
      else {
        this.total_item_price += (x.price * x.quantity);
      }
    })
  }

  

  getDiscount(price, regular_price) {
    return Math.floor(((regular_price - price) * 100) / regular_price) + '%';
  }

  public openAddModal(){
    var data = { type : '' };
    var modalPage = this.modalCtrl.create(AddressPage,data);
    modalPage.onDidDismiss(() => {
      // Call the method to do whatever in your home.ts
      this.getCustomerAddressList(localStorage.getItem('logged_user_id'));
    });
    modalPage.present();
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
            this.addressOptions = [];
            this.customer_address_list.forEach(x => {
              var d = new AddressRadioOption(x.label, x.shipping_first_name, x.shipping_last_name, x.shipping_city, x.shipping_address_1, x.shipping_state, x.shipping_postcode)
              this.addressOptions.push(d)
          })
          this.addressOptions[0]['selected'] = true;
          this.address_selected = true
          this.selectedAddres = this.addressOptions[0];
          this.visible = true;
          this.spinnerDialog.hide();
        },
        error => {
          this.visible = true;
          this.spinnerDialog.hide();
        }
    )
  }

  getPaymentOption() {
    let params = {

    }
    let url = Globals.apiEndpoint + 'payment_gateways';
    let getPeaymentOptionUrl: string = this.woocommerceService.authenticateApi('GET', url, params);


    this.paymentService.getPeaymentOption(getPeaymentOptionUrl).subscribe(
        res => {
            this.payment_option_list = res;
            this.paymentOptions = [];

            this.payment_option_list.forEach(x => {
                if (x.enabled == true) {
                    var d = new PaymentRadioOption(x.method_title, x.id)
                    this.paymentOptions.push(d)
                }

            })
            this.paymentOptions[0]['selected'] = true;
            this.payment_type = this.paymentOptions[0].id;

        },
        error => {
        }
    )
  }

  selectAddress(address,i)
  {
    this.selectedAddres = this.addressOptions[i];
  }

  selectPayment(payment,i)
  {
    this.payment_type = this.paymentOptions[i].id;
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
        control.markAsTouched();
        if (control.controls) {
            control.controls.forEach(c => this.markFormGroupTouched(c));
        }
    });
  }

  isFieldValid(form: FormGroup, field: string) {
      return !form.get(field).valid && (form.get(field).dirty || form.get(field).touched);
  }

  displayFieldCss(form: FormGroup, field: string) {
      return {
          'is-invalid': form.get(field).invalid && (form.get(field).dirty || form.get(field).touched),
          'is-valid': form.get(field).valid && (form.get(field).dirty || form.get(field).touched)
      };
  }


  applyOffer() {
    if (this.cuponForm.valid) {
        this.valid_offer = this.offer_list.filter(x => x.code.toUpperCase() == this.cuponForm.value.coupon.toUpperCase())

        if (this.valid_offer.length > 0) {

            this.coupon_code = this.valid_offer[0].code;
            this.appliedCoupon = true;
            this.presentToast("Coupon code accepted");
        }
        else {
            this.appliedCoupon = false;
            this.presentToast("Invalid Coupon code!");
        }
    } else {
        this.appliedCoupon = false;
        this.markFormGroupTouched(this.cuponForm)
    }
  }

  presentToast(msg) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  orderPay() {


    if (this.address_selected == false) {
      this.presentToast("Please Select Shipping Address");
    }
    else {
        if (this.payment_type == 'wc_paytm') {
            this.order.payment_method = "wc_paytm";
            this.order.payment_method_title = "Paytm";
        }
        else {
            this.order.payment_method = "cod";
            this.order.payment_method_title = "Cash On Delivery";
        }

        if (this.appliedCoupon) {

            var meta_data_array = []
            var meta_data_value = new meta_data();
            meta_data_value.key = "coupon_data";
            meta_data_value.value =
                {
                    id: this.valid_offer[0]['id'],
                    code: this.valid_offer[0]['code'],
                    amount: this.valid_offer[0]['amount'].toString()

                }
            meta_data_array.push(meta_data_value);

            var coupon_lines_array = []
            var coupon_lines_value = new coupon_lines();
            coupon_lines_value.code = this.valid_offer[0]['code'];
            coupon_lines_value.discount = this.discountPrice.toString();
            coupon_lines_value.discount_tax = "0";
            coupon_lines_value.meta_data = meta_data_array;
            coupon_lines_array.push(coupon_lines_value);

            this.order.coupon_lines = coupon_lines_array;

        }
        else {
            this.order.coupon_lines = []
        }
        this.order.set_paid = false;
        this.order.billing ={
            first_name: this.selectedAddres.shipping_first_name,
            last_name: this.selectedAddres.shipping_last_name,
            address_1: this.selectedAddres.shipping_address_1,
            address_2: "",
            city: this.selectedAddres.shipping_city,
            state: this.selectedAddres.shipping_state,
            postcode: this.selectedAddres.shipping_postcode,
            country: "IN",
            email: this.logged_user_email,
            phone: this.logged_user_contact_no,

        };
        this.order.shipping ={
            first_name: this.selectedAddres.shipping_first_name,
            last_name: this.selectedAddres.shipping_last_name,
            address_1: this.selectedAddres.shipping_address_1,
            address_2: "",
            city: this.selectedAddres.shipping_city,
            state: this.selectedAddres.shipping_state,
            postcode: this.selectedAddres.shipping_postcode,
            country: "IN"
        };
        

        this.order.customer_id = this.logged_user_id;

        var all_details_data = [];
        this.customer_cart_data.forEach(x => {
            var details_data = new line_items();
            details_data.quantity = x.quantity;
            details_data.product_id = x.product_id;
            if (x.variation_id != undefined) {
                details_data.variation_id = x.variation_id;
            }
            else {
                details_data.variation_id = 0;
            }
            all_details_data.push(details_data);
            var index = this.all_cart_data.findIndex(y => y.user_id == this.logged_user_id && y.product_id == x.product_id);
            if (index != -1) {
                this.all_cart_data.splice(index, 1);
            }
        })
        this.order.line_items = all_details_data;
        
        if (this.order_id == undefined) {
            this.spinnerDialog.show();
            let params = {}
            let url = Globals.apiEndpoint + 'orders/';
            let orderAddUrl: string = this.woocommerceService.authenticateApi('POST', url, params);

            this.paymentService.createOrder(orderAddUrl, this.order).subscribe(
                res => {
                    this.order_id = res['id']
                    this.order_total_price = res['total'];
                    this.spinnerDialog.hide();
                    this.setCartData();
                    if (this.payment_type == 'wc_paytm') {
                        this.getPaytmFormValue(this.order_total_price, this.order_id)
                    }
                    else {
                        this.pushNotf();
                    }
                    
                },
                error => {
                  this.spinnerDialog.hide();
                }
            )
        }
        else if (this.order_id != undefined && this.payment_type == 'wc_paytm') {

            this.getPaytmFormValue(this.order_total_price, this.order_id)
        }
        else {
            this.pushNotf()
        }
    }
  }

  pushNotf() {

    this.navCtrl.push('OrdersuccessPage',{id:this.order_id});
  }

  getPaytmFormValue(amount: number, table_order_id: number) {

    this.paymentService.paytmFormValue(amount, table_order_id, this.logged_user_id, this.logged_user_email).subscribe(
        res => {
            this.paytmFormDetails = res.response;
            this.payViaPaytm();
        },
        error => {
        }
    )
  }

  payViaPaytm() {
    var options = {
      ENVIRONMENT : "production", // environment details. staging for test environment & production for live environment
      MID: this.paytmFormDetails.MID, // You would get this details from paytm after opening an account with them
      ORDER_ID: this.paytmFormDetails.ORDER_ID, // Unique ID for each transaction. This info is for you to track the transaction details
      CUST_ID: this.paytmFormDetails.CUST_ID, // Unique ID for your customer
      INDUSTRY_TYPE_ID: this.paytmFormDetails.INDUSTRY_TYPE_ID, // You would get this details from paytm after opening an account with them
      CHANNEL_ID: this.paytmFormDetails.CHANNEL_ID, // You would get this details from paytm after opening an account with them
      TXN_AMOUNT: this.paytmFormDetails.TXN_AMOUNT, // Transaction amount that has to be collected
      WEBSITE: this.paytmFormDetails.WEBSITE,
      CALLBACK_URL: this.paytmFormDetails.CALLBACK_URL , // Callback url
      CHECKSUMHASH: this.paytmFormDetails.CHECKSUMHASH,
     
    }
    paytm.startPayment(options, this.successCallback, this.failureCallback);
  }

  //REQUEST_TYPE: "DEFAULT", // You would get this details from paytm after opening an account with them


  successCallback(response) {
   
      var ORDERID = response['ORDERID'];
      var txn_id = response['TXNID'];

      var txn_status;
      if (response['STATUS'] == 'TXN_SUCCESS') {
          txn_status = "completed";
      }
      else if (response['STATUS'] == 'PROCESSING') {
          txn_status = "processing";
      }
      else if (response['STATUS'] == 'TXN_FAILURE') {
          txn_status = "failed";
      }
      else if (response['STATUS'] == 'PENDING') {
          txn_status = "pending";
      }

      var data = {
        status: txn_status,
        meta_data: [
            {
                key: 'txn_id',
                value: txn_id
            },
            {
                key: 'bank_txn_id',
                value: response['BANKTXNID']
            },
            {
                key: 'checksumhash',
                value: response['CHECKSUMHASH']
            },
            {
                key: 'txn_status',
                value: txn_status
            },
            {
                key: 'paytm_response',
                value: response
            }
        ]
      }
      $this.ORDERID =  ORDERID;
      $this.data = data;

      let params = {}
      let url = Globals.apiEndpoint + 'orders/' + $this.ORDERID;
      let orderUpdateUrl: string = $this.woocommerceService.authenticateApi('PUT', url, params);
      $this.paymentService.updateOrder(orderUpdateUrl, $this.data).subscribe(
          res => {

            if(txn_status =="failed")
            {
              $this.navCtrl.push('OrderfailurePage',{id:$this.ORDERID});
            }
            else{
              $this.navCtrl.push('OrdersuccessPage',{id:$this.ORDERID});
            }
          },
          error => {
          }
      )
  }

  failureCallback(error) {
      // error code will be available in RESCODE
      // error list page https://docs.google.com/spreadsheets/d/1h63fSrAmEml3CYV-vBdHNErxjJjg8-YBSpNyZby6kkQ/edit#gid=2058248999
      console.log("Transaction Failed for reason " + error.RESPMSG);
  }

  setCartData() {
      localStorage.setItem("cart", JSON.stringify(this.all_cart_data));
      this.getTotalItemPrice();
      this.events.publish('cart_value_change', 'true');
  }

  getOfferList() {
    let params = {

    }
    let url = Globals.apiEndpoint + 'coupons';
    let offerUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.paymentService.getOfferList(offerUrl).subscribe(
        res => {
            this.offer_list = res;
        },
        error => {
           
        }
    )
  }

  getDiscountPrice() {
    if (this.valid_offer[0].discount_type == "percent") {
        this.discountPrice =(this.total_item_price * this.valid_offer[0].amount) / 100;
        return (this.discountPrice).toFixed(2);
    }
    else {

        this.discountPrice = this.valid_offer.amount;
        return (this.discountPrice).toFixed(2);
    }
  }

  getPaidTotalAfterOffer() {
    var totalAfterOffer = this.total_item_price - this.discountPrice;
    return (totalAfterOffer).toFixed(2);

  }

  

}
