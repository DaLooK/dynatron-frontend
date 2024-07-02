import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer, CustomerDto, CustomerDtoFromCustomer } from '../models/customer';
import { SERVER_ADDRESS } from '../consts';
import { customerStoreFn } from '../state/customer-store';
import { catchError, finalize, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {


  constructor(private http: HttpClient) {
  }

  public loadCustomers() {
    customerStoreFn.setLoading(true);
    this.http.get<Customer[]>(`${SERVER_ADDRESS}/customers`)
        .pipe(finalize(() => {
          customerStoreFn.setLoading(false);
        }))
        .subscribe((fetchedCustomers: Customer[]) => {
          customerStoreFn.setCustomers(fetchedCustomers);
        });
  }

  updateCustomer(customer: Customer): Observable<boolean> {
    const customerDto = CustomerDtoFromCustomer(customer);
    const id = customer.id;

    customerStoreFn.setLoading(true);
    return this.http.put<Customer>(`${SERVER_ADDRESS}/customers/${id}`, customerDto)
               .pipe(
                 map((customer) => {
                   customerStoreFn.updateCustomer(customer);
                   return true;
                 }),
                 finalize(() => {
                   customerStoreFn.setLoading(false);
                 }),
                 catchError((err) => {
                   return of(false);
                 }),
               );
  }

  createCustomer(newCustomer: CustomerDto) {
    customerStoreFn.setLoading(true);
    this.http.post<Customer>(`${SERVER_ADDRESS}/customers`, newCustomer)
        .pipe(
          finalize(() => {
            customerStoreFn.setLoading(false);
          }),
        ).subscribe((customer) => {
      customerStoreFn.addCustomer(customer);
    });
  }

  deleteCustomer(customer: Customer) {
    customerStoreFn.setLoading(true);
    this.http.delete(`${SERVER_ADDRESS}/customers/${customer.id}`)
        .pipe(
          finalize(() => {
            customerStoreFn.setLoading(false);
          }),
        ).subscribe(() => {
      customerStoreFn.removeCustomer(customer.id);
    });
  }
}
