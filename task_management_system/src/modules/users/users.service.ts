import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { DecodedUser } from '../auth/firebase.service.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOrCreateByFirebase(decoded: DecodedUser): Promise<User> {
    let user = await this.usersRepository.findOne({
      where: { firebaseUid: decoded.uid },
    });

    if (!user) {
      user = new User();
      user.firebaseUid = decoded.uid;
      user.email = decoded.email;
      user.displayName = decoded.name || '';
      user.photoUrl = decoded.picture || '';
      return await this.usersRepository.save(user);
    }

    // Optional profile sync if name or photo changed
    let shouldUpdate = false;
    if (decoded.name && user.displayName !== decoded.name) {
      user.displayName = decoded.name;
      shouldUpdate = true;
    }
    if (decoded.picture && user.photoUrl !== decoded.picture) {
      user.photoUrl = decoded.picture;
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      return await this.usersRepository.save(user);
    }

    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { firebaseUid } });
  }

  async updateProfile(
    id: string,
    data: { displayName?: string; photoUrl?: string },
  ): Promise<User> {
    const user = await this.findById(id);
    if (data.displayName !== undefined) user.displayName = data.displayName;
    if (data.photoUrl !== undefined) user.photoUrl = data.photoUrl;
    return await this.usersRepository.save(user);
  }
}
