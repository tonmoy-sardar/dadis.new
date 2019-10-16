import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ViewController, Events } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController } from 'ionic-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
//Services
import { PaymentService } from '../../core/services/payment.service';
import { WoocommerceService } from "../../core/services/woocommerce.service";
import * as Globals from '../../core/global';

/**
 * Generated class for the AddressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
})
export class AddressPage {
  addressForm: FormGroup;
  userId: any;
  addressData: any;
  isUpdate: any;
  editAddress: any;
  type: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events1: Events,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private spinnerDialog: SpinnerDialog,
    public paymentService: PaymentService,
    public menuCtrl: MenuController,
    private woocommerceService: WoocommerceService,
    public viewCtrl: ViewController,
  ) {
    this.events1.publish('isHeaderHidden', false);
    this.addressForm = this.formBuilder.group({
      label: ['', Validators.required],
      shipping_first_name: ['', Validators.required],
      shipping_last_name: ['', Validators.required],
      shipping_address_1: ['', Validators.required],
      shipping_city: ['', Validators.required],
      shipping_state: ['', Validators.required],
      shipping_postcode: ['',
        [Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6)]
      ]
    });

    this.isUpdate = navParams.get('type');

    this.addressData = navParams.get('addressData');
    if (this.isUpdate) {
      this.addressForm.patchValue({
        label: this.addressData.label,
        shipping_first_name: this.addressData.shipping_first_name,
        shipping_last_name: this.addressData.shipping_last_name,
        shipping_address_1: this.addressData.shipping_address_1,
        shipping_city: this.addressData.shipping_city,
        shipping_state: this.addressData.shipping_state,
        shipping_postcode: this.addressData.shipping_postcode
      })
    }
  }

  ionViewDidLoad() {
    if (localStorage.getItem('isLoggedin')) {
      this.userId = localStorage.getItem('logged_user_id');
    }
    else {
      this.userId = '';
    }
  }

  addAdress() {

    if (this.addressForm.valid) {
      var data = {
        user_id: this.userId,
        user_multiple_address: [
          {
            label: this.addressForm.value.label,
            shipping_first_name: this.addressForm.value.shipping_first_name,
            shipping_last_name: this.addressForm.value.shipping_last_name,
            shipping_company: '',
            shipping_country: 'IN',
            shipping_address_1: this.addressForm.value.shipping_address_1,
            shipping_address_2: '',
            shipping_city: this.addressForm.value.shipping_city,
            shipping_state: this.addressForm.value.shipping_state,
            shipping_postcode: this.addressForm.value.shipping_postcode,
            shipping_address_is_default: 'true'
          }
        ]
      }

      let params = {}
      let url = Globals.apiEndpoint + 'add_user_multiple_address';
      let addAddressUrl: string = this.woocommerceService.authenticateApi('POST', url, params);

      this.paymentService.addCustomerAddress(addAddressUrl, data).subscribe(
        res => {
          this.closeModal();
        },
        error => {
          console.log(error)
        }
      )
    }
    else {
      this.markFormGroupTouched(this.addressForm)
    }
  }

  updateAdress() {

    if (this.addressForm.valid) {
      var data = {
        user_id: this.userId,
        user_address: {
          label: this.addressForm.value.label,
          shipping_first_name: this.addressForm.value.shipping_first_name,
          shipping_last_name: this.addressForm.value.shipping_last_name,
          shipping_company: '',
          shipping_country: 'IN',
          shipping_address_1: this.addressForm.value.shipping_address_1,
          shipping_address_2: '',
          shipping_city: this.addressForm.value.shipping_city,
          shipping_state: this.addressForm.value.shipping_state,
          shipping_postcode: this.addressForm.value.shipping_postcode,
          shipping_address_is_default: "true"
        }
      }

      let url_params = {
        address_id: this.addressData.id
      }
      let url = Globals.apiEndpoint + 'update_user_address';
      let updateAddressUrl: string = this.woocommerceService.authenticateApi('PUT', url, url_params);
      this.paymentService.updateCustomerAddress(updateAddressUrl, data).subscribe(
        res => {
          console.log(res);
          this.navCtrl.pop();
        },
        error => {
          console.log(error)
        }
      )
    }
    else {
      this.markFormGroupTouched(this.addressForm)
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        control.controls.forEach(c => this.markFormGroupTouched(c));
      }
    });
  }

  isFieldValid(field: string) {
    return !this.addressForm.get(field).valid && (this.addressForm.get(field).dirty || this.addressForm.get(field).touched);
  }

  displayFieldCss(field: string) {
    return {
      'is-invalid': this.addressForm.get(field).invalid && (this.addressForm.get(field).dirty || this.addressForm.get(field).touched),
      'is-valid': this.addressForm.get(field).valid && (this.addressForm.get(field).dirty || this.addressForm.get(field).touched)
    };
  }

  public closeModal() {
    this.viewCtrl.dismiss();
  }

}
