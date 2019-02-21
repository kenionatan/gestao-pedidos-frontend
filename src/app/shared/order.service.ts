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
      id: this.formData.id,
      client: parseInt(this.formData.client),
      quantityItem: this.orderItems.length,
      profitability: 'profitable',
      grand_total: parseFloat(this.formData.grand_total),
      items: this.orderItems.map((entry) => {
        return {
          product: parseInt(entry.product.id),
          price: parseFloat(entry.product.product_price),
          quantityProduct: parseInt(entry.product.product_multiple)
        };
      })
    };
    if (this.formData.id) {
      return this.http.put(environment.apiURL+'/order/'+this.formData.id+'/', body, {headers: this.httpHeaders}).toPromise();
    } else {
      return this.http.post(environment.apiURL+'/order/', body, {headers: this.httpHeaders}).toPromise();
    }
  }

  getOrderList(){
    return this.http.get(environment.apiURL+'/order/', 
    {headers: this.httpHeaders}).toPromise();
  }

  getOrderByID(id:number):any{
    return this.http.get(environment.apiURL+'/order/'+id+'/', 
    {headers: this.httpHeaders}).toPromise();
  }

  deleteOrderBy(id: number) {
    return this.http.delete(environment.apiURL+'/order/'+id+'/', 
    {headers: this.httpHeaders}).toPromise();
  }

}
