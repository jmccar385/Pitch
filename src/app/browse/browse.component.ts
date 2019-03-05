import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit {

	constructor(private snackBar: MatSnackBar, public dialog: MatDialog, private authService: AuthService, private router: Router) { }

	private stars = [];
	private profileCards: any[] = [
		{
			profile_image: 'https://www.shareicon.net/data/128x128/2017/05/24/886426_user_512x512.png',
			profile_name: 'Test profile',
			rating: 1.9,
			upcoming_event_text: '3 upcoming shows',

			amplifiers_available: true,
			drums_available: true,
			guitars_available: true,
			microphones_available: true,

			amp_image: 'https://www.shareicon.net/data/128x128/2016/07/06/111207_box_512x512.png',
			drum_image: 'https://www.shareicon.net/data/128x128/2015/10/21/659440_music_512x512.png',
			guitar_image: 'https://www.shareicon.net/data/64x64/2015/10/20/659234_music_512x512.png',
			mic_image: 'https://www.shareicon.net/data/64x64/2015/10/19/658679_music_512x512.png'
		}
	];

  	ngOnInit() {
  		for (var i = 0; i < this.profileCards.length; i++) {
  			while (this.profileCards[i].rating >= 1) {
  				this.stars.push("star");
  				this.profileCards[i].rating -= 1;
  			}
  			if (this.profileCards[i].rating != 0) {
  				this.stars.push("star_half");
  			}
  			while (this.stars.length < 5) {
  				this.stars.push("star_border");
  			}
  			 
  		}
  	}

	getCards(start, end): void {
		// TODO: Call API to get profiles in range 
		// [start .. end] using user filter data
	}

	logout(): void {
		this.authService.logout();
		this.router.navigate(['/login']);
	}

}
