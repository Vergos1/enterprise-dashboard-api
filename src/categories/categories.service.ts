import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from './repositories/categories.repository';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async getCategories(): Promise<CategoryEntity[]> {
    return await this.categoriesRepository.get();
  }

  async getCategoryById(
    id: string,
    errorMessage?: string,
  ): Promise<CategoryEntity> {
    const category = await this.categoriesRepository.getById(id);

    if (!category) {
      throw new NotFoundException(
        errorMessage || `Category with ID ${id} not found.`,
      );
    }

    return category;
  }

  async getParentCategoryById(id: string): Promise<CategoryEntity> {
    const category = await this.getCategoryById(
      id,
      `Parent category with ID ${id} not found.`,
    );
    return category;
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    const { name, parentCategoryId } = createCategoryDto;

    let parentCategory: CategoryEntity = null;

    if (parentCategoryId) {
      parentCategory = await this.getParentCategoryById(parentCategoryId);
    }

    const newCategory = await this.categoriesRepository.create({
      name,
      parentCategory,
    });

    if (parentCategory) {
      parentCategory.subcategories.push(newCategory);
      await this.categoriesRepository.update(parentCategory.id, parentCategory);
    }

    return newCategory;
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.getCategoryById(id);
    await this.categoriesRepository.deleteCategory(category.id);
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    // TODO: Implement the updateCategory method
    // Need to update old parent category subcategories array and new parent category subcategories array
    const { name, parentCategoryId } = updateCategoryDto;

    const category = await this.getCategoryById(id);

    let parentCategory: CategoryEntity = null;

    if (parentCategoryId) {
      parentCategory = await this.getParentCategoryById(parentCategoryId);
    }

    category.name = name || category.name;
    // category.parentCategory = parentCategory || category.parentCategory;

    return await this.categoriesRepository.update(id, category);
  }
}
