import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserGiftCodeTable1713632999404
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'UserGiftCode',
        columns: [
          {
            name: 'userId',
            type: 'int',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'giftCodeId',
            type: 'int',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'isUsed',
            type: 'boolean',
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
            columnNames: ['giftCodeId'],
            referencedTableName: 'GiftCodes',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('UserGiftCode');
  }
}
