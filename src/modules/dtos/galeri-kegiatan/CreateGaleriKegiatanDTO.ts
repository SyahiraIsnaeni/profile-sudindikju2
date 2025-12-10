export class CreateGaleriKegiatanDTO {
    judul: string;
    foto?: string | null;
    status: number;

    constructor(
        judul: string,
        status: number,
        foto?: string | null,
    ) {
        this.judul = judul;
        this.foto = foto || null;
        this.status = status;
    }
}
