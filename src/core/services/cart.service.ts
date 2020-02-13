import { Injectable, EventEmitter, Output } from '@angular/core';



@Injectable()
export class CartService {
 
  @Output() getCartNumberStatus: EventEmitter<any> = new EventEmitter();
  constructor() { }

  cartNumberStatus(status) {
    this.getCartNumberStatus.emit(status);
  }

}

