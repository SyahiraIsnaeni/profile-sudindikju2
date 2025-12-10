'use client';

import { useState, useEffect } from 'react';
import { GetContactDTO } from '@/modules/dtos/contacts';

interface UseContactReturn {
  contact: GetContactDTO | null;
  loading: boolean;
  error: string | null;
  fetchContact: () => Promise<void>;
  updateContact: (data: {
    telephone?: string | null;
    faximile?: string | null;
    instagram?: string | null;
    twitter?: string | null;
    tiktok?: string | null;
    youtube?: string | null;
    url_maps?: string | null;
  }) => Promise<void>;
  clearError: () => void;
}

export function useContact(): UseContactReturn {
  const [contact, setContact] = useState<GetContactDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch contact from API
   */
  const fetchContact = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/dashboard/contacts');
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Gagal mengambil data kontak');
      }

      setContact(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan';
      setError(errorMessage);
      console.error('fetchContact error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update contact
   */
  const updateContact = async (data: {
    telephone?: string | null;
    faximile?: string | null;
    instagram?: string | null;
    twitter?: string | null;
    tiktok?: string | null;
    youtube?: string | null;
    url_maps?: string | null;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/dashboard/contacts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Gagal mengupdate kontak');
      }

      setContact(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan';
      setError(errorMessage);
      console.error('updateContact error:', err);
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
   * Fetch contact on mount
   */
  useEffect(() => {
    fetchContact();
  }, []);

  return {
    contact,
    loading,
    error,
    fetchContact,
    updateContact,
    clearError,
  };
}
