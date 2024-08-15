import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryEntity } from './category.entity';

@Entity({
  name: 'question',
})
export class QuestionEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column()
  text: string;

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

  @ManyToOne(() => CategoryEntity, (category) => category.questions)
  category: CategoryEntity;
}
