import {MigrationInterface, QueryRunner} from "typeorm";

export class weeklyUpdate1617179358068 implements MigrationInterface {
    name = 'weeklyUpdate1617179358068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "weeklies" ALTER COLUMN "user_signed_date" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "weeklies" ALTER COLUMN "supervisor_signed_date" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "weeklies" ALTER COLUMN "supervisor_signed_date" SET DEFAULT '2021-03-31 08:27:47.473'`);
        await queryRunner.query(`ALTER TABLE "weeklies" ALTER COLUMN "user_signed_date" SET DEFAULT '2021-03-31 08:27:47.473'`);
    }

}
