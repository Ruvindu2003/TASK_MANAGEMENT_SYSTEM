import { User } from '../users/entities/user.entity.js';
export declare class AuthController {
    syncUser(user: User): Promise<{
        message: string;
        user: User;
    }>;
    getCurrentUser(user: User): Promise<User>;
    healthCheck(): {
        status: string;
        service: string;
    };
}
