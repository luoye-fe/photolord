import { Application } from 'egg';
import {
  Sequelize,
  Model,
  Table,
  Column,
  Comment,
  DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'setting',
  modelName: 'SettingModel',
  timestamps: false,
})
export class SettingModel extends Model {
  @Comment('create time')
  @Column(DataType.DATE)
  gmt_create: Date;

  @Comment('modify time')
  @Column(DataType.DATE)
  gmt_modified: Date;
}

export default function main(_: Application, sequelize: Sequelize) {
  // register model
  sequelize.addModels([SettingModel]);

  return SettingModel;
}
