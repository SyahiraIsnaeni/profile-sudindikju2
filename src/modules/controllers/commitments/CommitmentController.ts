import { CreateCommitmentDTO, UpdateCommitmentDTO, CommitmentQueryDTO } from '../../dtos/commitments';
import { CommitmentResponse } from '../../entities/commitments/Commitment';
import { CommitmentRepository } from '../../repositories/commitments/CommitmentRepository';

const commitmentRepository = new CommitmentRepository();

export class CommitmentController {
    static async getAll(query: CommitmentQueryDTO) {
        try {
            const result = await commitmentRepository.getAll(query);

            const commitmentsResponse: CommitmentResponse[] = result.commitments.map((commitment) => ({
                id: commitment.id,
                name: commitment.name,
                description: commitment.description,
                file: commitment.file,
                icon: commitment.icon,
                sort_order: commitment.sort_order,
                status: commitment.status,
                created_at: commitment.created_at,
                updated_at: commitment.updated_at,
            }));

            return {
                success: true,
                data: commitmentsResponse,
                meta: {
                    total: result.total,
                    page: result.page,
                    pageSize: result.pageSize,
                    totalPages: result.totalPages,
                },
            };
        } catch (error) {
            console.error('[CommitmentController] Error in getAll:', error);
            throw error;
        }
    }

    static async getById(commitmentId: number) {
        try {
            const commitment = await commitmentRepository.getById(commitmentId);

            const response: CommitmentResponse = {
                id: commitment.id,
                name: commitment.name,
                description: commitment.description,
                file: commitment.file,
                icon: commitment.icon,
                sort_order: commitment.sort_order,
                status: commitment.status,
                created_at: commitment.created_at,
                updated_at: commitment.updated_at,
            };

            return { success: true, data: response };
        } catch (error) {
            console.error('[CommitmentController] Error in getById:', error);
            throw error;
        }
    }

    static async create(dto: CreateCommitmentDTO) {
        try {
            const commitment = await commitmentRepository.create(dto);

            const response: CommitmentResponse = {
                id: commitment.id,
                name: commitment.name,
                description: commitment.description,
                file: commitment.file,
                icon: commitment.icon,
                sort_order: commitment.sort_order,
                status: commitment.status,
                created_at: commitment.created_at,
                updated_at: commitment.updated_at,
            };

            return {
                success: true,
                data: response,
                message: 'Komitmen pelayanan berhasil dibuat',
            };
        } catch (error) {
            console.error('[CommitmentController] Error in create:', error);
            throw error;
        }
    }

    static async update(commitmentId: number, dto: UpdateCommitmentDTO) {
        try {
            const updatedCommitment = await commitmentRepository.update(commitmentId, dto);

            const response: CommitmentResponse = {
                id: updatedCommitment.id,
                name: updatedCommitment.name,
                description: updatedCommitment.description,
                file: updatedCommitment.file,
                icon: updatedCommitment.icon,
                sort_order: updatedCommitment.sort_order,
                status: updatedCommitment.status,
                created_at: updatedCommitment.created_at,
                updated_at: updatedCommitment.updated_at,
            };

            return {
                success: true,
                data: response,
                message: 'Komitmen pelayanan berhasil diupdate',
            };
        } catch (error) {
            console.error('[CommitmentController] Error in update:', error);
            throw error;
        }
    }

    static async delete(commitmentId: number) {
        try {
            await commitmentRepository.delete(commitmentId);

            return { success: true, message: 'Komitmen pelayanan berhasil dihapus' };
        } catch (error) {
            console.error('[CommitmentController] Error in delete:', error);
            throw error;
        }
    }
}

