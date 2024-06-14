import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePaymentTable1714319113415 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'Payment',
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
            name: 'amount',
            type: 'varchar',
          },
          {
            name: 'type',
            type: 'varchar',
            enum: ['CASH', 'BANK_TRANSFER'],
          },
          {
            name: 'status',
            type: 'varchar',
            enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'],
          },
          {
            name: 'description',
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
    await queryRunner.dropTable('Payment');
  }
}
