import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateProductsTable1712905946904 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'Products',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'categoryId',
            type: 'int',
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
            name: 'sku',
            isUnique: true,
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
            default: true,
          },
          {
            name: 'isFave',
            type: 'boolean',
            default: false,
          },
          {
            name: 'view',
            type: 'int',
            default: 0,
          },
          {
            name: 'isBestSelling',
            type: 'boolean',
            default: false,
          },
          {
            name: 'saleOff',
            isUnique: true,
            type: 'int',
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
      'Products',
      new TableForeignKey({
        columnNames: ['categoryId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'Categories',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex(
      'Products',
      new TableIndex({
        name: 'IDX_PRODUCT_SLUG',
        columnNames: ['slug'],
      }),
    );
    await queryRunner.createIndex(
      'Products',
      new TableIndex({
        name: 'IDX_PRODUCT_SKU',
        columnNames: ['sku'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('Products');
  }
}
