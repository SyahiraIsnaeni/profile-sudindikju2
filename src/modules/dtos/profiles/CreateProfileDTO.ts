export class CreateProfileDTO {
  visi?: string | null;
  misi?: string | null;
  motto?: string | null;
  struktur_organisasi?: string | null;
  maklumat?: string | null;
  tugas?: string | null;
  fungsi?: string | null;

  constructor(data?: Partial<CreateProfileDTO>) {
    this.visi = data?.visi ?? null;
    this.misi = data?.misi ?? null;
    this.motto = data?.motto ?? null;
    this.struktur_organisasi = data?.struktur_organisasi ?? null;
    this.maklumat = data?.maklumat ?? null;
    this.tugas = data?.tugas ?? null;
    this.fungsi = data?.fungsi ?? null;
  }

  validate(): string[] {
    const errors: string[] = [];
    
    if (this.visi && this.visi.length > 1000) {
      errors.push('Visi maksimal 1000 karakter');
    }
    if (this.misi && this.misi.length > 1000) {
      errors.push('Misi maksimal 1000 karakter');
    }
    if (this.motto && this.motto.length > 255) {
      errors.push('Motto maksimal 255 karakter');
    }

    return errors;
  }
}
