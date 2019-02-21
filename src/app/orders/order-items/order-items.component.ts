import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'
import { OrderItem } from 'src/app/shared/order-item.model';
import { ItemService } from 'src/app/shared/item.service';
import { Item } from 'src/app/shared/item.model';
import { NgForm } from '@angular/forms';
import { OrderService } from 'src/app/shared/order.service';

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styles: []
})
export class OrderItemsComponent implements OnInit {
  formData:OrderItem;
  itemList: Item[];
  isValid: boolean = true;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<OrderItemsComponent>,
    private itemService: ItemService,
    private orderSevice: OrderService) { }

  ngOnInit() {
    this.itemService.getItemList().then(res => this.itemList = res as Item[]);
    if (this.data.orderItemIndex == null) {
      this.formData = {
        OrderItemID: null,
        OrderID: this.data.OrderID,
        ItemID: 0,
        ItemName: '',
        Price: 0,
        Quantity: 0,
        Total: 0
      }
    } else {
      const product = this.orderSevice.orderItems[this.data.orderItemIndex].product;
      this.formData = {
        OrderItemID: product.id,
        OrderID: this.data.OrderID,
        ItemID: product.id,
        ItemName: '',
        Price: product.product_price,
        Quantity: product.product_multiple,
        Total: product.product_price * product.product_multiple
      };
    }
  }

  updatePrice(ctrl) {
    if (ctrl.selectedIndex == 0) {
      this.formData.Price = 0;
      this.formData.ItemName = '';
    }
    else {
      this.formData.Price = this.itemList[ctrl.selectedIndex - 1].product_price;
      this.formData.ItemName = this.itemList[ctrl.selectedIndex - 1].product_title;
      this.formData.Quantity = 1;
    }
    this.updateTotal();
  }

  updateTotalPrice(){
    this.updateTotal();
  }

  updateTotal() {
    this.formData.Total = parseFloat((this.formData.Quantity * this.formData.Price).toFixed(2));
  }

  onSubmit(form: NgForm) {
    if (this.validateForm(form.value)) {
      const item = {
        product: {
          id: parseInt(form.value.ItemID),
          product_title: form.value.ItemName,
          product_price: parseFloat(form.value.Price),
          product_multiple: form.value.Quantity
        }
      };
      if (this.data.orderItemIndex == null)
        this.orderSevice.orderItems.push(item);
      else
        this.orderSevice.orderItems[this.data.orderItemIndex] = item;
      this.dialogRef.close();
    }
  }

  validateForm(formData: OrderItem) {
    this.isValid = true;
    if (formData.ItemID == 0)
      this.isValid = false;
    else if (formData.Quantity == 0)
      this.isValid = false;
    return this.isValid;
  }

}
