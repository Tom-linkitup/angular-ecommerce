import { TestBed } from '@angular/core/testing';

import { Luv2ShopFormServiceService } from './luv2-shop-form-service.service';

describe('Luv2ShopFormServiceService', () => {
  let service: Luv2ShopFormServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Luv2ShopFormServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
