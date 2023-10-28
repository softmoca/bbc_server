import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseModel {
  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
