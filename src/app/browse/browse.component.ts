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

  private profileCards: any[] = [];

  async _addProfileCard(venue) {
    let equipment = [];
    let events = [];
    let now = new Date().getTime();

    if (venue["AvailableEquipment"]) {
      equipment = venue.AvailableEquipment;
    }

    if (venue["Events"]) {
      events = venue.Events.filter(E => {
        return E["EventDateTime"].seconds * 1000.0 >= now;
      });
    }

    let profile_image = venue["ProfilePictureUrl"];

    this.profileCards.push({
      profile_image: profile_image,
      profile_name: venue["ProfileName"],

      rating: venue["ProfileRating"],
      rating_count: venue["ProfileRatingCount"],

      upcoming_event_text:
        (events.length > 0 ? events.length : "No") +
        " upcoming event" +
        (events.length != 1 ? "s" : ""),
      available_equip_text:
        (equipment.length > 0 ? "E" : "No e") + "quipment available"

      // amplifiers_available: _checkEquipment("amp"),
      // drums_available: _checkEquipment("drum"),
      // guitar_available: _checkEquipment("guitar"),
      // microphones_available: _checkEquipment("mic"),
    });
  }

  ngOnInit() {
    this.profileService.getVenueObserver().subscribe(observer => {
      let merged = [];

      observer.forEach(venue => {
        let index = merged.findIndex(X => X.id == venue.id);
        if (index >= 0) {
          if (venue.SubCollection.length > 0) {
            if (venue.SubCollection[0]["EventDateTime"]) {
              merged[index].Events = venue.SubCollection;
            } else {
              merged[index].AvailableEquipment = venue.SubCollection;
            }
          }
        } else {
          merged.push(venue);
          if (venue.SubCollection.length > 0) {
            if (venue.SubCollection[0]["EventDateTime"]) {
              merged[merged.length - 1].Events = venue.SubCollection;
            } else {
              merged[merged.length - 1].AvailableEquipment =
                venue.SubCollection;
            }
          }
        }
      });

      merged.forEach(venue => {
        this._addProfileCard(venue);
      });
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
