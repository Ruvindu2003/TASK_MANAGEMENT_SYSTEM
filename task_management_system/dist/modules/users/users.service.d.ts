import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { DecodedUser } from '../auth/firebase.service.js';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<User>);
    findOrCreateByFirebase(decoded: DecodedUser): Promise<User>;
    findById(id: string): Promise<User>;
    findByFirebaseUid(firebaseUid: string): Promise<User | null>;
    updateProfile(id: string, data: {
        displayName?: string;
        photoUrl?: string;
    }): Promise<User>;
}
