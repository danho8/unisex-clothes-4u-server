import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateRolesTable1712648385569 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'Roles',
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
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: false,
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
      'Roles',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'Admins',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'Roles',
      new TableForeignKey({
        columnNames: ['updatedById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'Admins',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex(
      'Roles',
      new TableIndex({
        name: 'IDX_ROLE_NAME',
        columnNames: ['name'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('Roles', 'IDX_ROLE_NAME');
    await queryRunner.dropTable('Roles');
  }
}
