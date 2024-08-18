import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInspirationsEntity } from '../../entities/user-inspiration.entity';

@Injectable()
export class UserInspirationsRepository {
  constructor(
    @InjectRepository(UserInspirationsEntity)
    private readonly userInspirationsRepository: Repository<UserInspirationsEntity>,
  ) {}

  async getUserCategoriesIds(userId: string): Promise<string[]> {
    const inspirations = await this.userInspirationsRepository
      .createQueryBuilder('inspiration')
      .leftJoin('inspiration.preferences', 'preferences')
      .leftJoin('preferences.user', 'user')
      .where('user.id = :userId', { userId })
      .select('inspiration.categoryId AS category_id')
      .getRawMany();

    const categoryIds = inspirations.map((category) => category.category_id);
    console.log(categoryIds);

    if (categoryIds.length === 0) {
      return [];
    }

    return categoryIds;
  }
}
