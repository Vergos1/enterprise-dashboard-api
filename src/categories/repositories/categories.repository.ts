import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IsNull, Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryEntityRepository: Repository<CategoryEntity>,
  ) {}

  async get(): Promise<CategoryEntity[]> {
    return await this.categoryEntityRepository.find({
      relations: { subcategories: true },
      where: { parentCategory: IsNull() },
    });
  }

  async getById(id: string): Promise<CategoryEntity> {
    return await this.categoryEntityRepository.findOne({
      where: { id },
      relations: { subcategories: true },
    });
  }

  async create(category: Partial<CategoryEntity>): Promise<CategoryEntity> {
    const newCategory = this.categoryEntityRepository.create(category);
    return await this.categoryEntityRepository.save(newCategory);
  }

  async update(
    id: string,
    category: Partial<CategoryEntity>,
  ): Promise<CategoryEntity> {
    await this.categoryEntityRepository.update(id, category);
    return await this.getById(id);
  }

  async deleteCategory(id: string): Promise<void> {
    // Deleting the category will automatically trigger the cascade delete for subcategories and questions
    await this.categoryEntityRepository.delete(id);
  }
}
