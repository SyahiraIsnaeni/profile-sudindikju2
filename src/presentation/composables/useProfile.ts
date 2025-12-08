'use client';

import { useState, useEffect } from 'react';
import { GetProfileDTO } from '@/modules/dtos/profiles';

interface UseProfileReturn {
    profile: GetProfileDTO | null;
    loading: boolean;
    error: string | null;
    activeTab: number;
    setActiveTab: (tab: number) => void;
    fetchProfile: () => Promise<void>;
    updateDeskripsiMotto: (deskripsi?: string, motto?: string) => Promise<void>;
    updateVisiMisi: (visi?: string, misi?: string) => Promise<void>;
    updateStrukturOrganisasi: (file: File) => Promise<void>;
    updateMaklumatOrganisasi: (file: File) => Promise<void>;
    updateTugasFungsi: (tugas?: string, fungsi?: string) => Promise<void>;
    clearError: () => void;
}

export function useProfile(): UseProfileReturn {
    const [profile, setProfile] = useState<GetProfileDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<number>(0);

    /**
     * Fetch profile from API
     */
    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/master-data/profiles');
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Gagal mengambil data profile');
            }

            setProfile(result.data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan';
            setError(errorMessage);
            console.error('fetchProfile error:', err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Update deskripsi dan motto
     */
    const updateDeskripsiMotto = async (
        deskripsi?: string,
        motto?: string
    ) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/master-data/profiles/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'deskripsi-motto',
                    description: deskripsi || null,
                    motto: motto || null,
                }),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Gagal mengupdate deskripsi motto');
            }

            setProfile(result.data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan';
            setError(errorMessage);
            console.error('updateDeskripsiMotto error:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Update visi, misi
     */
    const updateVisiMisi = async (
        visi?: string,
        misi?: string
    ) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/master-data/profiles/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'visi-misi',
                    vision: visi || null,
                    mission: misi || null,
                }),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Gagal mengupdate visi misi');
            }

            setProfile(result.data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan';
            setError(errorMessage);
            console.error('updateVisiMisi error:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Update struktur organisasi (upload file)
     */
    const updateStrukturOrganisasi = async (file: File) => {
        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append('type', 'struktur-org');
            formData.append('file', file);

            const response = await fetch('/api/master-data/profiles/update', {
                method: 'PUT',
                body: formData,
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Gagal mengupload struktur organisasi');
            }

            setProfile(result.data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan';
            setError(errorMessage);
            console.error('updateStrukturOrganisasi error:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Update maklumat organisasi (upload file)
     */
    const updateMaklumatOrganisasi = async (file: File) => {
        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append('type', 'maklumat');
            formData.append('file', file);

            const response = await fetch('/api/master-data/profiles/update', {
                method: 'PUT',
                body: formData,
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Gagal mengupload maklumat organisasi');
            }

            setProfile(result.data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan';
            setError(errorMessage);
            console.error('updateMaklumatOrganisasi error:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Update tugas dan fungsi
     */
    const updateTugasFungsi = async (tugas?: string, fungsi?: string) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/master-data/profiles/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'tugas-fungsi',
                    task_org: tugas || null,
                    function_org: fungsi || null,
                }),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Gagal mengupdate tugas fungsi');
            }

            setProfile(result.data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan';
            setError(errorMessage);
            console.error('updateTugasFungsi error:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Clear error message
     */
    const clearError = () => {
        setError(null);
    };

    /**
     * Fetch profile on mount
     */
    useEffect(() => {
        fetchProfile();
    }, []);

    return {
        profile,
        loading,
        error,
        activeTab,
        setActiveTab,
        fetchProfile,
        updateDeskripsiMotto,
        updateVisiMisi,
        updateStrukturOrganisasi,
        updateMaklumatOrganisasi,
        updateTugasFungsi,
        clearError,
    };
}
