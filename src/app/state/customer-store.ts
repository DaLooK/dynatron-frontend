import { Customer } from '../models/customer';
import { signal } from '@angular/core';

interface CustomerState {
  loading: boolean;
  customers: Customer[];
}

const initialState: CustomerState = {
  loading: false,
  customers: [],
};

const customerStoreSignal = signal(initialState);

export const customerStore = customerStoreSignal.asReadonly();

function setCustomers(customers: Customer[]) {
  customerStoreSignal.update((state) => ({
    ...state,
    customers,
  }));
}

function addCustomer(customer: Customer) {
  customerStoreSignal.update((state) => ({
    ...state,
    customers: [...state.customers, customer],
  }));
}

function updateCustomer(customerToUpdate: Customer) {
  customerStoreSignal.update((state) => ({
    ...state,
    customers: state.customers.map((loadedCustomer) =>
      loadedCustomer.id === customerToUpdate.id ? customerToUpdate : loadedCustomer,
    ),
  }));
}

function removeCustomer(customerToRemoveId: number) {
  customerStoreSignal.update((state) => ({
    ...state,
    customers: state.customers.filter((customer) => customer.id !== customerToRemoveId),
  }));
}

function setLoading(loading: boolean) {
  customerStoreSignal.update((state) => ({
    ...state,
    loading,
  }));
}

export const customerStoreFn = {
  setCustomers,
  addCustomer,
  updateCustomer,
  removeCustomer,
  setLoading
}