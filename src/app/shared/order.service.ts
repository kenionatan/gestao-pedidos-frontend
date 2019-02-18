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

  items:OrderItem;

  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  
  constructor(private http:HttpClient) { }

  saveOrUpdateOrder(){
    var body = {
      ...this.formData,
      OrderItems : this.orderItems
    };
    
    console.log(JSON.stringify(this.orderItems));
    //console.log(this.formData.id);
    //for (let val of Object.values(this.orderItems)){
    //  console.log(val);
    //}
    console.log(this.orderItems);
    //var body = {client: 1, quantityItem: 2, price: this.formData.grand_total, profitability: 'profitable'}
    return this.http.post(environment.apiURL+'/order/', body, {headers: this.httpHeaders}).toPromise().then(data => {
      let order_id = data['id'];
      for(let val of Object.values(this.orderItems)){
        let body2 = {order: order_id, product: val.ItemID, price: val.Price, quantityProduct: val.Quantity}
      
        return this.http.post(environment.apiURL+'/order-item/', body2, {headers: this.httpHeaders}).toPromise();
      }
    });
    console.log(this.formData.id);

  }

}
