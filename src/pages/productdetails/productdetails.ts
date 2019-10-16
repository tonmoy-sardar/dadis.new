import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController ,ModalController,ToastController,Events} from 'ionic-angular';

import { SpinnerDialog } from '@ionic-native/spinner-dialog';

import {CartService} from '../../core/services/cart.service';
import {CategoryService} from '../../core/services/category.service';
import {WoocommerceService} from '../../core/services/woocommerce.service';
import * as Globals from '../../core/global';

import { GalleryModal } from 'ionic-gallery-modal';
import { e } from '@angular/core/src/render3';

//import { CheckOutPage } from '../check-out/check-out';


/**
 * Generated class for the ProductdetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ segment: 'productdetails/:id' })
@Component({
  selector: 'page-productdetails',
  templateUrl: 'productdetails.html',
})
export class ProductdetailsPage {

  visible: boolean;
  product_id:number;
  product_details:any ={};
  proImageList: any = [];
  sizeAttributeList: any = [];
  attributeList: any = [];
  customer_cart_data:any = [];
  product_variation: any = [];
  stockQty:any;
  activeIndex: any;
  isCart: boolean;
  logged_user_id: string;
  selectedIndex: number = 0;
  constructor(
    private spinnerDialog: SpinnerDialog,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menuCtrl:MenuController,
    private toastCtrl: ToastController,
    private categoryService: CategoryService,
    private woocommerceService: WoocommerceService,
    private cartService: CartService,
    private modalCtrl: ModalController,
    public events: Events,
    ) {
      this.events.publish('page-name', 'Product Details');
    }

  
  ionViewDidLoad() {
    this.menuCtrl.close();
    this.isCart=false;
    console.log('ionViewDidLoad ProductdetailsPage');

    this.product_id = this.navParams.get('id');
    if (localStorage.getItem("cart")) {
      this.customer_cart_data = JSON.parse(localStorage.getItem("cart"));
    }
    else {
      this.customer_cart_data = [];
    }

    console.log(this.customer_cart_data)
  
    this.getProductDetails(this.product_id);
    this.getProductVariations(this.product_id);

    this.logged_user_id = localStorage.getItem('logged_user_id')
  }

  getProductVariations(product_id) {
    let params = {
      per_page: 100
    }
    let url = Globals.apiEndpoint + 'products/' + product_id + '/variations';
    let productDeatilsUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.categoryService.getProductDetails(productDeatilsUrl).subscribe(
      res => {
       
        this.product_variation = res;
        console.log(this.product_variation);
        if(this.product_variation.length > 0) {
          this.stockQty = this.product_variation[0].stock_quantity;
        }      
      },
      error => {
        console.log(error);

      }
    )
  }

  getProductDetails(product_id) {
      this.spinnerDialog.show();
      let params = {
      }
      let url = Globals.apiEndpoint + 'products/' + product_id;
      let productDeatilsUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

      this.categoryService.getProductDetails(productDeatilsUrl).subscribe(
          res => {
              console.log(res);
              this.product_details = res;
              var index = this.customer_cart_data.findIndex(y => y.product_id == this.product_details.id && y.user_id == this.logged_user_id);

                if (index != -1) {
                  this.product_details['isCart'] = true;
                  this.product_details['quantity'] =  parseInt(this.customer_cart_data[index].quantity)
                  this.product_details['price'] = parseFloat(this.product_details['price'])
                  this.product_details['regular_price'] = parseFloat(this.product_details['regular_price'])
                  if (this.customer_cart_data[index]['size'] != undefined) {
                      if (this.product_details.attributes.length > 0) {
                          this.product_details.attributes.forEach(y => {
                              if (y.name == 'Size') {
                                  var optionIndex = y.options.findIndex(z => z == this.customer_cart_data[index]['size'])
                                  if (optionIndex != -1) {
                                      this.activeIndex = optionIndex;
                                  }

                              }
                          })
                      }
                  }
              }
              else {
                  this.product_details['isCart'] = false;
                  this.product_details['quantity'] = 0;
                  // this.product_details['price'] = parseFloat(this.product_details['price'])
                  // this.product_details['regular_price'] = parseFloat(this.product_details['regular_price'])

                  if(res.product_variation.length > 0){
                    console.log("1111");
                    console.log(this.product_details.product_variation[0]['regular_price']);
                    this.product_details['regular_price'] = parseFloat(this.product_details.product_variation[0]['regular_price']);
                    console.log( this.product_details['regular_price']);
                    if(this.product_details.product_variation[0]['sale_price']>0)
                    {
                      this.product_details['price'] = parseFloat(this.product_details.product_variation[0]['sale_price'])
                    }
                    else{
                      this.product_details['price'] = parseFloat(this.product_details.product_variation[0]['regular_price'])
                    }
                    
                  }
                  else{
                    console.log("2222");
                    this.product_details['price'] = parseFloat(this.product_details['price'])
                    this.product_details['regular_price'] = parseFloat(this.product_details['regular_price'])
                  }
              }

              res.attributes.forEach(y => {
                if(y.name == 'Size')
                {
                  this.sizeAttributeList.push(y)
                }
                else{
                  this.attributeList.push(y)
                }
              })
              
              res.images.forEach(x => {
                this.proImageList.push({ url: x.src })
              })

              this.visible = true

              //this.recentlyViewdProduct(this.product_details);
              this.spinnerDialog.hide();
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

  openModal(index) {
    //console.log(index);
    let modal = this.modalCtrl.create(GalleryModal, {
      photos: this.proImageList,
      initialSlide: index, // The second image
    });
    modal.present();
  }

  selectSize(size, i) {
   
    this.activeIndex = i;
    console.log(this.activeIndex);

    

    var index = this.customer_cart_data.findIndex(y => y.product_id == this.product_details.id && y.user_id == this.logged_user_id);
      if (index != -1) {
          this.customer_cart_data[index].size = this.product_details.attributes[i]['options'][this.activeIndex]
          this.customer_cart_data[index].variation_id = this.product_details.variations[this.activeIndex]
          this.setCartData();
      }
  }

  addToCartOriginal(product_details)
  {
      var data = {
          user_id: this.logged_user_id,
          product_id: product_details.id,
          product_name: product_details.name,
          description: product_details.short_description,
          price: product_details.price,
          quantity: parseInt(product_details.quantity) + 1
      }
      console.log(data);
      if(product_details.product_variation.length > 0){
          data['regular_price'] = product_details.product_variation[0]['regular_price']
      }
      else{
          data['regular_price'] = product_details.regular_price
      }
      if(product_details.images.length > 0){
          data['image_small'] = product_details.images[0].src
      }
      else{
          data['image_small'] = null
      }
      if (product_details.attributes.length > 0) {
        product_details.attributes.forEach(y => {
            if (y.name == 'Size') {
                data['size'] = y.options[this.activeIndex];
                data['variation_id'] = product_details.variations[this.activeIndex];
            }
        })
    }
    var index = this.customer_cart_data.findIndex(y => y.product_id == product_details.id && y.user_id == this.logged_user_id);
    this.product_details['isCart'] = true;
    this.product_details['quantity'] = parseInt(this.product_details['quantity']) + 1;

    console.log(index);
    console.log(this.customer_cart_data);
    if (index == -1) {
        console.log("sdsad");
        console.log(data);
        this.customer_cart_data.push(data);
        console.log(this.customer_cart_data);
        this.setCartData();
        
    }
  }
  addToCart(product_details) {
    
    if(this.sizeAttributeList.length>0)
    {
      if(this.activeIndex>-1)
      {
        this.addToCartOriginal(product_details);
      }
      else{
        this.presentToast("Please select preferred size.");
      }
    }
    else{

      this.addToCartOriginal(product_details);
    }
  }

  decrement(product_details) {
    if (product_details.quantity > 1) {
        var index = this.customer_cart_data.findIndex(y => y.product_id == product_details.id && y.user_id == this.logged_user_id);
        if (index != -1) {
            this.customer_cart_data[index].quantity = product_details.quantity - 1;
            this.setCartData();
        }
        this.product_details['quantity'] = product_details.quantity - 1


    }
    else {
        var index = this.customer_cart_data.findIndex(y => y.product_id == product_details.id && y.user_id == this.logged_user_id);
        if (index != -1) {
            this.customer_cart_data.splice(index, 1);
            this.setCartData();
        }

        this.product_details.isCart = false;
        this.product_details.quantity = product_details.quantity - 1

    }

  }
  increment(product_details) {
    var index = this.customer_cart_data.findIndex(y => y.product_id == product_details.id && y.user_id == this.logged_user_id);
    if (index != -1) {
        this.customer_cart_data[index].quantity = product_details.quantity + 1;
        this.setCartData();
    }
    this.product_details.quantity = product_details.quantity + 1

  }

  setCartData() {
    localStorage.setItem("cart", JSON.stringify(this.customer_cart_data));
    this.events.publish('cart_value_change', 'true');
  }

  buyNowOriginal(product_details)
  {
      if (product_details.quantity > 1) {
        var index = this.customer_cart_data.findIndex(y => y.product_id == product_details.id && y.user_id == this.logged_user_id);
        if (index != -1) {
            this.customer_cart_data[index].quantity = product_details.quantity + 1;
            this.setBuyNowCartData();
        }
        this.product_details.quantity = product_details.quantity + 1
    }
    else {
        var data = {
            user_id: this.logged_user_id,
            product_id: product_details.id,
            product_name: product_details.name,
            description: product_details.short_description,
            price: product_details.price,
            image_small: product_details.images[0].src,
            quantity: parseInt(product_details.quantity) + 1
        }
        if(product_details.product_variation.length > 0){
            data['regular_price'] = product_details.product_variation[0]['regular_price']
        }
        else{
            data['regular_price'] = product_details.regular_price
        }
        if (product_details.attributes.length > 0) {
            product_details.attributes.forEach(y => {
                if (y.name == 'Size') {
                    data['size'] = y.options[this.activeIndex];
                    data['variation_id'] = product_details.variations[this.activeIndex];
                }
            })
        }
        var index = this.customer_cart_data.findIndex(y => y.product_id == product_details.id && y.user_id == this.logged_user_id);
        this.product_details['isCart'] = true;
        this.product_details['quantity'] = this.product_details['quantity'] + 1;


        if (index == -1) {
            this.customer_cart_data.push(data);
            this.setBuyNowCartData();
        }
    } 
  }
  buyNow(product_details) {

    if(this.sizeAttributeList.length>0)
    {
      if(this.activeIndex>-1)
      {
        this.buyNowOriginal(product_details);
      }
      else{
        this.presentToast("Please select preferred size.");
      }
    }
    else{

      this.buyNowOriginal(product_details);
    }
  }

  setBuyNowCartData() {
    localStorage.setItem("cart", JSON.stringify(this.customer_cart_data));
    this.events.publish('cart_value_change', 'true');
    this.navCtrl.push('CartPage',{});
  }

  presentToast(msg) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

}
