import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from 'typeorm';

export class CreateProductsOptionTable1712909895711
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'ProductOption',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'productId',
            type: 'int',
          },
          {
            name: 'quantity',
            type: 'int',
            default: 0,
          },
          {
            name: 'nameColor',
            type: 'varchar',
          },
          {
            name: 'slug',
            isUnique: true,
            type: 'varchar',
          },
          {
            name: 'size',
            type: 'enum',
            enum: ['S', 'M', 'L', 'XL', 'XXL'],
          },
          {
            name: 'cost',
            type: 'int',
          },
          {
            name: 'price',
            type: 'int',
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
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
      'ProductOption',
      new TableForeignKey({
        columnNames: ['productId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'Products',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createUniqueConstraint(
      'ProductOption',
      new TableUnique({
        columnNames: ['slug', 'size'],
        name: 'slugAndSizeUnique',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('ProductOption');
  }
}
