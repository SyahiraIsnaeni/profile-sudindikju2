import bcryptjs from 'bcryptjs';
import { UserRepository } from '../repositories/UserRepository';
import { LoginRequestDTO, LoginResponseDTO } from '../dtos/LoginDTO';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(dto: LoginRequestDTO): Promise<LoginResponseDTO> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcryptjs.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
      },
      message: 'Login successful',
    };
  }

  async getUserById(id: number) {
    return this.userRepository.findById(id);
  }
}