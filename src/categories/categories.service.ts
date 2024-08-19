import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CategoriesRepository } from './repositories/categories.repository';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async getCategories(): Promise<CategoryEntity[]> {
    return await this.categoriesRepository.get();
  }

  async getCategoryById(
    id: string,
    errorMessage?: string,
  ): Promise<CategoryDto> {
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
    const { name, parentCategoryId } = updateCategoryDto;
    const category = await this.getCategoryById(id);
    category.name = name || category.name;

    if (parentCategoryId === id) {
      throw new BadRequestException('Category cannot be its own parent.');
    }

    if (parentCategoryId && parentCategoryId === category.parentCategory?.id) {
      return await this.categoriesRepository.update(id, category);
    }

    const newParentCategory =
      await this.getParentCategoryById(parentCategoryId);
    const oldParentCategory = await this.getCategoryById(
      category.parentCategory?.id,
    );

    category.parentCategory = newParentCategory || category.parentCategory;

    const result = await this.categoriesRepository.update(id, category);

    newParentCategory.subcategories.push(category);
    await this.categoriesRepository.update(
      newParentCategory.id,
      newParentCategory,
    );

    oldParentCategory.subcategories = oldParentCategory.subcategories.filter(
      (subCategory) => subCategory.id !== category.id,
    );

    await this.categoriesRepository.update(id, category);

    return result;
  }
}
