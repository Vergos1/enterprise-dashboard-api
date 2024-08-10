import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { UserInspirationsEntity } from './user-inspiration.entity';

export enum Frequency {
  Daily = 'Daily',
  Weekly = 'Weekly',
  BiWeekly = 'BiWeekly',
  Monthly = 'Monthly',
}

export enum WeekDays {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

@Entity({
  name: 'user_preferences',
})
export class PreferencesEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ nullable: false, default: true, name: 'receive_notifications' })
  receiveNotifications: boolean;

  @Column({
    type: 'enum',
    enum: Frequency,
    array: true,
    nullable: true,
  })
  frequency: Frequency[];

  @Column({
    type: 'enum',
    enum: WeekDays,
    array: true,
    nullable: true,
    name: 'week_days',
  })
  weekDays: WeekDays[];

  @Column({ nullable: true, type: 'time with time zone' })
  time: string;

  @OneToOne(() => UserEntity, (user) => user.preferences, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @OneToMany(
    () => UserInspirationsEntity,
    (inspirations) => inspirations.preferences,
  )
  inspirations?: UserInspirationsEntity[];
}
