export class GaleriKegiatan {
    id: number;
    judul: string;
    foto?: string | null;
    status: number;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date | null;

    constructor(
        id: number,
        judul: string,
        status: number,
        created_at: Date,
        updated_at: Date,
        foto?: string | null,
        deleted_at?: Date | null,
    ) {
        this.id = id;
        this.judul = judul;
        this.foto = foto || null;
        this.status = status;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.deleted_at = deleted_at || null;
    }
}
