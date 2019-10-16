import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class CartService {
 
  @Output() getCartNumberStatus: EventEmitter<any> = new EventEmitter();
  constructor(private http: HttpClient) { }

  // cartNumberStatus(data): Observable<any> {
  //   if (data) {
  //     this.getCartNumberStatus.emit(data);
  //     return
  //   }
  // }

  cartNumberStatus(status) {
    console.log(status);
    this.getCartNumberStatus.emit(status);
  }

}

