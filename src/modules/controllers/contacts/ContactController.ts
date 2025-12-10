import { ContactRepository } from '@/modules/repositories/contacts/ContactRepository';
import { UpdateContactDTO, GetContactDTO } from '@/modules/dtos/contacts';
import { Contact } from '@/modules/entities/contacts/Contact';

export class ContactController {
  private contactRepository: ContactRepository;

  constructor() {
    this.contactRepository = new ContactRepository();
  }

  /**
   * Get contact by ID (default 1)
   */
  async getContact(id: number = 1): Promise<GetContactDTO | null> {
    try {
      const contact = await this.contactRepository.getContact(id);

      if (!contact) {
        return null;
      }

      return new GetContactDTO({
        id: contact.id,
        telephone: contact.telephone,
        faximile: contact.faximile,
        instagram: contact.instagram,
        twitter: contact.twitter,
        tiktok: contact.tiktok,
        youtube: contact.youtube,
        url_maps: contact.url_maps,
        created_at: contact.created_at,
        updated_at: contact.updated_at,
      });
    } catch (error) {
      console.error('Error in getContact:', error);
      throw error;
    }
  }

  /**
   * Update contact
   */
  async updateContact(id: number, dto: UpdateContactDTO): Promise<GetContactDTO> {
    try {
      // Validation
      const errors = dto.validate();
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      const contact = await this.contactRepository.updateContact(id, dto);

      return new GetContactDTO({
        id: contact.id,
        telephone: contact.telephone,
        faximile: contact.faximile,
        instagram: contact.instagram,
        twitter: contact.twitter,
        tiktok: contact.tiktok,
        youtube: contact.youtube,
        url_maps: contact.url_maps,
        created_at: contact.created_at,
        updated_at: contact.updated_at,
      });
    } catch (error) {
      console.error('Error in updateContact:', error);
      throw error;
    }
  }
}
