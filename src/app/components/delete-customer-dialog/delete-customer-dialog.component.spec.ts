import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCustomerDialogComponent } from './delete-customer-dialog.component';

describe('DeleteCustomerDialogComponent', () => {
  let component: DeleteCustomerDialogComponent;
  let fixture: ComponentFixture<DeleteCustomerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteCustomerDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteCustomerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
