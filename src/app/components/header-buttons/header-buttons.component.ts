import { Component, inject, OnInit } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateCustomerDialogComponent } from '../create-customer-dialog/create-customer-dialog.component';
import { CustomersService } from '../../services/customers.service';
import { CustomerDto } from '../../models/customer';

@Component({
  selector: 'app-header-buttons',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './header-buttons.component.html',
  styleUrl: './header-buttons.component.scss'
})
export class HeaderButtonsComponent implements OnInit{
  private matDialog = inject(MatDialog);
  private customersService = inject(CustomersService);
    ngOnInit(): void {

    }

  openCreateCustomerDialog() {
    const dialog = this.matDialog.open(CreateCustomerDialogComponent);
    dialog.afterClosed().subscribe((result: CustomerDto|null) => {
      if (result) {
        this.customersService.createCustomer(result);
      }
    });
  }
}
