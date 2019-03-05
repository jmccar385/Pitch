import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { AuthService } from "../services/auth.service";
import { ProfileService } from "../services/profile.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-browse",
  templateUrl: "./browse.component.html",
  styleUrls: ["./browse.component.css"]
})
export class BrowseComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  private profileCards: any[] = [ ];

  async _addProfileCard(venue) {
    let equipment = [],
      events = [],
      images = [];

    if (venue["AvailableEquipmentList"]) {
      await this.profileService
        .getEquipment(venue["AvailableEquipmentList"])
        .then(rec => {
          rec.forEach(item => {
            if (item) equipment.push(item.data());
          });
        });
    }

    if (venue["EventList"]) {
      await this.profileService.getEvents(venue["EventList"]).then(rec => {
        rec.forEach(item => {
          if (item) events.push(item.data());
        });
      });
    }

    if (venue["ProfileImageList"]) {
      await this.profileService.getImages(venue["ProfileImageList"]).then(rec => {
        rec.forEach(item => {
          if (item) images.push(item.data());
        });
      });
    }

    let FULL_STAR = 'https://www.shareicon.net/data/128x128/2016/01/03/697542_star_512x512.png';
    let HALF_STAR = 'https://www.shareicon.net/data/128x128/2015/09/21/644056_star_512x512.png';
    let NULL_STAR = 'https://www.shareicon.net/data/128x128/2016/01/05/698469_star_512x512.png';

    let ratings = [{source: ''}, {source: ''}, {source: ''}, {source: ''}, {source: ''}];
    for (let i = 0; i < Math.floor(venue["ProfileRating"]); i++) {
      ratings[i].source = FULL_STAR;
    }
    if (Math.floor(venue["ProfileRating"]) < 5.0) {
      if (Math.floor(venue["ProfileRating"] * 2) > Math.floor(venue["ProfileRating"]) * 2) {
        ratings[Math.floor(venue["ProfileRating"])].source = HALF_STAR;
      } else {
        ratings[Math.floor(venue["ProfileRating"])].source = NULL_STAR;
      }
  
      for (let i = Math.floor(venue["ProfileRating"]) + 1; i < ratings.length; i++) {
        ratings[i].source = NULL_STAR;
      }
    }

    let _checkEquipment = (id: string) => equipment && equipment.filter(E => E["EquipmentName"].toLowerCase().startsWith(id.toLowerCase()) && E["EquipmentAvailable"]).length > 0;

    let now = new Date().getTime();
    let _events = events.filter(E => E["EventDateTime"].seconds * 1000.0ç >= now);

    let profile_image;
    await this.profileService.getImageUrl(venue["ProfilePicture"]).then(rec => {
      profile_image = rec;
    });
    
    this.profileCards.push({
      profile_image: profile_image,
      profile_name: venue["ProfileName"],

      rating: ratings,

      upcoming_event_text: (_events && _events.length > 0 ? _events.length : 'No') + ' upcoming event' + (_events && _events.length != 1 ? 's' : ''),

      amplifiers_available: _checkEquipment("amp"),
      drums_available: _checkEquipment("drum"),
      guitar_available: _checkEquipment("guitar"),
      microphones_available: _checkEquipment("mic"),

      amp_image: "https://www.shareicon.net/data/128x128/2016/07/06/111207_box_512x512.png",
      drum_image: "https://www.shareicon.net/data/128x128/2015/10/21/659440_music_512x512.png",
      guitar_image: "https://www.shareicon.net/data/64x64/2015/10/20/659234_music_512x512.png",
      mic_image: "https://www.shareicon.net/data/64x64/2015/10/19/658679_music_512x512.png"
    })

    console.log("Time to parse data");
  }

  ngOnInit() {
    this.profileService.getVenueObserver().subscribe(observer => {
      observer.forEach(venue => {
        this._addProfileCard(venue);
      });
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
