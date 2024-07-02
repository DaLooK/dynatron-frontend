import { Component, computed, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  CellRendererSelectorFunc,
  CellValueChangedEvent,
  ColDef,
  EditableCallback,
  EditableCallbackParams,
  GetRowIdParams,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
  IRowNode,
  RowSelectedEvent,
} from 'ag-grid-community';
import { Customer } from '../../models/customer';
import { customerStore } from '../../state/customer-store';
import { formatDate } from '@angular/common';
import { CustomersService } from '../../services/customers.service';
import { SavingCellRendererComponent } from '../saving-cell-renderer/saving-cell-renderer.component';
import { RowActionsCellRendererComponent } from '../row-actions-cell-renderer/row-actions-cell-renderer.component';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [
    AgGridAngular,
  ],
  templateUrl: './customers-list.component.html',
  styleUrl: './customers-list.component.scss',
})
export class CustomersListComponent {
  customers = computed(() => {
    return customerStore().customers;
  });
  loadingRows: { id: number; field: string; }[] = [];
  private customersService = inject(CustomersService);
  private gridApi?: GridApi<Customer>;

  isSaving(id: number, columnName: string) {
    return !!this.loadingRows.find(x => x.id === id && x.field === columnName);
  }

  savingCellRenderer = (columnName: string): CellRendererSelectorFunc<Customer> => {
    return (params: ICellRendererParams<Customer>) => {
      if (this.isSaving(params.data!.id, columnName)) {
        return {component: SavingCellRendererComponent, params: [null]};
      } else {
        return undefined;
      }
    };
  };

  editableCallbackFn = (columnName: string): EditableCallback<Customer> => {
    return (params: EditableCallbackParams<Customer>) => {
      return !this.isSaving(params.data!.id, columnName);
    };
  };

  colDefs: ColDef<Customer>[] = [
    {
      field: 'id',
      width: 70,

    },
    {
      field: 'firstName', editable: this.editableCallbackFn('firstName'),
      cellRendererSelector: this.savingCellRenderer('firstName'),
    },
    {
      field: 'lastName', editable: this.editableCallbackFn('lastName'),
      cellRendererSelector: this.savingCellRenderer('lastName'),
    },
    {
      field: 'email', editable: this.editableCallbackFn('email'),
      cellRendererSelector: this.savingCellRenderer('email'),
    },
    {
      field: 'createdAt',
      valueFormatter: (params) => {
        return params.data?.createdAt ? formatDate(params.data.createdAt, 'medium', 'en-US') : '-';
      },
      width: 220,
    },
    {
      cellRenderer: RowActionsCellRendererComponent,
      width: 220,
    },
  ];

  helloWorld() {
    console.log('helloworld');
  }

  getRowIdFn(params: GetRowIdParams<Customer>) {
    return params.data.id.toString();
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  cellChanged(cellChangedEvent: CellValueChangedEvent<Customer>) {
    this.loadingRows.push({
      id: cellChangedEvent.data.id,
      field: cellChangedEvent.column.getColId(),
    });
    this.gridApi?.refreshCells({
      rowNodes: [cellChangedEvent.node],
      columns: [cellChangedEvent.column],
    });
    this.customersService.updateCustomer(cellChangedEvent.data).subscribe((result) => {
      this.loadingRows = this.loadingRows.filter((x) => x.id !== cellChangedEvent.data.id || x.field !== cellChangedEvent.column.getColId());
      this.gridApi?.refreshCells({
        rowNodes: [cellChangedEvent.node],
        columns: [cellChangedEvent.column, 'updatedAt'],
      });
    });
  }

  onRowSelected($event: RowSelectedEvent<Customer>) {
    if ($event.node.isSelected()) {
      this.saveSelectedRowIntoStorage($event.node.data!.id);
    }
  }

  saveSelectedRowIntoStorage(id: number) {
    sessionStorage.setItem('selectedRow', id.toString());
  }

  getSelectedFromFromStorage(): number {
    const selectedFromStorage = sessionStorage.getItem('selectedRow') ?? '0';
    return Number(selectedFromStorage);
  }

  firstDataRenderedCallback() {
    const selectedFromStorage = this.getSelectedFromFromStorage();
    if (selectedFromStorage > 0) {
      this.gridApi!.deselectAll();
      // In theory should only be one, but ag-grid requires an array and to iterate over each node
      const selectedRows: IRowNode[] = [];
      this.gridApi!.forEachNode((node) => {
        if (node.data?.id === selectedFromStorage) {
          selectedRows.push(node);
        }
      });
      this.gridApi!.setNodesSelected({nodes: selectedRows, newValue: true});
    }
  }
}
