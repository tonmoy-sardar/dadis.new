import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController,Events } from 'ionic-angular';

import { SpinnerDialog } from '@ionic-native/spinner-dialog';

import {CategoryService} from '../../core/services/category.service';
import {WoocommerceService} from '../../core/services/woocommerce.service';
import * as Globals from '../../core/global';

//import { CheckOutPage } from '../check-out/check-out';


/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  visible: boolean;
 
  product_list: any = [];
  all_product_list:  any = [];
  searchQuery: string = '';
  constructor(
    private spinnerDialog: SpinnerDialog,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menuCtrl:MenuController,
    private categoryService: CategoryService,
    private woocommerceService: WoocommerceService,
    public events: Events,
    ) {
      this.events.publish('page-name', 'Search');
    }

  
  ionViewDidLoad() {
    this.menuCtrl.close();
    console.log('ionViewDidLoad ProductdetailsPage');
    this.getProductList();
  }



  getItems(ev) {
 
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.product_list = this.product_list.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    else{
      this.product_list = this.all_product_list;
    }
  }

  
  getProductList() {
    let params = {
        app_type:"app"
    }
    let url = Globals.apiEndpoint + 'products';
    let productUrl:string = this.woocommerceService.authenticateApi('GET',url,params);
    this.spinnerDialog.show();
    this.categoryService.getProductListByCategoryId(productUrl).subscribe(
        res => {

            console.log(res);
            this.product_list = res;
            this.all_product_list = res;
            this.spinnerDialog.hide();
            this.visible = true
           
        },
        error => {
            this.visible = true
            this.spinnerDialog.hide();
        }
    )
  }

  getDiscount(price, regular_price) {
    return Math.floor(((regular_price - price) * 100) / regular_price) + '%';
  }

  gotoProduct(product)
  {
    this.navCtrl.push('ProductdetailsPage',{id:product.id});
  }

}
