import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRolePermissionTable1712848321744
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'RolePermission',
        columns: [
          {
            name: 'roleId',
            type: 'int',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'permissionId',
            type: 'int',
            isPrimary: true,
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['permissionId'],
            referencedTableName: 'Permissions',
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
    await queryRunner.dropTable('RolePermission');
  }
}
