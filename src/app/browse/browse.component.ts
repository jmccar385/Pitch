import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit {

	constructor(private authService: AuthService, private router: Router) { }

  	ngOnInit() {
  	}

	logout(): void {
		this.authService.logout();
		this.router.navigate(['/login']);
	}

}
