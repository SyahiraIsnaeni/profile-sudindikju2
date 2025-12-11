'use client';

import { useState, useEffect } from 'react';
import { GetContactDTO } from '@/modules/dtos/contacts';
import { Toast, type ToastType } from '@/presentation/components/shared/Toast';

interface ContactFormProps {
  contact: GetContactDTO | null;
  loading: boolean;
  onUpdate: (data: {
    telephone?: string | null;
    faximile?: string | null;
    instagram?: string | null;
    twitter?: string | null;
    tiktok?: string | null;
    youtube?: string | null;
    url_maps?: string | null;
  }) => Promise<void>;
}

export function ContactForm({
  contact,
  loading,
  onUpdate,
}: ContactFormProps) {
  const [telephone, setTelephone] = useState(contact?.telephone || '');
  const [faximile, setFaximile] = useState(contact?.faximile || '');
  const [instagram, setInstagram] = useState(contact?.instagram || '');
  const [twitter, setTwitter] = useState(contact?.twitter || '');
  const [tiktok, setTiktok] = useState(contact?.tiktok || '');
  const [youtube, setYoutube] = useState(contact?.youtube || '');
  const [urlMaps, setUrlMaps] = useState(contact?.url_maps || '');

  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('success');
  const [showToast, setShowToast] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Initialize form with contact data
  useEffect(() => {
    if (contact) {
      setTelephone(contact.telephone || '');
      setFaximile(contact.faximile || '');
      setInstagram(contact.instagram || '');
      setTwitter(contact.twitter || '');
      setTiktok(contact.tiktok || '');
      setYoutube(contact.youtube || '');
      setUrlMaps(contact.url_maps || '');
      setIsDirty(false);
    }
  }, [contact]);

  // Detect if form is dirty (any field has been changed)
  const checkIfDirty = (
    tel: string,
    fax: string,
    ig: string,
    tw: string,
    tk: string,
    yt: string,
    maps: string
  ): boolean => {
    const hasData =
      tel.trim() ||
      fax.trim() ||
      ig.trim() ||
      tw.trim() ||
      tk.trim() ||
      yt.trim() ||
      maps.trim();

    return !!hasData;
  };

  const handleTelephoneChange = (value: string) => {
    setTelephone(value);
    setIsDirty(
      checkIfDirty(value, faximile, instagram, twitter, tiktok, youtube, urlMaps)
    );
  };

  const handleFaximileChange = (value: string) => {
    setFaximile(value);
    setIsDirty(
      checkIfDirty(telephone, value, instagram, twitter, tiktok, youtube, urlMaps)
    );
  };

  const handleInstagramChange = (value: string) => {
    setInstagram(value);
    setIsDirty(
      checkIfDirty(telephone, faximile, value, twitter, tiktok, youtube, urlMaps)
    );
  };

  const handleTwitterChange = (value: string) => {
    setTwitter(value);
    setIsDirty(
      checkIfDirty(telephone, faximile, instagram, value, tiktok, youtube, urlMaps)
    );
  };

  const handleTiktokChange = (value: string) => {
    setTiktok(value);
    setIsDirty(
      checkIfDirty(telephone, faximile, instagram, twitter, value, youtube, urlMaps)
    );
  };

  const handleYoutubeChange = (value: string) => {
    setYoutube(value);
    setIsDirty(
      checkIfDirty(telephone, faximile, instagram, twitter, tiktok, value, urlMaps)
    );
  };

  const handleUrlMapsChange = (value: string) => {
    setUrlMaps(value);
    setIsDirty(
      checkIfDirty(
        telephone,
        faximile,
        instagram,
        twitter,
        tiktok,
        youtube,
        value
      )
    );
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Convert empty strings to null explicitly
      const phoneVal = telephone.trim() || null;
      const faxVal = faximile.trim() || null;
      const igVal = instagram.trim() || null;
      const twVal = twitter.trim() || null;
      const tkVal = tiktok.trim() || null;
      const ytVal = youtube.trim() || null;
      const mapsVal = urlMaps.trim() || null;

      await onUpdate({
        telephone: phoneVal,
        faximile: faxVal,
        instagram: igVal,
        twitter: twVal,
        tiktok: tkVal,
        youtube: ytVal,
        url_maps: mapsVal,
      });

      setToastMessage('Informasi kontak berhasil disimpan');
      setToastType('success');
      setShowToast(true);
      setIsDirty(false);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : 'Gagal menyimpan';
      setToastMessage(errorMsg);
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (contact) {
      setTelephone(contact.telephone || '');
      setFaximile(contact.faximile || '');
      setInstagram(contact.instagram || '');
      setTwitter(contact.twitter || '');
      setTiktok(contact.tiktok || '');
      setYoutube(contact.youtube || '');
      setUrlMaps(contact.url_maps || '');
      setIsDirty(false);
    }
  };

  return (
    <>
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="space-y-6">
        {/* Nomor Telepon */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Nomor Telepon
          </label>
          <input
            type="tel"
            value={telephone}
            onChange={(e) => handleTelephoneChange(e.target.value)}
            placeholder="Contoh: (021) 123-4567"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <p className="text-xs text-gray-500">Maksimal 20 karakter</p>
        </div>

        {/* Nomor Faksimile */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Nomor Faksimile
          </label>
          <input
            type="tel"
            value={faximile}
            onChange={(e) => handleFaximileChange(e.target.value)}
            placeholder="Contoh: (021) 123-4568"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <p className="text-xs text-gray-500">Maksimal 20 karakter</p>
        </div>

        {/* Instagram Link */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Link Instagram
          </label>
          <input
            type="url"
            value={instagram}
            onChange={(e) => handleInstagramChange(e.target.value)}
            placeholder="Contoh: https://instagram.com/sudindikju2"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <p className="text-xs text-gray-500">Format URL yang valid (https://...)</p>
        </div>

        {/* Twitter Link */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Link Twitter
          </label>
          <input
            type="url"
            value={twitter}
            onChange={(e) => handleTwitterChange(e.target.value)}
            placeholder="Contoh: https://twitter.com/sudindikju2"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <p className="text-xs text-gray-500">Format URL yang valid (https://...)</p>
        </div>

        {/* TikTok Link */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Link TikTok
          </label>
          <input
            type="url"
            value={tiktok}
            onChange={(e) => handleTiktokChange(e.target.value)}
            placeholder="Contoh: https://tiktok.com/@sudindikju2"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <p className="text-xs text-gray-500">Format URL yang valid (https://...)</p>
        </div>

        {/* YouTube Link */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Link YouTube
          </label>
          <input
            type="url"
            value={youtube}
            onChange={(e) => handleYoutubeChange(e.target.value)}
            placeholder="Contoh: https://youtube.com/@sudindikju2"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <p className="text-xs text-gray-500">Format URL yang valid (https://...)</p>
        </div>

        {/* URL Maps */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            URL Google Maps
          </label>
          <input
            type="url"
            value={urlMaps}
            onChange={(e) => handleUrlMapsChange(e.target.value)}
            placeholder="Contoh: https://maps.google.com/..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <p className="text-xs text-gray-500">Format URL yang valid (https://...)</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <button
            onClick={handleSave}
            disabled={!isDirty || isSaving || loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </button>
          <button
            onClick={handleReset}
            disabled={!isDirty || isSaving || loading}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed transition font-medium"
          >
            Batalkan
          </button>
        </div>
      </div>
    </>
  );
}
