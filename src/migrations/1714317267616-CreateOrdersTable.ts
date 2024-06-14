import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateOrdersTable1714317267616 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'Orders',
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
            name: 'orderDate',
            type: 'date',
          },
          {
            name: 'totalPrice',
            type: 'int',
          },
          {
            name: 'status',
            type: 'varchar',
            enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'],
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
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('Orders');
  }
}
