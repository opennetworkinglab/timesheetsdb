import {MigrationInterface, QueryRunner} from "typeorm";

export class userSignedDate1621321671978 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "weeklies" ADD "user_signed_date" TIMESTAMP DEFAULT '"2021-03-31T08:27:47.473Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
