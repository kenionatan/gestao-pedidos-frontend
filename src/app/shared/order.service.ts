import { Injectable } from '@angular/core';
import { Order } from './order.model';
import { OrderItem } from './order-item.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  formData:Order;
  orderItems:OrderItem[];

  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  
  constructor(private http:HttpClient) { }

  saveOrUpdateOrder(){
    var body = {
      ...this.formData,
      OrderItems : this.orderItems
    };
    
    console.log(JSON.stringify(this.orderItems));
    console.log(this.formData.id);
    //var body = {client: 1, quantityItem: 2, price: this.formData.GTotal, profitability: 'profitable'}
    return this.http.post(environment.apiURL+'/order/', body, {headers: this.httpHeaders});
    console.log(this.formData.id);

  }

}
