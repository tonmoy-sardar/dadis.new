import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,MenuController, ToastController,Events} from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as Globals from '../../core/global';
import {UserService} from '../../core/services/user.service';
import {WoocommerceService} from '../../core/services/woocommerce.service';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';

// import * as  base64 from "base-64";
// import * as utf8 from "utf8";

/**
 * Generated class for the ForgotpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgotpassword.html',
})
export class ForgotpasswordPage {

  form: FormGroup;
  otpForm: FormGroup;
  passwordForm: FormGroup;

  showOtpSection:boolean;
  newPwdSection:boolean;
  phone:string;
  otp_status:boolean;
  otp: string;
  user_id:string;
 
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

      this.events.publish('page-name', 'Forgot Password');
      this.form = this.formBuilder.group({
        phone: ['', [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10)
        ]]
      });
  
      this.otpForm = this.formBuilder.group({
        otp: ['', Validators.required]
      });
  
      this.passwordForm = this.formBuilder.group({
        password: ['', Validators.required],
        conf_password: ['', Validators.required]
      });
  
  }

  ionViewDidLoad() {
    this.menuCtrl.close();

    this.showOtpSection= false;
    this.newPwdSection= false;
  }

  userForgetPasswordOtp() {

    this.spinnerDialog.show();
    if (this.form.valid) {
      
      this.phone = this.form.value.phone;
      let params = {}
      let otpUrl = Globals.apiEndpoint + 'send_otp/';
      let sendOtpUrl: string = this.woocommerceService.authenticateApi('POST', otpUrl, params);

      this.userService.userForgetPasswordOtp(sendOtpUrl, this.form.value).subscribe(
        res => {
          this.otp = res['phone_otp'];
          this.user_id = res['user_id'];
          this.showOtpSection = true;
          this.spinnerDialog.hide();
        },
        error => {
          this.spinnerDialog.hide();
          this.presentToast(error.error.message);

        }
      )
    }
    else {
      this.markFormTouched(this.form)
    }
  }

  resendOtp() {
    this.spinnerDialog.show();

    let params = {}
    let otpUrl = Globals.apiEndpoint + 'send_otp/';
    let sendOtpUrl: string = this.woocommerceService.authenticateApi('POST', otpUrl, params);

    var data = {
      phone: this.phone,
    }
    this.userService.userForgetPasswordOtp(sendOtpUrl, data).subscribe(
      res => {
        
        this.otp = res['phone_otp'];
        this.user_id = res['user_id'];
        this.showOtpSection = true;
        this.spinnerDialog.show();
      },
      error => {
        
        this.spinnerDialog.show();
        this.presentToast(error.error.message);

      }
    )
  }

  submitOtp() {
    if (this.otp == btoa(this.otpForm.value.otp)) {
      this.newPwdSection = true;
      this.otp_status = true;
    }
    else {
      this.presentToast('Please Enter Valid OTP');
    }
  }

  submitNewPwd() {
    if (this.passwordForm.valid) {
      if (this.passwordForm.value.conf_password != this.passwordForm.value.password) {
        this.presentToast('Password & Confirm Password are not same');
      }
      else {
        this.spinnerDialog.show();
        var data = {
          user_id: this.user_id,
          otp_status: this.otp_status,
          new_password: this.passwordForm.value.password,
        }
        let params = {}
        let url = Globals.apiEndpoint + 'forget_password/';
        let userPasswordUpdateUrl: string = this.woocommerceService.authenticateApi('POST', url, params);
        
        this.userService.userPasswordUpdate(userPasswordUpdateUrl,data).subscribe(
          res => {
            this.spinnerDialog.hide();
            this.presentToast("Password has been successfully changed.");  
            this.navCtrl.push('LoginPage');        
          },
          error => {
            this.spinnerDialog.hide();
          }
        )
      }
    }
    else {
      this.markFormTouched(this.form)
    }

  }
  
  
  isFieldValid(form: FormGroup,field: string) {
    return form.get(field).invalid && (form.get(field).dirty || form.get(field).touched);
  }

  displayFieldCss(form: FormGroup,field: string) {
    return {
      'is-invalid': form.get(field).invalid && (form.get(field).dirty || form.get(field).touched),
      'is-valid': form.get(field).valid && (form.get(field).dirty || form.get(field).touched)
    };
  }

  markFormTouched(form: FormGroup,) {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

  presentToast(msg) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  

  gotoPage(page) {
    this.navCtrl.push(page);
  }


}
