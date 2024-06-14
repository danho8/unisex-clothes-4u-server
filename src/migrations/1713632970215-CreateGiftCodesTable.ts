import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateGiftCodesTable1713632970215 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'GiftCodes',
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
            name: 'code',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'typeDiscount',
            type: 'varchar',
            enum: ['CASH', 'PERCENT'],
          },
          {
            name: 'discount',
            type: 'int',
          },
          {
            name: 'condition',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'quantity',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'startDate',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'endDate',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'typeGift',
            type: 'varchar',
            enum: ['ONE', 'ALL', 'UNLIMITED'],
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
    await queryRunner.createIndex(
      'GiftCodes',
      new TableIndex({
        name: 'IDX_GIFT_CODE_CODE',
        columnNames: ['code'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('GiftCodes', 'IDX_GIFT_CODE_CODE');
    await queryRunner.dropTable('GiftCodes');
  }
}
