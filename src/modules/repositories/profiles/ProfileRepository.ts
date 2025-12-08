import { PrismaClient } from '@prisma/client';
import { Profile } from '@/modules/entities/profiles/Profile';
import { UpdateProfileDTO } from '@/modules/dtos/profiles';

const prisma = new PrismaClient();

export class ProfileRepository {
    /**
     * Get profile by ID (default ID=1)
     * Auto-create empty profile if not exists
     */
    async getProfile(id: number = 1): Promise<Profile | null> {
        try {
            let data = await prisma.profile.findUnique({
                where: { id },
            });

            // Auto-create empty profile if not exists
            if (!data) {
                data = await prisma.profile.create({
                    data: {
                        id,
                    },
                });
            }

            return new Profile({
                id: data.id,
                description: data.description,
                vision: data.vision,
                mission: data.mission,
                motto: data.motto,
                structure_org: data.structure_org,
                maklumat: data.maklumat,
                task_org: data.task_org,
                function_org: data.function_org,
                created_at: data.created_at,
                updated_at: data.updated_at,
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            throw error;
        }
    }

    /**
     * Update deskripsi dan motto
     */
    async updateDeskripsiMotto(
        id: number,
        data: { description?: string | null; motto?: string | null }
    ): Promise<Profile> {
        try {
            const updated = await prisma.profile.update({
                where: { id },
                data: {
                    description: data.description ?? undefined,
                    motto: data.motto ?? undefined,
                    updated_at: new Date(),
                },
            });

            return new Profile({
                id: updated.id,
                description: updated.description,
                vision: updated.vision,
                mission: updated.mission,
                motto: updated.motto,
                structure_org: updated.structure_org,
                maklumat: updated.maklumat,
                task_org: updated.task_org,
                function_org: updated.function_org,
                created_at: updated.created_at,
                updated_at: updated.updated_at,
            });
        } catch (error) {
            console.error('Error updating deskripsi motto:', error);
            throw error;
        }
    }

    /**
     * Update visi dan misi
     */
    async updateVisiMisi(
        id: number,
        data: { vision?: string | null; mission?: string | null }
    ): Promise<Profile> {
        try {
            const updated = await prisma.profile.update({
                where: { id },
                data: {
                    vision: data.vision ?? undefined,
                    mission: data.mission ?? undefined,
                    updated_at: new Date(),
                },
            });

            return new Profile({
                id: updated.id,
                description: updated.description,
                vision: updated.vision,
                mission: updated.mission,
                motto: updated.motto,
                structure_org: updated.structure_org,
                maklumat: updated.maklumat,
                task_org: updated.task_org,
                function_org: updated.function_org,
                created_at: updated.created_at,
                updated_at: updated.updated_at,
            });
        } catch (error) {
            console.error('Error updating visi misi:', error);
            throw error;
        }
    }

    /**
     * Update struktur organisasi (file path/URL)
     */
    async updateStrukturOrganisasi(
        id: number,
        structure_org: string
    ): Promise<Profile> {
        try {
            const updated = await prisma.profile.update({
                where: { id },
                data: {
                    structure_org,
                    updated_at: new Date(),
                },
            });

            return new Profile({
                id: updated.id,
                description: updated.description,
                vision: updated.vision,
                mission: updated.mission,
                motto: updated.motto,
                structure_org: updated.structure_org,
                maklumat: updated.maklumat,
                task_org: updated.task_org,
                function_org: updated.function_org,
                created_at: updated.created_at,
                updated_at: updated.updated_at,
            });
        } catch (error) {
            console.error('Error updating struktur organisasi:', error);
            throw error;
        }
    }

    /**
     * Update maklumat organisasi (file path/URL)
     */
    async updateMaklumatOrganisasi(id: number, maklumat: string): Promise<Profile> {
        try {
            const updated = await prisma.profile.update({
                where: { id },
                data: {
                    maklumat,
                    updated_at: new Date(),
                },
            });

            return new Profile({
                id: updated.id,
                description: updated.description,
                vision: updated.vision,
                mission: updated.mission,
                motto: updated.motto,
                structure_org: updated.structure_org,
                maklumat: updated.maklumat,
                task_org: updated.task_org,
                function_org: updated.function_org,
                created_at: updated.created_at,
                updated_at: updated.updated_at,
            });
        } catch (error) {
            console.error('Error updating maklumat organisasi:', error);
            throw error;
        }
    }

    /**
     * Update tugas dan fungsi
     */
    async updateTugasFungsi(
        id: number,
        data: { task_org?: string | null; function_org?: string | null }
    ): Promise<Profile> {
        try {
            const updated = await prisma.profile.update({
                where: { id },
                data: {
                    task_org: data.task_org ?? undefined,
                    function_org: data.function_org ?? undefined,
                    updated_at: new Date(),
                },
            });

            return new Profile({
                id: updated.id,
                description: updated.description,
                vision: updated.vision,
                mission: updated.mission,
                motto: updated.motto,
                structure_org: updated.structure_org,
                maklumat: updated.maklumat,
                task_org: updated.task_org,
                function_org: updated.function_org,
                created_at: updated.created_at,
                updated_at: updated.updated_at,
            });
        } catch (error) {
            console.error('Error updating tugas fungsi:', error);
            throw error;
        }
    }

    /**
     * Update profile completely
     */
    async updateProfile(id: number, dto: UpdateProfileDTO): Promise<Profile> {
        try {
            const updateData: any = { updated_at: new Date() };

            if (dto.description !== undefined) updateData.description = dto.description;
            if (dto.vision !== undefined) updateData.vision = dto.vision;
            if (dto.mission !== undefined) updateData.mission = dto.mission;
            if (dto.motto !== undefined) updateData.motto = dto.motto;
            if (dto.structure_org !== undefined) updateData.structure_org = dto.structure_org;
            if (dto.maklumat !== undefined) updateData.maklumat = dto.maklumat;
            if (dto.task_org !== undefined) updateData.task_org = dto.task_org;
            if (dto.function_org !== undefined) updateData.function_org = dto.function_org;

            const updated = await prisma.profile.update({
                where: { id },
                data: updateData,
            });

            return new Profile({
                id: updated.id,
                description: updated.description,
                vision: updated.vision,
                mission: updated.mission,
                motto: updated.motto,
                structure_org: updated.structure_org,
                maklumat: updated.maklumat,
                task_org: updated.task_org,
                function_org: updated.function_org,
                created_at: updated.created_at,
                updated_at: updated.updated_at,
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }
}
