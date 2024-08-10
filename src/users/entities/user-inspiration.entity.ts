import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { PreferencesEntity } from './preferences.entity';

@Entity({
  name: 'user_inspirations',
})
export class UserInspirationsEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ nullable: false, name: 'category_id' })
  categoryId: string;

  @ManyToOne(
    () => PreferencesEntity,
    (preferences) => preferences.inspirations,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  @JoinColumn({ name: 'preferences_id' })
  preferences?: PreferencesEntity;
}
