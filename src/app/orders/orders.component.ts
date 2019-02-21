import { Component, OnInit } from '@angular/core';
import { OrderService } from '../shared/order.service';
import { Router } from '@angular/router';
import { Client } from 'src/app/shared/client.model';
import { ClientService } from 'src/app/shared/client.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styles: []
})
export class OrdersComponent implements OnInit {

  orderList;
  clientList = [];

  constructor(private service: OrderService,
    private clientService: ClientService,
    private router:Router) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.clientService.getClientList().then(res => this.clientList = res as Client[]);
    this.service.getOrderList().then(res=> this.orderList = res);
  }

  getClientBy(id: number) {
    const client = this.clientList.find((entry) => entry.id === id);
    return client || {};
  }

  delete(id: number) {
    this.service.deleteOrderBy(id).then(res=> this.init());
  }

  openForEdit(orderID:number){
    this.router.navigate(['/order/edit/'+orderID]);
  }

}
