import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { CreateUserRequest } from '../requests/CreateUserRequest';

// @todo: consider removing
export class UserService {
    private userRepository = AppDataSource.getRepository(User);

    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async getUserById(id: number): Promise<User | null> {
        return await this.userRepository.findOne({ where: { id } });
    }

    async createUser(createUserRequest: CreateUserRequest): Promise<User> {
        const user = this.userRepository.create({ ...createUserRequest });

        return await this.userRepository.save(user);
    }

    // @todo: use UpdateUserRequest instead
    async updateUser(id: number, updateUserRequest: Partial<CreateUserRequest>): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { id } });

        if (!user) {
            return null;
        }

        Object.assign(user, updateUserRequest);
        return await this.userRepository.save(user);
    }

    async deleteUser(id: number): Promise<boolean> {
        const result = await this.userRepository.delete(id);
        return result.affected !== 0;
    }
}
