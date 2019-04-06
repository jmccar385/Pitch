
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

export interface Venue {
  ProfileAddress: string;
  ProfileName: string;
  ProfileBiography: string;
  ProfilePictureUrl: string;
  ProfileImageUrls?: string[];
  ProfileRating?: number;
  ProfileRatingCount?: number;
  ProfileReportCount?: number;
}


