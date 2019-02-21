import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/shared/order.service';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { OrderItemsComponent } from '../order-items/order-items.component';
import { Client } from 'src/app/shared/client.model';
import { ClientService } from 'src/app/shared/client.service';
import { ItemService } from 'src/app/shared/item.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styles: []
})
export class OrderComponent implements OnInit {

  clientList: Client[];
  isValid: boolean = true;
  itemList = [];

  constructor(public service: OrderService,
    private dialog:MatDialog,
    private clientService: ClientService,
    private itemService: ItemService,
    private toastr: ToastrService,
    private router: Router,
    private currentRoute:ActivatedRoute) { }

  ngOnInit() {
    let orderID = this.currentRoute.snapshot.paramMap.get('id');
    this.itemService.getItemList().then(res => this.itemList = res as any[]);
    if(orderID == null)
      this.resetForm();
    else{
      this.service.getOrderByID(parseInt(orderID)).then(res=>{
        this.service.formData = {
          id: res.id,
          client: res.client,
          grand_total: res.grand_total
        };
        this.service.orderItems = res.items.map((entry) => {
          return {
            product: {
              id: entry.product,
              product_price: parseFloat(entry.price),
              product_multiple: entry.quantityProduct
            }
          };
        });
      });
    }
    this.clientService.getClientList().then(res => this.clientList = res as Client[]);
  }

  public getItemBy(id: number) {
    const item = this.itemList.find((entry) => entry.id === id);
    return item || {};
  }

  resetForm(form?:NgForm){
    if(form = null)
      form.resetForm();
    this.service.formData = {
      id: null,
      OrderNo: Math.floor(100000 + Math.random() * 900000).toString(),
      client: 0,
      PMethod: '',
      grand_total: 0,
      DeletedOrderItemIDs: '',
      profitability: 'profitable'
    };
    this.service.orderItems = [];
  }

  AddOrEditOrderItem(orderItemIndex, id){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    dialogConfig.data = {orderItemIndex, id};
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
    this.service.formData.grand_total = 0;
    this.service.orderItems.map((entry) => {
      if (entry.product) {
        this.service.formData.grand_total += parseFloat(entry.product.product_price) * entry.product.product_multiple;
      }
    });
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
    if(this.validateForm()){
      this.service.saveOrUpdateOrder().then(res => {
        this.resetForm();
        this.toastr.success('Pedido feito com sucesso!', 'Pedido', { progressBar: true });
        this.router.navigate(['/orders']);
      })
    }
  }

  

}
