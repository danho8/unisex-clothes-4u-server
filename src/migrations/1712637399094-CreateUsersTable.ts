import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateUsersTable1712637399094 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'Users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'code',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'firstName',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'lastName',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'birthday',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'emailVerifiedAt',
            type: 'timestamp(3)',
            isNullable: true,
          },
          {
            name: 'isEmailConfirmed',
            type: 'boolean',
            default: false,
          },
          {
            name: 'emailConfirmationToken',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'rememberToken',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'resetPasswordToken',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'isBlocked',
            type: 'boolean',
            default: false,
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
      'Users',
      new TableIndex({
        name: 'IDX_USER_EMAIL',
        columnNames: ['email'],
      }),
    );
    await queryRunner.createIndex(
      'Users',
      new TableIndex({
        name: 'IDX_USER_CODE',
        columnNames: ['code'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('Users', 'IDX_USER_CODE');
    await queryRunner.dropIndex('Users', 'IDX_USER_EMAIL');
    await queryRunner.dropTable('Users');
  }
}
