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

	private profileCards: any[] = [
		{
			profile_image: 'https://www.shareicon.net/data/128x128/2017/05/24/886426_user_512x512.png',
			profile_name: 'Test profile',
			rating: [
				{source: 'https://www.shareicon.net/data/128x128/2016/01/03/697542_star_512x512.png'},
				{source: 'https://www.shareicon.net/data/128x128/2016/01/03/697542_star_512x512.png'},
				{source: 'https://www.shareicon.net/data/128x128/2016/01/03/697542_star_512x512.png'},
				{source: 'https://www.shareicon.net/data/128x128/2015/09/21/644056_star_512x512.png'},
				{source: 'https://www.shareicon.net/data/128x128/2016/01/05/698469_star_512x512.png'}
			],
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
