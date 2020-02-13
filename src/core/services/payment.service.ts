import { Injectable } from "@angular/core";
import {
  HttpClient,

} from "@angular/common/http";
import { Observable } from "rxjs";

import * as Globals from '../global';

@Injectable()
export class PaymentService {

  constructor(private http: HttpClient) { }

  getCustomerAddressList(getAddressUrl,data):Observable<any> {
    return this.http.post(getAddressUrl, data)
  }

  getStateList():Observable<any> {
    return this.http.get(Globals.apiEndpoint + 'statelist/')
  }

  addCustomerAddress(addAddressUrl,data): Observable<any> {
    return this.http.post(addAddressUrl, data)
  }

  updateCustomerAddress(updateAddressUrl,data): Observable<any> {
    return this.http.put(updateAddressUrl, data)
  }

  createOrder(orderAddUrl,data) {
    return this.http.post(orderAddUrl, data)
  }

  paytmFormValue(order_amount, table_order_id, user_id, customer_email): Observable<any> {
    return this.http.get(Globals.apiEndpoint + 'payment_details/?order_amount=' + order_amount + '&order_id=' + table_order_id + '&type=app&cust_id=' + customer_email)
  }

  updateOrder(orderUpdateUrl, data) {
    return this.http.put(orderUpdateUrl, data)
  }

  getCustomerOrderList(orderUrl):Observable<any> {
    return this.http.get(orderUrl)
  }

  getCustomerOrderDetails(orderDeatilsUrl):Observable<any> {
    return this.http.get(orderDeatilsUrl)
  }
  
  addProductRating(productRatingUrl,data) {
    
    return this.http.post(productRatingUrl, data)
  }
  
  getOfferList(offerUrl):Observable<any> {
    return this.http.get(offerUrl)
  }

  getPeaymentOption(getPeaymentOptionUrl):Observable<any> {
    return this.http.get(getPeaymentOptionUrl)
  }

}



export class OrderModule {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  billing: {
    first_name: string,
    last_name: string,
    address_1: string,
    address_2: string,
    city: string,
    state: string,
    postcode: string,
    country: string,
    email: string,
    phone: string
  };
  shipping: {
    first_name: string,
    last_name: string,
    address_1: string,
    address_2: string,
    city: string,
    state: string,
    postcode: string,
    country:string
  };
  customer_id: number;
  coupon_lines: coupon_lines[];
  line_items: line_items[];
}

export class line_items {
  product_id: number;
  quantity: string;
  variation_id: number;
}

export class coupon_lines{
  code: string;
  discount: string;
  discount_tax: string;
  meta_data:meta_data[];
}

export class meta_data{
  key: string;
  value: {
    id: number,
    code: string,
    amount: string,
  };
}


export class PaymentRadioOption {
  title: string;
  id: string;
  selected: boolean = false;

  constructor(title: string, id: string) {
    this.title = title;
    this.id = id;
  }
}

export class AddressRadioOption {
  label: string;
  shipping_first_name: string;
  shipping_last_name:string;
  shipping_address_1:string;
  shipping_city:string;
  shipping_state:string;
  shipping_postcode: string;
  selected: boolean = false;

  constructor(label: string, shipping_first_name: string, shipping_last_name: string, shipping_address_1: string,shipping_city: string, shipping_state: string, shipping_postcode: string,) {
    this.label = label;
    this.shipping_first_name = shipping_first_name;
    this.shipping_last_name = shipping_last_name;
    this.shipping_address_1 = shipping_address_1;
    this.shipping_city = shipping_city;
    this.shipping_state = shipping_state;
    this.shipping_postcode = shipping_postcode;
  }
}

