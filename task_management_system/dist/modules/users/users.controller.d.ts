import { UsersService } from './users.service.js';
import { User } from './entities/user.entity.js';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: User): User;
    updateProfile(userId: string, body: {
        displayName?: string;
        photoUrl?: string;
    }): Promise<User>;
}
