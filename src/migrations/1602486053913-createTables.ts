import {MigrationInterface, QueryRunner} from "typeorm";

export class createTables1602486053913 implements MigrationInterface {
    name = 'createTables1602486053913'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_projects" DROP CONSTRAINT "FK_573382152f76b38d84cd38291dd"`);
        await queryRunner.query(`ALTER TABLE "times" DROP CONSTRAINT "FK_7e472dea473b6feb91e55400a98"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "UQ_2187088ab5ef2a918473cb99007" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "times" ADD CONSTRAINT "FK_7e472dea473b6feb91e55400a98" FOREIGN KEY ("name") REFERENCES "projects"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_projects" ADD CONSTRAINT "FK_573382152f76b38d84cd38291dd" FOREIGN KEY ("projectsName") REFERENCES "projects"("name") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_projects" DROP CONSTRAINT "FK_573382152f76b38d84cd38291dd"`);
        await queryRunner.query(`ALTER TABLE "times" DROP CONSTRAINT "FK_7e472dea473b6feb91e55400a98"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "UQ_2187088ab5ef2a918473cb99007"`);
        await queryRunner.query(`ALTER TABLE "times" ADD CONSTRAINT "FK_7e472dea473b6feb91e55400a98" FOREIGN KEY ("name") REFERENCES "projects"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_projects" ADD CONSTRAINT "FK_573382152f76b38d84cd38291dd" FOREIGN KEY ("projectsName") REFERENCES "projects"("name") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
