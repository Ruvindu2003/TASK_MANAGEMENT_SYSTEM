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
    private firebaseApp;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    private initFirebase;
    verifyIdToken(token: string): Promise<DecodedUser>;
}
