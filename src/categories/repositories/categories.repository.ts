import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IsNull, Repository, In } from 'typeorm';
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
      relations: { subcategories: true, questions: true },
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
    // First, find the existing category to ensure it exists
    const existingCategory = await this.categoryEntityRepository.findOne({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }

    // Update the category fields
    const updatedCategory = {
      ...existingCategory,
      ...category, // This will overwrite existing fields with the new ones
    };

    // Save the updated category
    await this.categoryEntityRepository.save(updatedCategory);

    // Return the updated category by fetching it again to include all relations
    return await this.getById(id);
  }

  async deleteCategory(id: string): Promise<void> {
    // Deleting the category will automatically trigger the cascade delete for subcategories and questions
    await this.categoryEntityRepository.delete(id);
  }

  async getCategoriesByIds(categoryIds: string[]): Promise<CategoryEntity[]> {
    return await this.categoryEntityRepository.find({
      where: { id: In(categoryIds) },
    });
  }
}
