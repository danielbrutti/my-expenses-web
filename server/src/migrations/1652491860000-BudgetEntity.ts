import { MigrationInterface, QueryRunner } from 'typeorm';

export class BudgetEntity1652491860000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        if (process.env.BACKEND_ENV === 'prod') {
            if (queryRunner.isTransactionActive) {
                await queryRunner.commitTransaction();
            }

            await queryRunner.connection.synchronize();
        }
    }

    // eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<any> {}
}
