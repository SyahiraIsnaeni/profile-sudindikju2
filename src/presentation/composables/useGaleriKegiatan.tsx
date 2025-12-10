'use client';

import { useState, useCallback } from 'react';

interface GaleriKegiatan {
    id: number;
    judul: string;
    foto?: string | null;
    status: number;
    created_at: Date;
    updated_at: Date;
}

interface PaginationMeta {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export const useGaleriKegiatan = () => {
    const [galeriKegiatans, setGaleriKegiatans] = useState<GaleriKegiatan[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);

    const fetchGaleriKegiatans = useCallback(async (currentPage = 1, size = 10) => {
        setLoading(true);
        try {
            const response = await fetch(
                `/api/dashboard/galeri-kegiatans?page=${currentPage}&pageSize=${size}`,
            );

            if (!response.ok) {
                throw new Error('Gagal mengambil data galeri kegiatan');
            }

            const data = await response.json();
            setGaleriKegiatans(data.data || []);
            setMeta(data.meta || null);
            setPage(currentPage);
            setPageSize(size);
        } catch (error) {
            console.error('[useGaleriKegiatan] Fetch error:', error);
            setGaleriKegiatans([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const refetchGaleriKegiatans = useCallback(async () => {
        await fetchGaleriKegiatans(page, pageSize);
    }, [page, pageSize, fetchGaleriKegiatans]);

    // Initial load
    useState(() => {
        fetchGaleriKegiatans(1, 10);
    });

    return {
        galeriKegiatans,
        loading,
        page,
        setPage,
        pageSize,
        setPageSize,
        meta,
        fetchGaleriKegiatans,
        refetchGaleriKegiatans,
    };
};
