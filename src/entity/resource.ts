import { EntityModel } from '@midwayjs/orm';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

@EntityModel({
  name: 'resource',
})
export class ResourceModel {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('varchar', {
    comment: 'file md5',
  })
  md5: string;

  @Column('text', {
    comment: 'file relative path',
  })
  path: string;

  @Column('integer', {
    comment: 'the id of owned library',
  })
  library_id: number;

  @Column('text', {
    comment: 'image exif json text',
  })
  exif: string;

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
