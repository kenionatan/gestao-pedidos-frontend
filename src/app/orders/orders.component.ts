import { Component, OnInit } from '@angular/core';
import { OrderService } from '../shared/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styles: []
})
export class OrdersComponent implements OnInit {

  orderList;

  constructor(private service: OrderService,
    private router:Router) { }

  ngOnInit() {
    this.service.getOrderList().then(res=> this.orderList = res);
  }

  openForEdit(orderID:number){
    this.router.navigate(['/order/edit/'+orderID]);
  }

}
