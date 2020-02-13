import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,MenuController, ToastController,Events} from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as Globals from '../../core/global';
import {UserService} from '../../core/services/user.service';
import {WoocommerceService} from '../../core/services/woocommerce.service';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
form:FormGroup;
submitted=false;
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
      this.events.publish('page-name', 'Signup');
      this.form = this.formBuilder.group({
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        email: ['', [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
        ]],
        username: ['', [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10)
        ]],
        password: ['', Validators.required],
      });
  
    }

  ionViewDidLoad() {
    this.menuCtrl.close();
  }
  
  userRegister() {
    
    this.spinnerDialog.show();
    if (this.form.valid) {
     
      var signUpData = {
        email: this.form.value.email,
        password: this.form.value.password,
        first_name: this.form.value.first_name,
        last_name: this.form.value.last_name,
        username: this.form.value.username,
        billing: {
          first_name: this.form.value.first_name,
          last_name: this.form.value.last_name,
          company: "",
          address_1: "",
          address_2: "",
          city: "",
          state: "",
          postcode: "",
          country: "",
          email: this.form.value.email,
          phone: this.form.value.username,
        },
        shipping: {
          first_name: this.form.value.first_name,
          last_name: this.form.value.last_name,
          company: "",
          address_1: "",
          address_2: "",
          city: "",
          state: "",
          postcod: "",
          country: ""
        }
      }
      let params = {}
      let url = Globals.apiEndpoint + 'customers/';
      let createUserUrl:string = this.woocommerceService.authenticateApi('POST',url,params);

      this.userService.userRegister(createUserUrl, signUpData).subscribe(
        res => {
         
          this.spinnerDialog.hide();
          this.presentToast("Your account has been successfully created");
          this.navCtrl.push('LoginPage');
         
        },
        error => {
          this.spinnerDialog.hide();
          this.presentToast(error.error.message);
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
