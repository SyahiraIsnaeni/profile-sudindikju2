export class GetContactDTO {
  id: number;
  telephone?: string | null;
  faximile?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  tiktok?: string | null;
  youtube?: string | null;
  url_maps?: string | null;
  created_at: Date;
  updated_at: Date;

  constructor(data: {
    id: number;
    telephone?: string | null;
    faximile?: string | null;
    instagram?: string | null;
    twitter?: string | null;
    tiktok?: string | null;
    youtube?: string | null;
    url_maps?: string | null;
    created_at: Date;
    updated_at: Date;
  }) {
    this.id = data.id;
    this.telephone = data.telephone ?? null;
    this.faximile = data.faximile ?? null;
    this.instagram = data.instagram ?? null;
    this.twitter = data.twitter ?? null;
    this.tiktok = data.tiktok ?? null;
    this.youtube = data.youtube ?? null;
    this.url_maps = data.url_maps ?? null;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}
