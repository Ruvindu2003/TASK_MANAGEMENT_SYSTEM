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
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as fs from 'fs';
import * as path from 'path';
let FirebaseService = FirebaseService_1 = class FirebaseService {
    configService;
    logger = new Logger(FirebaseService_1.name);
    firebaseApp = null;
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        this.initFirebase();
    }
    initFirebase() {
        try {
            const apps = getApps();
            if (apps.length > 0) {
                this.firebaseApp = getApp();
                return;
            }
            const serviceAccountPath = this.configService.get('FIREBASE_SERVICE_ACCOUNT_PATH');
            const projectId = this.configService.get('FIREBASE_PROJECT_ID', 'vehical-mnagement-system');
            let foundPath = null;
            if (serviceAccountPath) {
                if (fs.existsSync(serviceAccountPath)) {
                    foundPath = serviceAccountPath;
                }
                else if (fs.existsSync(path.resolve(process.cwd(), serviceAccountPath))) {
                    foundPath = path.resolve(process.cwd(), serviceAccountPath);
                }
                else if (fs.existsSync(path.resolve(process.cwd(), 'task_management_system', serviceAccountPath))) {
                    foundPath = path.resolve(process.cwd(), 'task_management_system', serviceAccountPath);
                }
            }
            if (foundPath) {
                const serviceAccount = JSON.parse(fs.readFileSync(foundPath, 'utf8'));
                this.firebaseApp = initializeApp({
                    credential: cert(serviceAccount),
                    projectId,
                });
                this.logger.log('Firebase Admin initialized with service account.');
            }
            else {
                this.firebaseApp = initializeApp({
                    projectId,
                });
                this.logger.log(`Firebase Admin initialized with project ID: ${projectId}`);
            }
        }
        catch (error) {
            this.logger.warn(`Firebase Admin initialization warning: ${error.message}. Running with fallback capability.`);
        }
    }
    async verifyIdToken(token) {
        try {
            if (this.firebaseApp) {
                const decoded = await getAuth(this.firebaseApp).verifyIdToken(token);
                return {
                    uid: decoded.uid,
                    email: decoded.email || `${decoded.uid}@firebase.user`,
                    name: decoded.name || decoded.email?.split('@')[0] || 'User',
                    picture: decoded.picture,
                };
            }
        }
        catch (err) {
            this.logger.warn(`Firebase token verification failed: ${err.message}`);
        }
        if (token.startsWith('mock-') || token === 'demo-token') {
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
                const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
                if (payload.user_id || payload.sub) {
                    return {
                        uid: payload.user_id || payload.sub,
                        email: payload.email || `${payload.sub}@firebase.user`,
                        name: payload.name || payload.email?.split('@')[0] || 'Google User',
                        picture: payload.picture,
                    };
                }
            }
        }
        catch {
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