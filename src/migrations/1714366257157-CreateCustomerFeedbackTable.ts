import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCustomerFeedbackTable1714366257157
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'CustomerFeedback',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'productId',
            type: 'int',
          },
          {
            name: 'rating',
            type: 'int',
          },
          {
            name: 'comments',
            type: 'varchar',
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
        foreignKeys: [
          {
            columnNames: ['userId'],
            referencedTableName: 'Users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['productId'],
            referencedTableName: 'Products',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('CustomerFeedback');
  }
}
