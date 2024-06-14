import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAdminRolesTable1712735848107 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'AdminRole',
        columns: [
          {
            name: 'adminId',
            type: 'int',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'roleId',
            type: 'int',
            isPrimary: true,
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['adminId'],
            referencedTableName: 'Admins',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['roleId'],
            referencedTableName: 'Roles',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('AdminRole');
  }
}
