import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateShippingTable1714320177960 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'Shipping',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'orderId',
            type: 'int',
          },
          {
            name: 'address',
            type: 'varchar',
          },
          {
            name: 'method',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'estimatedTime',
            type: 'varchar',
            isNullable: true,
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
            columnNames: ['orderId'],
            referencedTableName: 'Orders',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('Shipping');
  }
}
