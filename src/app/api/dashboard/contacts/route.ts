import { NextRequest, NextResponse } from 'next/server';
import { ContactController } from '@/modules/controllers/contacts/ContactController';
import { UpdateContactDTO } from '@/modules/dtos/contacts';

/**
 * GET /api/dashboard/contacts
 * Fetch contact information
 */
export async function GET(request: NextRequest) {
  try {
    const contactController = new ContactController();
    const contact = await contactController.getContact(1);

    return NextResponse.json(
      {
        success: true,
        message: 'Data kontak berhasil diambil',
        data: contact,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('GET /api/dashboard/contacts error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Gagal mengambil data kontak',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/dashboard/contacts
 * Update contact information
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const dto = new UpdateContactDTO({
      telephone: body.telephone ?? null,
      faximile: body.faximile ?? null,
      instagram: body.instagram ?? null,
      twitter: body.twitter ?? null,
      tiktok: body.tiktok ?? null,
      youtube: body.youtube ?? null,
      url_maps: body.url_maps ?? null,
    });

    const contactController = new ContactController();
    const updatedContact = await contactController.updateContact(1, dto);

    return NextResponse.json(
      {
        success: true,
        message: 'Informasi kontak berhasil diperbarui',
        data: updatedContact,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('PUT /api/dashboard/contacts error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Gagal mengupdate informasi kontak',
      },
      { status: 500 }
    );
  }
}
