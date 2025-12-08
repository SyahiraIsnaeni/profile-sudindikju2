import { ProfileRepository } from '@/modules/repositories/profiles/ProfileRepository';
import { UpdateProfileDTO, GetProfileDTO } from '@/modules/dtos/profiles';
import { Profile } from '@/modules/entities/profiles/Profile';

export class ProfileController {
    private profileRepository: ProfileRepository;

    constructor() {
        this.profileRepository = new ProfileRepository();
    }

    /**
     * Get profile by ID (default 1)
     */
    async getProfile(id: number = 1): Promise<GetProfileDTO | null> {
        try {
            const profile = await this.profileRepository.getProfile(id);

            if (!profile) {
                return null;
            }

            return new GetProfileDTO({
                id: profile.id,
                description: profile.description,
                vision: profile.vision,
                mission: profile.mission,
                motto: profile.motto,
                structure_org: profile.structure_org,
                maklumat: profile.maklumat,
                task_org: profile.task_org,
                function_org: profile.function_org,
                created_at: profile.created_at,
                updated_at: profile.updated_at,
            });
        } catch (error) {
            console.error('Error in getProfile:', error);
            throw error;
        }
    }

    /**
     * Update deskripsi dan motto
     */
    async updateDeskripsiMotto(
        id: number,
        dto: { description?: string | null; motto?: string | null }
    ): Promise<GetProfileDTO> {
        try {
            // Validation
            if (dto.description && dto.description.length > 2000) {
                throw new Error('Deskripsi maksimal 2000 karakter');
            }
            if (dto.motto && dto.motto.length > 1000) {
                throw new Error('Motto maksimal 1000 karakter');
            }

            const profile = await this.profileRepository.updateDeskripsiMotto(id, dto);

            return new GetProfileDTO({
                id: profile.id,
                description: profile.description,
                vision: profile.vision,
                mission: profile.mission,
                motto: profile.motto,
                structure_org: profile.structure_org,
                maklumat: profile.maklumat,
                task_org: profile.task_org,
                function_org: profile.function_org,
                created_at: profile.created_at,
                updated_at: profile.updated_at,
            });
        } catch (error) {
            console.error('Error in updateDeskripsiMotto:', error);
            throw error;
        }
    }

    /**
     * Update visi dan misi
     */
    async updateVisiMisi(
        id: number,
        dto: { vision?: string | null; mission?: string | null }
    ): Promise<GetProfileDTO> {
        try {
            // Validation
            if (dto.vision && dto.vision.length > 1000) {
                throw new Error('Visi maksimal 1000 karakter');
            }
            if (dto.mission && dto.mission.length > 1000) {
                throw new Error('Misi maksimal 1000 karakter');
            }

            const profile = await this.profileRepository.updateVisiMisi(id, dto);

            return new GetProfileDTO({
                id: profile.id,
                description: profile.description,
                vision: profile.vision,
                mission: profile.mission,
                motto: profile.motto,
                structure_org: profile.structure_org,
                maklumat: profile.maklumat,
                task_org: profile.task_org,
                function_org: profile.function_org,
                created_at: profile.created_at,
                updated_at: profile.updated_at,
            });
        } catch (error) {
            console.error('Error in updateVisiMisi:', error);
            throw error;
        }
    }

    /**
     * Update struktur organisasi
     */
    async updateStrukturOrganisasi(
        id: number,
        structure_org: string
    ): Promise<GetProfileDTO> {
        try {
            if (!structure_org || structure_org.trim() === '') {
                throw new Error('Struktur organisasi tidak boleh kosong');
            }

            const profile = await this.profileRepository.updateStrukturOrganisasi(
                id,
                structure_org
            );

            return new GetProfileDTO({
                id: profile.id,
                description: profile.description,
                vision: profile.vision,
                mission: profile.mission,
                motto: profile.motto,
                structure_org: profile.structure_org,
                maklumat: profile.maklumat,
                task_org: profile.task_org,
                function_org: profile.function_org,
                created_at: profile.created_at,
                updated_at: profile.updated_at,
            });
        } catch (error) {
            console.error('Error in updateStrukturOrganisasi:', error);
            throw error;
        }
    }

    /**
     * Update maklumat organisasi
     */
    async updateMaklumatOrganisasi(
        id: number,
        maklumat: string
    ): Promise<GetProfileDTO> {
        try {
            if (!maklumat || maklumat.trim() === '') {
                throw new Error('Maklumat organisasi tidak boleh kosong');
            }

            const profile = await this.profileRepository.updateMaklumatOrganisasi(
                id,
                maklumat
            );

            return new GetProfileDTO({
                id: profile.id,
                description: profile.description,
                vision: profile.vision,
                mission: profile.mission,
                motto: profile.motto,
                structure_org: profile.structure_org,
                maklumat: profile.maklumat,
                task_org: profile.task_org,
                function_org: profile.function_org,
                created_at: profile.created_at,
                updated_at: profile.updated_at,
            });
        } catch (error) {
            console.error('Error in updateMaklumatOrganisasi:', error);
            throw error;
        }
    }

    /**
     * Update tugas dan fungsi
     */
    async updateTugasFungsi(
        id: number,
        dto: { task_org?: string | null; function_org?: string | null }
    ): Promise<GetProfileDTO> {
        try {
            if (dto.task_org && dto.task_org.length > 2000) {
                throw new Error('Tugas maksimal 2000 karakter');
            }
            if (dto.function_org && dto.function_org.length > 2000) {
                throw new Error('Fungsi maksimal 2000 karakter');
            }

            const profile = await this.profileRepository.updateTugasFungsi(id, dto);

            return new GetProfileDTO({
                id: profile.id,
                description: profile.description,
                vision: profile.vision,
                mission: profile.mission,
                motto: profile.motto,
                structure_org: profile.structure_org,
                maklumat: profile.maklumat,
                task_org: profile.task_org,
                function_org: profile.function_org,
                created_at: profile.created_at,
                updated_at: profile.updated_at,
            });
        } catch (error) {
            console.error('Error in updateTugasFungsi:', error);
            throw error;
        }
    }

    /**
     * Update profile completely
     */
    async updateProfile(id: number, dto: UpdateProfileDTO): Promise<GetProfileDTO> {
        try {
            const errors = dto.validate();
            if (errors.length > 0) {
                throw new Error(errors.join(', '));
            }

            const profile = await this.profileRepository.updateProfile(id, dto);

            return new GetProfileDTO({
                id: profile.id,
                description: profile.description,
                vision: profile.vision,
                mission: profile.mission,
                motto: profile.motto,
                structure_org: profile.structure_org,
                maklumat: profile.maklumat,
                task_org: profile.task_org,
                function_org: profile.function_org,
                created_at: profile.created_at,
                updated_at: profile.updated_at,
            });
        } catch (error) {
            console.error('Error in updateProfile:', error);
            throw error;
        }
    }
}
