import { Component, ViewChild } from '@angular/core';
import { Nav, Platform , Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';

import { UserService } from '../core/services/user.service';
import { CartService } from '../core/services/cart.service';
import { CategoryService } from '../core/services/category.service';
import { WoocommerceService } from '../core/services/woocommerce.service';

import * as Globals from '../core/global';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  isOpen: boolean;
  category_list: any = [];
  pages: Array<{ title: string, component: any }>;
  logged_first_name: string;
  logged_last_name: string;
  logged_user_name: string;
  logged_user_contact_no: string
  logged_user_email: string;
  isLoggedin: boolean;
  totalCart: number;
  pageName:string;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private geolocation: Geolocation,
    private categoryService: CategoryService,
    private woocommerceService: WoocommerceService,
    private userService: UserService,
    private cartService: CartService,
    public events: Events

  ) {

    this.events.subscribe('page-name', (data) =>{
      this.pageName = data;
    });

  

    this.userService.getLoginStatus.subscribe(status => {
      console.log(status)
      this.changeStatus(status)
    });
    
    this.events.subscribe('cart_value_change', (data) =>{
      if(data=='true')
      {      
        this.cartNumberStatus();
      }
      
    });

    if (localStorage.getItem("cart")) {
      this.totalCart = JSON.parse(localStorage.getItem("cart")).length;
    }

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //this.rootPage = '';
      this.geolocation.getCurrentPosition().then((position) => {
        console.log("Data==>", position);

        localStorage.setItem('lat', position.coords.latitude.toString())
        localStorage.setItem('lng', position.coords.longitude.toString())

      }, (err) => {
        console.log('Error getting location', err);
      });
      this.nav.setRoot('HomePage');

      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.isOpen = false;
      this.getCategoryList();

      this.loadUserInfo();
    });
  }

 
  private changeStatus(status: boolean) {
    console.log("B");
    if (status) {
      this.loadUserInfo();
    }
  }
 cartNumberStatus() {
   if (localStorage.getItem("cart")) {
        this.totalCart = JSON.parse(localStorage.getItem("cart")).length;
      }
      else {
        this.totalCart = 0;
      }
  }

  loadUserInfo() {
    if (localStorage.getItem('isLoggedin')) {
      this.isLoggedin = true;
      this.logged_first_name = localStorage.getItem('logged_first_name');
      this.logged_last_name = localStorage.getItem('logged_last_name');
      this.logged_user_name = localStorage.getItem('logged_user_name');
      this.logged_user_contact_no = localStorage.getItem('logged_user_contact_no');
      this.logged_user_email = localStorage.getItem('logged_user_email');
    }
    else {
      this.logged_first_name = '';
      this.logged_last_name = '';
      this.logged_user_name = '';
      this.logged_user_contact_no = '';
      this.logged_user_email = '';
    }
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  gotoPage(routePage) {
    console.log(routePage);
    this.nav.push(routePage);
  }

  gotoCategory(category) {
    console.log(category);
    //this.nav.push(routePage);
    this.nav.push('ProductPage', { id: category.id, name: category.name });
  }

  getCategoryList() {

    let params = {}
    let url = Globals.apiEndpoint + 'products/categories/';
    let categoryUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.categoryService.getCategoryList(categoryUrl).subscribe(
      res => {
        this.category_list = res;
      },
      error => {

      }
    )
  }

  logOut() {
    localStorage.clear();
    this.isLoggedin = false;
    this.loadUserInfo();
    this.nav.setRoot('LoginPage');
  }

  itemToggle() {
    if (this.isOpen == false) {
      this.isOpen = true;
    }
    else {
      this.isOpen = false;
    }
  }


}
