import { EntityModel } from '@midwayjs/orm';
import { Column, Index, PrimaryGeneratedColumn } from 'typeorm';

@EntityModel({
  name: 'resource',
})
@Index(['md5', 'path', 'library_id'], { unique: true })
export class ResourceModel {
  @PrimaryGeneratedColumn()
  @Index()
  id?: number;

  @Column('varchar', {
    comment: 'resource md5',
  })
  md5: string;

  @Column('text', {
    comment: 'resource relative path',
  })
  path: string;

  @Column('varchar', {
    comment: 'resource name',
  })
  name: string;

  @Column('varchar', {
    comment: 'image format, JPEG | PNG | ...',
  })
  format: string;

  @Column('integer', {
    comment: 'image width',
  })
  width: number;

  @Column('integer', {
    comment: 'image height',
  })
  height: number;

  @Column('integer', {
    comment: 'resource size B',
  })
  size: number;

  @Column('datetime', {
    comment: 'resource create date',
  })
  create_date: Date;

  @Column('datetime', {
    comment: 'resource modify date',
  })
  modify_date: Date;

  @Column('integer', {
    comment: 'the id of owned library',
  })
  library_id: number;

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
