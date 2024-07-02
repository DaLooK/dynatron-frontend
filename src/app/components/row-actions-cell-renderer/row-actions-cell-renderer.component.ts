import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Customer } from '../../models/customer';
import { CustomersService } from '../../services/customers.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteCustomerDialogComponent } from '../delete-customer-dialog/delete-customer-dialog.component';

@Component({
  selector: 'app-row-actions-cell-renderer',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogModule],
  template: `
      <button mat-flat-button (click)="askToDelete()" color="warn">
          <mat-icon fontIcon="delete"></mat-icon> Delete
      </button>
  `,
  styles: `button[mat-flat-button] { max-height: 75%; }`,
})
export class RowActionsCellRendererComponent implements ICellRendererAngularComp {
  private customersService = inject(CustomersService);
  private matDialog = inject(MatDialog);

  private customer?: Customer;

  agInit(params: ICellRendererParams<Customer>): void {
    this.customer = params.data;
  }

  refresh(params: ICellRendererParams<Customer>): boolean {
    return false;
  }

  askToDelete() {
    if (!this.customer) {
      // Bail if somehow we don't have a customer
      return;
    }
    const deleteDialog = this.matDialog.open(DeleteCustomerDialogComponent, {
      data: this.customer!,
    });
    deleteDialog.afterClosed().subscribe((shouldDelete) => {
      if (shouldDelete) {
        this.customersService.deleteCustomer(this.customer!);
      }
    });
  }
}
