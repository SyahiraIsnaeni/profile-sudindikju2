export class UpdateContactDTO {
  telephone?: string | null;
  faximile?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  tiktok?: string | null;
  youtube?: string | null;
  url_maps?: string | null;

  constructor(data: {
    telephone?: string | null;
    faximile?: string | null;
    instagram?: string | null;
    twitter?: string | null;
    tiktok?: string | null;
    youtube?: string | null;
    url_maps?: string | null;
  }) {
    // Trim empty strings to null, keep explicit null
    this.telephone = data.telephone?.trim() || null;
    this.faximile = data.faximile?.trim() || null;
    this.instagram = data.instagram?.trim() || null;
    this.twitter = data.twitter?.trim() || null;
    this.tiktok = data.tiktok?.trim() || null;
    this.youtube = data.youtube?.trim() || null;
    this.url_maps = data.url_maps?.trim() || null;
  }

  /**
   * Validate DTO - Only validate non-null values
   */
  validate(): string[] {
    const errors: string[] = [];

    // Validate telephone - only if has value
    if (this.telephone && this.telephone.trim().length > 0) {
      if (this.telephone.length > 20) {
        errors.push('Nomor telepon maksimal 20 karakter');
      }
    }

    // Validate faximile - only if has value
    if (this.faximile && this.faximile.trim().length > 0) {
      if (this.faximile.length > 20) {
        errors.push('Nomor faksimile maksimal 20 karakter');
      }
    }

    // Validate URLs format - only if has value
    if (this.instagram && this.instagram.trim().length > 0) {
      if (!this.isValidUrl(this.instagram)) {
        errors.push('Format Instagram link tidak valid');
      }
    }

    if (this.twitter && this.twitter.trim().length > 0) {
      if (!this.isValidUrl(this.twitter)) {
        errors.push('Format Twitter link tidak valid');
      }
    }

    if (this.tiktok && this.tiktok.trim().length > 0) {
      if (!this.isValidUrl(this.tiktok)) {
        errors.push('Format TikTok link tidak valid');
      }
    }

    if (this.youtube && this.youtube.trim().length > 0) {
      if (!this.isValidUrl(this.youtube)) {
        errors.push('Format YouTube link tidak valid');
      }
    }

    if (this.url_maps && this.url_maps.trim().length > 0) {
      if (!this.isValidUrl(this.url_maps)) {
        errors.push('Format URL Maps tidak valid');
      }
    }

    return errors;
  }

  /**
   * Check if string is valid URL
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if any field has value
   */
  hasAnyValue(): boolean {
    return !!(
      this.telephone ||
      this.faximile ||
      this.instagram ||
      this.twitter ||
      this.tiktok ||
      this.youtube ||
      this.url_maps
    );
  }
}
