import {MigrationInterface, QueryRunner} from "typeorm";

export class weeklyUpdate1617178349253 implements MigrationInterface {
    name = 'weeklyUpdate1617178349253'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "weeklies" ADD "user_signed_date" date DEFAULT '"2021-03-31T08:12:29.625Z"'`);
        await queryRunner.query(`ALTER TABLE "weeklies" ADD "supervisor_signed_date" date DEFAULT '"2021-03-31T08:12:29.625Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "weeklies" DROP COLUMN "supervisor_signed_date"`);
        await queryRunner.query(`ALTER TABLE "weeklies" DROP COLUMN "user_signed_date"`);
    }

}
