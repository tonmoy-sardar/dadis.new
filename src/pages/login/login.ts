import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,MenuController, ToastController,Events} from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as Globals from '../../core/global';
import {UserService} from '../../core/services/user.service';
import {WoocommerceService} from '../../core/services/woocommerce.service';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  form: FormGroup;
  all_cart_data: any = [];
 
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private spinnerDialog: SpinnerDialog,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    public menuCtrl:MenuController,
    private userService: UserService,
    private woocommerceService: WoocommerceService,
    public events: Events,
    ) {

      this.events.publish('page-name', 'Login');
      this.form = this.formBuilder.group({
        email_phone: ['', Validators.required],
        password: ['', Validators.required]
      });
      if (localStorage.getItem("cart")) {
        this.all_cart_data = JSON.parse(localStorage.getItem("cart"));
      }
  }

  ionViewDidLoad() {
    this.menuCtrl.close();
    
  }
  
  userLogin() {
    
    this.spinnerDialog.show();
    if (this.form.valid) {
     
      let params = {}
      let url = Globals.apiEndpoint + 'login/';
      let loginUserUrl: string = this.woocommerceService.authenticateApi('POST', url, params);
      this.userService.userLogin(loginUserUrl, this.form.value).subscribe(
        res => {
          localStorage.setItem('logged_first_name', res.user['first_name'])
          localStorage.setItem('logged_last_name', res.user['last_name'])
          localStorage.setItem('logged_user_email', res.user['email'])
          localStorage.setItem('logged_user_name', res.user['first_name'] + ' ' + res.user['last_name'])
          localStorage.setItem('logged_user_contact_no', res.user['username'])
          localStorage.setItem('logged_user_id', res.user['user_id'].toString())
          localStorage.setItem('isLoggedin', 'true')
          this.userService.loginStatus(true)
          this.spinnerDialog.hide();
          this.presentToast("Signin Successfully");

          if(this.all_cart_data.length>0)
          {
            this.all_cart_data.forEach(x => {
              if (x.user_id==null) {
                x.user_id = res.user['user_id'].toString();
              }
            })
            localStorage.setItem("cart",JSON.stringify(this.all_cart_data))
          }
          
          this.navCtrl.setRoot('HomePage');
         
        },
        error => {
          this.spinnerDialog.hide();
          this.presentToast("Please check your login credential");
        }
      )
    }
    else {
      this.spinnerDialog.hide();
      this.markFormTouched()
    }
  }

  isFieldValid(field: string) {
    return this.form.get(field).invalid && (this.form.get(field).dirty || this.form.get(field).touched);
  }

  displayFieldCss(field: string) {
    return {
      'is-invalid': this.form.get(field).invalid && (this.form.get(field).dirty || this.form.get(field).touched),
      'is-valid': this.form.get(field).valid && (this.form.get(field).dirty || this.form.get(field).touched)
    };
  }

  presentToast(msg) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  markFormTouched() {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

  gotoPage(page) {
    this.navCtrl.push(page);
  }


}
