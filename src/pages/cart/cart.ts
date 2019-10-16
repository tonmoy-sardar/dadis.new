import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController,Events } from 'ionic-angular';

import { SpinnerDialog } from '@ionic-native/spinner-dialog';

import {CategoryService} from '../../core/services/category.service';
import {WoocommerceService} from '../../core/services/woocommerce.service';
import * as Globals from '../../core/global';



/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  visible: boolean;
  customer_cart_data: any = [];
  all_cart_data: any = [];
  total_item_price: number;
  isLoggedin: boolean;
  logged_user_id: string;
  
  constructor(
    private spinnerDialog: SpinnerDialog,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menuCtrl:MenuController,
    private categoryService: CategoryService,
    private woocommerceService: WoocommerceService,
    public events: Events,
    ) {
      this.events.publish('page-name', 'Cart');
    }

  
  ionViewDidLoad() {
    this.menuCtrl.close();
    console.log('ionViewDidLoad CartPage');
    if (localStorage.getItem('isLoggedin')) {
      this.isLoggedin = true;
      this.logged_user_id = localStorage.getItem('logged_user_id')
      
    }
    else {
      this.isLoggedin = false;
      this.logged_user_id = ''
    }
    this.populateData();
    
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

  setCartData() {
    localStorage.setItem("cart", JSON.stringify(this.customer_cart_data));
    this.getTotalItemPrice();
    this.events.publish('cart_value_change', 'true');
  }

  increment(i) {
      var qty = this.customer_cart_data[i].quantity;
      this.customer_cart_data[i].quantity = qty + 1;
      var index = this.all_cart_data.findIndex(x => x.user_id == this.logged_user_id && x.product_id == this.customer_cart_data[i].product_id);
      if (index != -1) {
          this.all_cart_data[index].quantity = qty + 1;
          this.setCartData()
      }
  }

  decrement(i) {
      var qty = this.customer_cart_data[i].quantity;
      if (qty > 1) {
          this.customer_cart_data[i].quantity = qty - 1;
          var index = this.all_cart_data.findIndex(x => x.user_id == this.logged_user_id && x.product_id == this.customer_cart_data[i].product_id);
          if (index != -1) {
              this.all_cart_data[index].quantity = qty - 1;
              this.setCartData()
          }
      }
      else {
          this.remove(this.customer_cart_data[i].product_id)
      }
  }

  remove(id) {
      var index = this.all_cart_data.findIndex(x => x.user_id == this.logged_user_id  && x.product_id == id);
      if (index != -1) {
          this.all_cart_data.splice(index, 1);
          this.customer_cart_data.splice(index, 1);
          this.setCartData()
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

    gotoPage(routePage)
    {
      console.log(this.isLoggedin);
      this.navCtrl.push(routePage);
    }

}
