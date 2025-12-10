export class UpdateGaleriKegiatanDTO {
    id: number;
    judul?: string;
    foto?: string | null;
    status?: number;

    constructor(
        id: number,
        judul?: string,
        status?: number,
        foto?: string | null,
    ) {
        this.id = id;
        this.judul = judul;
        this.foto = foto || null;
        this.status = status;
    }
}
