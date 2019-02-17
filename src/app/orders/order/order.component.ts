import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/shared/order.service';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { OrderItemsComponent } from '../order-items/order-items.component';
import { Client } from 'src/app/shared/client.model';
import { ClientService } from 'src/app/shared/client.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styles: []
})
export class OrderComponent implements OnInit {

  clientList: Client[];
  isValid: boolean = true;

  constructor(private service: OrderService,
    private dialog:MatDialog,
    private clientService: ClientService) { }

  ngOnInit() {
    this.resetForm();
    this.clientService.getClientList().then(res => this.clientList = res as Client[]);
  }

  resetForm(form?:NgForm){
    if(form = null)
      form.resetForm();
    this.service.formData = {
      OrderID: null,
      OrderNo: Math.floor(100000 + Math.random() * 900000).toString(),
      client: 0,
      PMethod: '',
      grand_total: 0,
      DeletedOrderItemIDs: '',
      profitability: 'profitable'
    };
    this.service.orderItems = [];
  }

  AddOrEditOrderItem(orderItemIndex, OrderID){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    dialogConfig.data = {orderItemIndex, OrderID}
    this.dialog.open(OrderItemsComponent, dialogConfig).afterClosed().subscribe(res=>{
      this.updateGrandTotal();
    });
  }

  onDeleteOrderItem(orderItemID: number, i: number) {
    if (orderItemID != null)
      this.service.formData.DeletedOrderItemIDs += orderItemID + ",";
    this.service.orderItems.splice(i, 1);
    this.updateGrandTotal();
  }

  updateGrandTotal() {
    this.service.formData.grand_total = this.service.orderItems.reduce((prev, curr) => {
      return prev + curr.Total;
    }, 0);
    this.service.formData.grand_total = parseFloat(this.service.formData.grand_total.toFixed(2));
  }

  validateForm() {
    this.isValid = true;
    if (this.service.formData.client == 0)
      this.isValid = false;
    else if (this.service.orderItems.length == 0)
      this.isValid = false;
    return this.isValid;
  }

  onSubmit(form:NgForm){
    //console.log(this.service.formData.client);
    if(this.validateForm()){
      this.service.saveOrUpdateOrder().subscribe(res => {
        this.resetForm();
      })
    }
  }

  

}
