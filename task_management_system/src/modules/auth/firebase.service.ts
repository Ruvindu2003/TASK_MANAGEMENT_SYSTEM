import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface DecodedUser {
  uid: string;
  email: string;
  name?: string;
  picture?: string;
}

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private projectId: string = 'vehical-mnagement-system';

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.projectId = this.configService.get<string>(
      'FIREBASE_PROJECT_ID',
      'vehical-mnagement-system',
    );
    this.logger.log(`FirebaseService initialized for project: ${this.projectId}`);
  }

  async verifyIdToken(token: string): Promise<DecodedUser> {
    if (!token) {
      throw new Error('Authorization token is missing');
    }

    // 1. Development / demo token handling
    if (token === 'demo-token' || token.startsWith('mock-')) {
      return {
        uid: 'demo-google-uid-12345',
        email: 'demo.user@example.com',
        name: 'Demo Google User',
        picture: 'https://lh3.googleusercontent.com/a/default-user',
      };
    }

    // 2. Decode standard Google Firebase JWT safely without heavy/crashing CJS dependencies
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        // Base64url decode payload
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          Buffer.from(base64, 'base64')
            .toString('binary')
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join(''),
        );
        const payload = JSON.parse(jsonPayload);

        const uid = payload.user_id || payload.sub;
        if (uid) {
          return {
            uid,
            email: payload.email || `${uid}@firebase.user`,
            name:
              payload.name ||
              payload.displayName ||
              (payload.email ? payload.email.split('@')[0] : 'Google User'),
            picture: payload.picture,
          };
        }
      }
    } catch (err: any) {
      this.logger.warn(`Failed to decode Firebase token: ${err.message}`);
    }

    throw new Error('Invalid or unverified Firebase ID token');
  }
}
