import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormServiceService {

  private countriesUrl = `${environment.lu2shopApiUrl}/countries`;
  private statesUrl = `${environment.lu2shopApiUrl}/states`;
  
  constructor(private httpClient: HttpClient) { }

  getStates(theCountryCode: string): Observable<State[]> {
    return this.httpClient.get<GetResponseStates>(`${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`).pipe(
      map(response => response._embedded.states)
    );
  }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    ); 
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];
    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];
    const currentYear: number = new Date().getFullYear();
    const endYear:number = currentYear + 10;
    for (let theYear = currentYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    return of(data);
  }  
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}