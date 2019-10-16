import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController,Events } from 'ionic-angular';

import { SpinnerDialog } from '@ionic-native/spinner-dialog';

import {CategoryService} from '../../core/services/category.service';
import {WoocommerceService} from '../../core/services/woocommerce.service';
import * as Globals from '../../core/global';

//import { CheckOutPage } from '../check-out/check-out';


/**
 * Generated class for the ProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {

  visible: boolean;
  category_name:string;
  category_id:number;
  product_list: any = [];
  sort_option:string;
  customer_cart_data:any = [];
  constructor(
    private spinnerDialog: SpinnerDialog,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menuCtrl:MenuController,
    private categoryService: CategoryService,
    private woocommerceService: WoocommerceService,
    public events: Events,
    ) {
      this.events.publish('page-name', 'Products');
    }

  
  ionViewDidLoad() {
    this.menuCtrl.close();
    console.log('ionViewDidLoad ProductdetailsPage');
    this.category_name = this.navParams.get('name');
    this.category_id = this.navParams.get('id');
    this.getProductListByCategoryId(this.category_id);
  }


  stpSelect() {
    console.log(this.sort_option);
    var sort_option = this.sort_option.toString()
    if (sort_option == "Price - Low to High") {
        //this.addSubCategory(category.id)
        this.getSortedProductListByCategoryId(this.category_id,'desc','price');

    }
    else if (sort_option == "Price - High to Low") {
        //this.editCategory(category.id)
        this.getSortedProductListByCategoryId(this.category_id,'asc','price');
    }
    else if (sort_option == "Latest") {
        //this.deleteProductCategory(category)
        this.getSortedProductListByCategoryId(this.category_id,'desc','');
    }
  }


  getSortedProductListByCategoryId(category_id,order_by,meta_key) {
    this.spinnerDialog.show();
    var params
    if(meta_key=='')
    {
         params = {
            category:category_id,
            order:order_by,
            app_type:"app"
        }
    }
    else{

         params = {
            category:category_id,
            order:order_by,
            orderby_meta_key:meta_key,
            app_type:"app"
        }
    }
   
    let url = Globals.apiEndpoint + 'products';
    let productUrl:string = this.woocommerceService.authenticateApi('GET',url,params);

    this.categoryService.getProductListByCategoryId(productUrl).subscribe(
        res => {
            this.product_list = res;
            this.spinnerDialog.hide();
            this.visible = true
        },
        error => {
          this.spinnerDialog.hide();
          this.visible = true
        }
    )
}

  getProductListByCategoryId(category_id) {
    let params = {
        category:category_id,
        app_type:"app"
    }
    let url = Globals.apiEndpoint + 'products';
    let productUrl:string = this.woocommerceService.authenticateApi('GET',url,params);
    this.spinnerDialog.show();
    this.categoryService.getProductListByCategoryId(productUrl).subscribe(
        res => {

            console.log(res);
            this.product_list = res;
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
