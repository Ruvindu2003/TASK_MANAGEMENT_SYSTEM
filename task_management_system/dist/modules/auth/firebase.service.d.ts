import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export interface DecodedUser {
    uid: string;
    email: string;
    name?: string;
    picture?: string;
}
export declare class FirebaseService implements OnModuleInit {
    private readonly configService;
    private readonly logger;
    private projectId;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    verifyIdToken(token: string): Promise<DecodedUser>;
}
