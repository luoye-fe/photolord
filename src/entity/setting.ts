import { EntityModel } from '@midwayjs/orm';
import { Column, Index, PrimaryGeneratedColumn } from 'typeorm';

@EntityModel({
  name: 'setting',
})
export class SettingModel {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @Column('varchar', {
    comment: 'key',
  })
  @Index()
  key: string;

  @Column('varchar', {
    comment: 'value',
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
