import { UserService } from '../services/UserService';
import { LoginRequestDTO } from '../dtos/LoginDTO';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async login(dto: LoginRequestDTO) {
    try {
      const result = await this.userService.login(dto);
      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getUserById(id: number) {
    try {
      const user = await this.userService.getUserById(id);
      return {
        success: true,
        data: user,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}