import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateUserBalanceTable1713109557496 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'UserBalance',
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
            name: 'point',
            type: 'int',
          },
          {
            name: 'lastBalance',
            type: 'int',
          },
          {
            name: 'balance',
            type: 'int',
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
      'UserBalance',
      new TableIndex({
        name: 'IDX_USER_BALANCE_USER_ID',
        columnNames: ['userId'],
      }),
    );
    await queryRunner.createForeignKey(
      'UserBalance',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'Users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('UserBalance', 'IDX_USER_ADDRESS_USER_ID');
    await queryRunner.dropTable('UserBalance');
  }
}
