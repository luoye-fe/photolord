
import { EntityModel } from '@midwayjs/orm';
import { Column, Index, PrimaryGeneratedColumn } from 'typeorm';

@EntityModel({
  name: 'library',
})
export class LibraryModel {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  @Index()
  id?: number;

  @Column('text', {
    unique: true,
    comment: 'library absolute path',
  })
  path: string;

  @Column('text', {
    default: '',
    comment: 'library comment',
  })
  comment?: string;

  @Column('integer', {
    default: 0,
    comment: 'library analyse status',
  })
  analyse_ing?: number;

  @Column('datetime', {
    default: () => Date.now(),
    comment: 'create time',
  })
  gmt_create?: Date;

  @Column('datetime', {
    default: () => Date.now(),
    comment: 'modify time',
  })
  gmt_modified?: Date;
}
