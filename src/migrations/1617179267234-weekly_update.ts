import {MigrationInterface, QueryRunner} from "typeorm";

export class weeklyUpdate1617179267234 implements MigrationInterface {
    name = 'weeklyUpdate1617179267234'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "weeklies" ALTER COLUMN "user_signed_date" SET DEFAULT '"2021-03-31T08:27:47.473Z"'`);
        await queryRunner.query(`ALTER TABLE "weeklies" DROP COLUMN "supervisor_signed_date"`);
        await queryRunner.query(`ALTER TABLE "weeklies" ADD "supervisor_signed_date" TIMESTAMP DEFAULT '"2021-03-31T08:27:47.473Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "weeklies" DROP COLUMN "supervisor_signed_date"`);
        await queryRunner.query(`ALTER TABLE "weeklies" ADD "supervisor_signed_date" date DEFAULT '2021-03-31'`);
        await queryRunner.query(`ALTER TABLE "weeklies" ALTER COLUMN "user_signed_date" SET DEFAULT '2021-03-31 08:27:20.32'`);
    }

}
