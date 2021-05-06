import {MigrationInterface, QueryRunner} from "typeorm";

export class Reject1620286345408 implements MigrationInterface {
    name = 'Reject1620286345408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "weeklies" ADD "rejected" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "weeklies" ADD "comment" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "weeklies" DROP COLUMN "comment"`);
        await queryRunner.query(`ALTER TABLE "weeklies" DROP COLUMN "rejected"`);
    }

}
