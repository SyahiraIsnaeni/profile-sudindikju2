import { PrismaClient } from '@prisma/client';
import { Contact } from '@/modules/entities/contacts/Contact';
import { UpdateContactDTO } from '@/modules/dtos/contacts';

const prisma = new PrismaClient();

export class ContactRepository {
  /**
   * Get contact by ID (default ID=1)
   * Auto-create empty contact if not exists
   */
  async getContact(id: number = 1): Promise<Contact | null> {
    try {
      let data = await prisma.contact.findUnique({
        where: { id },
      });

      // Auto-create empty contact if not exists
      if (!data) {
        data = await prisma.contact.create({
          data: {
            id,
          },
        });
      }

      return new Contact({
        id: data.id,
        telephone: data.telephone,
        faximile: data.faximile,
        instagram: data.instagram,
        twitter: data.twitter,
        tiktok: data.tiktok,
        youtube: data.youtube,
        url_maps: data.url_maps,
        created_at: data.created_at,
        updated_at: data.updated_at,
      });
    } catch (error) {
      console.error('Error fetching contact:', error);
      throw error;
    }
  }

  /**
   * Update contact completely
   */
  async updateContact(id: number, dto: UpdateContactDTO): Promise<Contact> {
    try {
      const updateData: any = { updated_at: new Date() };

      // Update all fields from DTO (including null values to delete data)
      updateData.telephone = dto.telephone;
      updateData.faximile = dto.faximile;
      updateData.instagram = dto.instagram;
      updateData.twitter = dto.twitter;
      updateData.tiktok = dto.tiktok;
      updateData.youtube = dto.youtube;
      updateData.url_maps = dto.url_maps;

      const updated = await prisma.contact.update({
        where: { id },
        data: updateData,
      });

      return new Contact({
        id: updated.id,
        telephone: updated.telephone,
        faximile: updated.faximile,
        instagram: updated.instagram,
        twitter: updated.twitter,
        tiktok: updated.tiktok,
        youtube: updated.youtube,
        url_maps: updated.url_maps,
        created_at: updated.created_at,
        updated_at: updated.updated_at,
      });
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }
}
