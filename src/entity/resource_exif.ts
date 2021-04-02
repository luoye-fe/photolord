import { EntityModel } from '@midwayjs/orm';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

@EntityModel({
  name: 'resource_exit',
})
export class ResourceModel {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('varchar', {
    comment: 'file md5',
  })
  md5: string;

  @Column('varchar', {
    comment: 'image exif tag name',
  })
  key: string;

  @Column('text', {
    comment: 'image exif tag value',
  })
  value: string;
  
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
