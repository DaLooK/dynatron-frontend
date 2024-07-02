export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerDto {
  firstName: string;
  lastName: string;
  email: string;
}

export function CustomerDtoFromCustomer(customer: Customer): CustomerDto {
  return {
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
  };
}