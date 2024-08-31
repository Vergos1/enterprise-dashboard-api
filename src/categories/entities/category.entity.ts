import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuestionEntity } from '../../questions/entities/question.entity';

@Entity({
  name: 'category',
})
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'created_at',
    nullable: true,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    name: 'updated_at',
    nullable: true,
  })
  updatedAt: Date;

  @ManyToOne(() => CategoryEntity, (category) => category.subcategories, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parentCategory: CategoryEntity;

  @OneToMany(() => CategoryEntity, (category) => category.parentCategory, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  subcategories: CategoryEntity[];

  @OneToMany(() => QuestionEntity, (question) => question.category, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  questions: QuestionEntity[];
}
