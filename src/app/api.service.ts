import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseurl = "https://gestao-pedidos-backend.herokuapp.com";
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})

  constructor(private http: HttpClient) { }

  recuperaUsuarios(): Observable<any>{
  	return this.http.get(this.baseurl + '/api/', 
  	{headers: this.httpHeaders});
  }

}
