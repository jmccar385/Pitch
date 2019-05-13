import { Timestamp } from 'rxjs/internal/operators/timestamp';

export interface Band {
  ProfileAddress: number;
  ProfileName: string;
  ProfileBiography: string;
  ProfilePictureUrl: string;
  ProfileImageUrls?: string[];
  SearchRadius: number;
  Playlist: Playlist;
  Tracks: Track[];
  AccessToken: string;
  RefreshToken: string;
  ProfileRating: number;
  ProfileRatingCount: number;
  ProfileReportCount: number;
  Reviews?: Review[];
}

export interface Review {
  ReviewText: string;
  ReviewRating: number;
  ReviewCreator: string;
  ReviewCreatorName: string;
  CreationDate: number;
}

export interface ReviewDialogData {
  userId: string;
  userType: string;
  rating: number;
  ratingCount: number;
}

export interface PitchDialogData {
  events: Event[];
}

export interface UploadDialogData {
  userId: string;
  userType: string;
}

export interface Equipment {
  IconUrl: string;
  Name: string;
}

export interface SpotifyAccess {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export interface SpotifyPagingPlaylist {
  href: string;
  items: SpotifyPlaylist[];
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
}

export interface SpotifyPlaylist {
  collaborative: boolean;
  external_urls: object;
  href: string;
  id: string;
  images: object[];
  name: string;
  owner: object;
  public: boolean;
  snapshot_id: string;
  tracks: SpotifyPlaylistTracks;
  type: string;
  uri: string;
}

export interface SpotifyPlaylistTracks {
  href: string;
  total: number;
}

export interface SpotifyPagingTracks {
  href: string;
  items: SpotifyTracks[];
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
}

export interface SpotifyTracks {
  added_at: string;
  added_by: object;
  is_local: boolean;
  primary_color: string;
  track: SpotifyTrack;
  video_thumbnail: object;
}

export interface SpotifyTrack {
  album: object;
  artist: object;
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: object;
  external_urls: object;
  href: string;
  id: string;
  is_playable: boolean;
  linked_from: object;
  restrictions: object;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
}

export interface Playlist {
  Name: string;
  TrackHref: string;
  TrackCount: number;
}

export interface Track {
  Name: string;
  Preview: string;
}

export interface Venue {
  ProfileAddress: string;
  ProfileName: string;
  ProfileBiography: string;
  ProfilePictureUrl: string;
  ProfileImageUrls?: string[];
  ProfileRating: number;
  ProfileRatingCount: number;
  ProfileReportCount: number;
  AvailableEquipment: Equipment[];
  Reviews?: Review[];
}

export interface Event {
  EventName: string;
  EventDateTime: Date;
  EventDescription: string;
  EventRestricted: boolean;
  EventRestrictedAge: boolean;
}

export interface Message {
  createdAt?: number;
  read?: boolean;
  senderId: string;
  text: string;
}

export interface Conversation {
  members: string[];
  pitchAccepted: boolean;
  Messages: Message[];
}

