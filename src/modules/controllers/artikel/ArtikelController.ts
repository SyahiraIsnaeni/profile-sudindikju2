import { CreateArtikelDTO, UpdateArtikelDTO, ArtikelQueryDTO } from '../../dtos/artikel';
import { ArtikelResponse } from '../../entities/artikel/Artikel';
import { ArtikelRepository } from '../../repositories/artikel/ArtikelRepository';

const artikelRepository = new ArtikelRepository();

export class ArtikelController {
    static async getAll(query: ArtikelQueryDTO) {
        try {
            const result = await artikelRepository.getAll(query);

            const artikelsResponse: ArtikelResponse[] = result.artikels.map((artikel) => ({
                id: artikel.id,
                judul: artikel.judul,
                deskripsi: artikel.deskripsi,
                kategori: artikel.kategori,
                gambar: artikel.gambar,
                file: artikel.file,
                penulis: artikel.penulis,
                tanggal: artikel.tanggal,
                status: artikel.status,
                created_at: artikel.created_at,
                updated_at: artikel.updated_at,
            }));

            return {
                success: true,
                data: artikelsResponse,
                meta: {
                    total: result.total,
                    page: result.page,
                    pageSize: result.pageSize,
                    totalPages: result.totalPages,
                },
            };
        } catch (error) {
            console.error('[ArtikelController] Error in getAll:', error);
            throw error;
        }
    }

    static async getById(artikelId: number) {
        try {
            const artikel = await artikelRepository.getById(artikelId);

            const response: ArtikelResponse = {
                id: artikel.id,
                judul: artikel.judul,
                deskripsi: artikel.deskripsi,
                kategori: artikel.kategori,
                gambar: artikel.gambar,
                file: artikel.file,
                penulis: artikel.penulis,
                tanggal: artikel.tanggal,
                status: artikel.status,
                created_at: artikel.created_at,
                updated_at: artikel.updated_at,
            };

            return { success: true, data: response };
        } catch (error) {
            console.error('[ArtikelController] Error in getById:', error);
            throw error;
        }
    }

    static async create(dto: CreateArtikelDTO) {
        try {
            const artikel = await artikelRepository.create(dto);

            const response: ArtikelResponse = {
                id: artikel.id,
                judul: artikel.judul,
                deskripsi: artikel.deskripsi,
                kategori: artikel.kategori,
                gambar: artikel.gambar,
                file: artikel.file,
                penulis: artikel.penulis,
                tanggal: artikel.tanggal,
                status: artikel.status,
                created_at: artikel.created_at,
                updated_at: artikel.updated_at,
            };

            return {
                success: true,
                data: response,
                message: 'Artikel berhasil dibuat',
            };
        } catch (error) {
            console.error('[ArtikelController] Error in create:', error);
            throw error;
        }
    }

    static async update(artikelId: number, dto: UpdateArtikelDTO) {
        try {
            const updatedArtikel = await artikelRepository.update(artikelId, dto);

            const response: ArtikelResponse = {
                id: updatedArtikel.id,
                judul: updatedArtikel.judul,
                deskripsi: updatedArtikel.deskripsi,
                kategori: updatedArtikel.kategori,
                gambar: updatedArtikel.gambar,
                file: updatedArtikel.file,
                penulis: updatedArtikel.penulis,
                tanggal: updatedArtikel.tanggal,
                status: updatedArtikel.status,
                created_at: updatedArtikel.created_at,
                updated_at: updatedArtikel.updated_at,
            };

            return {
                success: true,
                data: response,
                message: 'Artikel berhasil diupdate',
            };
        } catch (error) {
            console.error('[ArtikelController] Error in update:', error);
            throw error;
        }
    }

    static async delete(artikelId: number) {
        try {
            await artikelRepository.delete(artikelId);

            return { success: true, message: 'Artikel berhasil dihapus' };
        } catch (error) {
            console.error('[ArtikelController] Error in delete:', error);
            throw error;
        }
    }

    static async getAllKategoris() {
        try {
            const kategoris = await artikelRepository.getAllKategoris();

            return {
                success: true,
                data: kategoris,
            };
        } catch (error) {
            console.error('[ArtikelController] Error in getAllKategoris:', error);
            throw error;
        }
    }
}
