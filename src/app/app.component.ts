import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomersListComponent } from './components/customers-list/customers-list.component';
import { HeaderButtonsComponent } from './components/header-buttons/header-buttons.component';
import { CustomersService } from './services/customers.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CustomersListComponent, HeaderButtonsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  private customersService = inject(CustomersService);

  ngOnInit(): void {
      this.customersService.loadCustomers();
  }
}
