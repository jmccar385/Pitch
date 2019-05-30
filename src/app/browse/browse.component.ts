import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { Venue } from '../models';
import { HeaderService } from '../services/header.service';
import { AuthService } from '../services/auth.service';
import { DistanceService } from '../services/distance.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit {
  constructor(
    private profileService: ProfileService,
    private headerSvc: HeaderService,
    private authSvc: AuthService,
    private distSvc: DistanceService
  ) {}

  private profileCards: any[] = [];
  private artistZip: number = null;
  private artistDist: number = null;

  _addProfileCard(venue: Venue) {
    const equipmentList = venue.AvailableEquipment;
    const equipmentIcons = [
      { IconUrl: 'assets/equipment/guitar.svg', owned: 0 },
      { IconUrl: 'assets/equipment/bass.svg', owned: 0 },
      { IconUrl: 'assets/equipment/drumset.svg', owned: 0 },
      { IconUrl: 'assets/equipment/microphone.svg', owned: 0 }
    ];

    equipmentList.forEach(equipment => {
      for (const equipmentIcon of equipmentIcons) {
        if (equipmentIcon.IconUrl === equipment.IconUrl) {
          equipmentIcon.owned = 1;
        }
      }
    });

    this.profileCards.push({
      profile_image: venue.ProfilePictureUrl,
      profile_name: venue.ProfileName,
      profile_address: venue.ProfileAddress,
      profile_id: venue.id,
      rating: venue.ProfileRating,
      rating_count: venue.ProfileRatingCount,
      upcoming_event_text:
        (venue.upcomingEvents > 0 ? venue.upcomingEvents : 'No') +
        ' upcoming event' +
        (venue.upcomingEvents !== 1 ? 's' : ''),
      equipment_icons: equipmentIcons
    });
  }

  ngOnInit() {
    // const artist = this.authSvc.
    const artistID = this.authSvc.currentUser.uid;
    const artistObserver = this.profileService.getArtistObserverById(artistID);

    artistObserver.forEach((artist: any) => {
      if (this.artistZip === null) {
        this.artistZip = artist.ProfileAddress;
        try {
          this.artistDist = artist.SearchRadius || -1;
        } catch { this.artistDist = -1; }

        this.profileService.getVenuesObserver().subscribe(venues => {
          venues.forEach((venue: Venue) => {
            // Prevent duplicate cards?
            if (this.profileCards.find((card: any) => card.profile_name === venue.ProfileName)) {
              return;
            }

            // Anywhere filter will be treated as -1
            if (this.artistDist < 0) {
              return;
            }

            this.distSvc.venueInRadius(this.artistZip, this.artistDist, venue).then(result => {
              if (result) {
                this._addProfileCard(venue);
              } else {
                this.distSvc.calcDistance(this.artistZip.toString(), venue);
              }
            });
          });
        });
      }
    });

    // Set header
    this.headerSvc.setHeader({
      title: 'Browse',
      iconEnd: 'person',
      iconStart: 'forum',
      endRouterlink: ['/profile', 'band', this.authSvc.currentUserID],
      startRouterlink: ['/messages']
    });
  }
}
