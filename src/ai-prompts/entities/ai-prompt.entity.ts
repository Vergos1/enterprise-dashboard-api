import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { PromptType } from '../constants/prompt-type.enun';

@Entity('ai_prompts')
export class AiPromptEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: PromptType, unique: true })
  type: PromptType;

  @Column({ type: 'text' })
  prompt: string;
}
