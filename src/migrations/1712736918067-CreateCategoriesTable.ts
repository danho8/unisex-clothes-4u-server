import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateCategoriesTable1712736918067 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'Categories',
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
            name: 'slug',
            isUnique: true,
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'isMain',
            type: 'boolean',
          },
          {
            name: 'avatar',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'avatarUploaded',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'isActive',
            type: 'boolean',
          },
          {
            name: 'parentId',
            type: 'int',
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
    );
    await queryRunner.createForeignKey(
      'Categories',
      new TableForeignKey({
        columnNames: ['parentId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'Categories',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'Categories',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'Admins',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'Categories',
      new TableForeignKey({
        columnNames: ['updatedById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'Admins',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex(
      'Categories',
      new TableIndex({
        name: 'IDX_CATEGORIES_SLUG',
        columnNames: ['slug'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('Categories', 'IDX_CATEGORIES_SLUG');
    await queryRunner.dropTable('Categories');
  }
}
