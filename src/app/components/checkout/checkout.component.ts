import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { Luv2ShopFormServiceService } from 'src/app/services/luv2-shop-form-service.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  totalPrice: number = 0.00;
  totalQuantity: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  countries: Country[] = [];
  states: State[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder, 
              private cartService: CartService, 
              private luv2ShopService: Luv2ShopFormServiceService) { }

  ngOnInit(): void {
    // populate countries
    this.luv2ShopService.getCountries().subscribe(
      data => this.countries = data

    );
    // populate credit card months
    const startMonth = new Date().getMonth() + 1;
    this.luv2ShopService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    );
    // populate credit card years
    this.luv2ShopService.getCreditCardYears().subscribe(
      data => this.creditCardYears = data
    )

    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    )
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    )
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        expirationMonth: [''],
        expirationYear: [''],
        securityCode: ['']
      }),
    })
  }

  handleMonthAndYears() {
    const creditCardGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear = new Date().getFullYear();
    const selectedYear = Number(creditCardGroup.value.expirationYear);

    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.luv2ShopService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    );
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code;

    this.luv2ShopService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data
        } else {
          this.billingAddressStates = data
        }
        // select the first data by default
        formGroup.get('state').setValue(data[0]);
      }
    )
  }

  copyShippingAddressToBillingAddress(event) {
    if (event.target.checked) {
      // get shipping address state
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }

  onSubmit() {

  }

}
