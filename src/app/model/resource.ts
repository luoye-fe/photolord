import { Application } from 'egg';
import {
  Sequelize,
  Model,
  Table,
  Column,
  Comment,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Index,
} from 'sequelize-typescript';

@Table({
  tableName: 'resource',
  modelName: 'ResourceModel',
  timestamps: false,
})
export class ResourceModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Comment('primary key')
  @Column(DataType.BIGINT)
  id: number;

  @Comment('file md5')
  @Column(DataType.STRING)
  md5: string;

  @Index({ name: 'uk_resource_file_relative_path', type: 'UNIQUE', unique: true })
  @Comment('file relative path')
  @Column(DataType.STRING)
  path: string;

  @Comment('the id of owned library')
  @Column(DataType.BIGINT)
  library_id: number;

  @Comment('create time')
  @Column(DataType.DATE)
  gmt_create: Date;

  @Comment('modify time')
  @Column(DataType.DATE)
  gmt_modified: Date;
}

export default function main(_: Application, sequelize: Sequelize) {
  // register model
  sequelize.addModels([ResourceModel]);

  return ResourceModel;
}
