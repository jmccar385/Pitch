import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { Venue } from '../models';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit {
  constructor(private profileService: ProfileService) {}

  private profileCards: any[] = [];

  _addProfileCard(venue: Venue) {
    const equipmentList = venue.AvailableEquipment;
    const equipmentIcons = [
      { IconUrl: 'assets/equipment/guitar.svg', owned: 0 },
      { IconUrl: 'assets/equipment/bass.svg', owned: 0 },
      { IconUrl: 'assets/equipment/drumset.svg', owned: 0 },
      { IconUrl: 'assets/equipment/microphone.svg', owned: 0 }
    ];
    // let events = await this.profileService.getVenueEventsById(venue.id);
    // console.log('Events: ' , events);
    // const now = new Date().getTime();

    equipmentList.forEach(equipment => {
      for (const equipmentIcon of equipmentIcons) {
        if (equipmentIcon.IconUrl === equipment.IconUrl) {
          equipmentIcon.owned = 1;
        }
      }
    });

    // if (venue.Events) {
    //   events = venue.Events.filter(E => {
    //     return E.EventDateTime.getSeconds() * 1000.0 >= now;
    //   });
    // }

    this.profileCards.push({
      profile_image: venue.ProfilePictureUrl,
      profile_name: venue.ProfileName,
      profile_address: venue.ProfileAddress,
      profile_id: venue.id,
      rating: venue.ProfileRating,
      rating_count: venue.ProfileRatingCount,
      upcoming_event_text: 'Doing stuff',
      // upcoming_event_text:
      //   (events.length > 0 ? events.length : 'No') +
      //   ' upcoming event' +
      //   (events.length !== 1 ? 's' : ''),
      equipment_icons: equipmentIcons
    });
  }

  ngOnInit() {
    this.profileService.getVenueObserver().subscribe(doc => {
      const merged = [];
      // console.log(doc);
      doc.forEach(venue => {
        const index = merged.findIndex(X => X.id === venue.id);
        if (index >= 0) {
          if (venue.SubCollection.length > 0) {
            if (venue.SubCollection[0].hasOwnProperty('EventDateTime')) {
              merged[index].Events = venue.SubCollection;
            } else {
              merged[index].AvailableEquipment = venue.SubCollection;
            }
          }
        } else {
          merged.push(venue);
          if (venue.SubCollection.length > 0) {
            if (venue.SubCollection[0].hasOwnProperty('EventDateTime')) {
              merged[merged.length - 1].Events = venue.SubCollection;
            } else {
              merged[merged.length - 1].AvailableEquipment =
                venue.SubCollection;
            }
          }
        }
      });

      merged.forEach(venue => {
        // console.log(venue);
        this._addProfileCard(venue);
      });
    });
  }
}
