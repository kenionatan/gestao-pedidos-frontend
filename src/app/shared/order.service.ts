import { Injectable } from '@angular/core';
import { Order } from './order.model';
import { OrderItem } from './order-item.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  formData:any;
  orderItems:any[];

  items:OrderItem;

  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  
  constructor(private http:HttpClient) { }

  saveOrUpdateOrder(){
    var body = {
      client: parseInt(this.formData.client),
      quantityItem: this.orderItems.length,
      profitability: 'profitable',
      grand_total: parseFloat(this.formData.grand_total),
      items: this.orderItems.map((entry) => {
        return {
          product: parseInt(entry.ItemID),
          price: parseFloat(entry.Price),
          quantityProduct: parseInt(entry.Quantity)
        };
      })
    };
    return this.http.post(environment.apiURL+'/order/', body, {headers: this.httpHeaders}).toPromise();
  }

  getOrderList(){
    return this.http.get(environment.apiURL+'/order/', 
    {headers: this.httpHeaders}).toPromise();
  }

  getOrderByID(id:number):any{
    return this.http.get(environment.apiURL+'/order/'+id+'/', 
    {headers: this.httpHeaders}).toPromise();
  }

}
