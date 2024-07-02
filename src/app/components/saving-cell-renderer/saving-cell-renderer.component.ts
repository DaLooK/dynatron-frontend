import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-saving-cell-renderer',
  standalone: true,
  imports: [],
  template: `
      <div class="ag-custom-loading-cell" style="padding-left: 10px; line-height: 25px;">
          Saving...
      </div>
  `,
  styles: `:host { display: flex; background: #ededed; width: 100%; height: 100%; align-items: center; justify-content: center; }`,
})
export class SavingCellRendererComponent implements ICellRendererAngularComp {
    agInit(params: ICellRendererParams<any, any, any>): void {

    }
    refresh(params: ICellRendererParams<any, any, any>): boolean {
        return false;
    }

}
