import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreatePermissionsTable1712648397855 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'Permissions',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'action',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'createdById',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'updatedById',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp(3)',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp(3)',
            isNullable: true,
          },
          {
            name: 'deletedAt',
            type: 'timestamp(3)',
            isNullable: true,
          },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'Permissions',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'Admins',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'Permissions',
      new TableForeignKey({
        columnNames: ['updatedById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'Admins',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex(
      'Permissions',
      new TableIndex({
        name: 'IDX_PERMISSION_NAME',
        columnNames: ['name'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('Permissions', 'IDX_PERMISSION_NAME');
    await queryRunner.dropTable('Permissions');
  }
}
