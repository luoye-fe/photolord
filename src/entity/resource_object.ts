import { EntityModel } from '@midwayjs/orm';
import { Column, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@EntityModel({
  name: 'resource_object',
})
@Index(['md5', 'label'], { unique: true })
@Unique('constraint_md5_label', ['md5', 'label'])
export class ResourceObjectModel {
  @PrimaryGeneratedColumn()
  @Index()
  id?: number;

  @Column('varchar', {
    comment: 'resource md5',
  })
  md5: string;

  @Column('varchar', {
    comment: 'image object result label',
  })
  label: string;

  @Column('float', {
    comment: 'image object result precision',
  })
  precision: number;
  
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
