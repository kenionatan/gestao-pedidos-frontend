import { Component } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ApiService]
})
export class AppComponent {
  clients = [{client_name: 'test'}];

  constructor(private api: ApiService) {
  	this.retornaUsuarios();
  }

  retornaUsuarios = () => {
  	this.api.recuperaUsuarios().subscribe(
  		data => {
  			this.clients = data;
  		},
  		error => {
  			console.log(error);
  		}
  	)
  }

}
