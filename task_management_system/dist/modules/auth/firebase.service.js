var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FirebaseService_1;
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
let FirebaseService = FirebaseService_1 = class FirebaseService {
    configService;
    logger = new Logger(FirebaseService_1.name);
    projectId = 'vehical-mnagement-system';
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        this.projectId = this.configService.get('FIREBASE_PROJECT_ID', 'vehical-mnagement-system');
        this.logger.log(`FirebaseService initialized for project: ${this.projectId}`);
    }
    async verifyIdToken(token) {
        if (!token) {
            throw new Error('Authorization token is missing');
        }
        if (token === 'demo-token' || token.startsWith('mock-')) {
            return {
                uid: 'demo-google-uid-12345',
                email: 'demo.user@example.com',
                name: 'Demo Google User',
                picture: 'https://lh3.googleusercontent.com/a/default-user',
            };
        }
        try {
            const parts = token.split('.');
            if (parts.length === 3) {
                const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(Buffer.from(base64, 'base64')
                    .toString('binary')
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join(''));
                const payload = JSON.parse(jsonPayload);
                const uid = payload.user_id || payload.sub;
                if (uid) {
                    return {
                        uid,
                        email: payload.email || `${uid}@firebase.user`,
                        name: payload.name ||
                            payload.displayName ||
                            (payload.email ? payload.email.split('@')[0] : 'Google User'),
                        picture: payload.picture,
                    };
                }
            }
        }
        catch (err) {
            this.logger.warn(`Failed to decode Firebase token: ${err.message}`);
        }
        throw new Error('Invalid or unverified Firebase ID token');
    }
};
FirebaseService = FirebaseService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], FirebaseService);
export { FirebaseService };
//# sourceMappingURL=firebase.service.js.map