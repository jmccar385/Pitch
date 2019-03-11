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
    let equipmentList = [];
    let equipmentIcons = [{IconUrl: 'assets/equipment/guitar.svg', owned: 0}, {IconUrl: 'assets/equipment/bass.svg', owned: 0}, {IconUrl: 'assets/equipment/drumset.svg', owned:0}, {IconUrl: 'assets/equipment/microphone.svg', owned: 0}];
    let events = [];
    let now = new Date().getTime();

    if (venue["AvailableEquipment"]) {
      equipmentList = venue.AvailableEquipment;

      equipmentList.forEach(function(equipment) {
        for (var i = 0; i < equipmentIcons.length; i++)
          if (equipmentIcons[i].IconUrl == equipment.IconUrl) {
            equipmentIcons[i].owned = 1;
          }
      })
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
      equipment_icons: equipmentIcons,
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
