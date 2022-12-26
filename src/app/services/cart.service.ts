import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  
  // Subject is the subclass of Observable, use subject to publish events to all of the subscribers.
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  addCartItem(theCartItem: CartItem) {
    // check if the item is already in cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0) {
      // find the item in the cart based on the item id
      existingCartItem = this.cartItems.find(item => item.id === theCartItem.id);
      // check if we found it
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if (alreadyExistsInCart) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(theCartItem);
    }

    // compute the total price and quantity
    this.computeCartTotals();
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {
    // find the index of the cartItem in cart
    const index = this.cartItems.findIndex(
      tempCartItem => tempCartItem.id === theCartItem.id
    );

    if (index > -1) {
      this.cartItems.splice(index, 1);
      this.computeCartTotals();
    }
  }

  computeCartTotals() {
    let totalCartPrice: number = 0;
    let totalCartQuantity: number = 0;
    for (let currentCartItem of this.cartItems) {
      totalCartPrice += currentCartItem.quantity * currentCartItem.unitPrice;
      totalCartQuantity += currentCartItem.quantity;
    }

    // publish the new values, all the subscriber will receive the value
    this.totalPrice.next(totalCartPrice);
    this.totalQuantity.next(totalCartQuantity);
  }
}
