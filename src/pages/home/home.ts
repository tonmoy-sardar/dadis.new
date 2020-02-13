import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Events  } from 'ionic-angular';

import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import {CategoryService} from '../../core/services/category.service';
import {WoocommerceService} from '../../core/services/woocommerce.service';
import * as Globals from '../../core/global';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
 
  gallery_images: any = [];
  popular_product_list:any = [];
  category_list:any = [];
  recently_view_product:any = [];

  constructor(
    private spinnerDialog: SpinnerDialog,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menuCtrl:MenuController,
    private categoryService: CategoryService,
    private woocommerceService: WoocommerceService,
    public events: Events
    ) {

      //this.userService.getPageNameStr('Home')
      this.events.publish('page-name', 'Home');


      if (localStorage.getItem("recentlyView")) {
        this.recently_view_product = JSON.parse(localStorage.getItem("recentlyView"));
      }

      this.events.subscribe('recently_view_change', (data) =>{
        if(data=='true')
        {      
          this.getRecentlyViewProduct();
        }
        
      });

  }

  ionViewDidLoad() {
    this.menuCtrl.close();
    this.getGalleryImageList();
    this.getPopularProductList();
    this.getCategoryList();

  }

  getGalleryImageList() {

    let params = {}
    let imgUrl = Globals.apiEndpoint + 'img_galley/';
    let imgGalleyUrl:string = this.woocommerceService.authenticateApi('GET',imgUrl,params);
    this.spinnerDialog.show();
    this.categoryService.getGalleryImageList(imgGalleyUrl).subscribe(
        res => {
            this.gallery_images = res.data;
            this.spinnerDialog.hide();
        },
        error => {
            this.spinnerDialog.hide();
        }
    )
  }

  getRecentlyViewProduct()
  {
    if (localStorage.getItem("recentlyView")) {
      this.recently_view_product = JSON.parse(localStorage.getItem("recentlyView"));
    }
    else {
      this.recently_view_product = [];
    }
  }

  gotoCategory(category)
  {
    this.navCtrl.push('ProductPage',{id:category.id,name:category.name});
  }
  gotoProduct(product)
  {
    this.navCtrl.push('ProductdetailsPage',{id:product.product_id,name:product.product_name});
  }



  getPopularProductList()
    {
 
        let params = {}
        let popularUrl = Globals.apiEndpoint + 'popular_product/';
        let popularProductUrl:string = this.woocommerceService.authenticateApi('GET',popularUrl,params);
        this.spinnerDialog.show();
        this.categoryService.getPopularProductList(popularProductUrl).subscribe(
            res => {
                this.popular_product_list = res.data;
                this.spinnerDialog.hide();
            },
            error => {
              this.spinnerDialog.hide();
            }
        )
    }

    getCategoryList() {

      let params = {}
      let url = Globals.apiEndpoint + 'products/categories/';
      let categoryUrl:string = this.woocommerceService.authenticateApi('GET',url,params);
      this.spinnerDialog.show();
      this.categoryService.getCategoryList(categoryUrl).subscribe(
          res => {
              this.category_list = res;
              this.spinnerDialog.hide();
           },
          error => {
            this.spinnerDialog.hide();
          }
      )
    }
  




  gotoPage(routePage)
  {
    this.navCtrl.push(routePage);
  }

}
