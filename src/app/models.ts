
export interface Band {
  ProfileAddress: string;
  ProfileCity: string;
  ProfileState: string;
  ProfileZip: number;
  ProfileName: string;
  ProfileBiography: string;
  ProfilePictureUrl: string;
  ProfileImageUrls?: string[];
  SearchRadius: number;
}

export interface Equipment {
  IconUrl: string;
  Name: string;
}

export interface Venue {
  ProfileAddress: string;
  ProfileCity: string;
  ProfileState: string;
  ProfileZip: number;
  ProfileName: string;
  ProfileBiography: string;
  ProfilePictureUrl: string;
  ProfileImageUrls?: string[];
  ProfileRating?: number;
  ProfileRatingCount?: number;
  ProfileReportCount?: number;
  AvailableEquipment: Equipment[];
}

export interface Event {
  EventName: string;
  EventDateTime: Date;
  EventDescription: string;
  EventRestricted: boolean;
  EventRestrictedAge: boolean;
}


