/*
 * Copyright 2020-present Open Networking Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {MigrationInterface, QueryRunner} from "typeorm";

export class createTables1602695627430 implements MigrationInterface {
    name = 'createTables1602695627430'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "projects" ("name" character varying NOT NULL, "priority" integer NOT NULL, CONSTRAINT "ProjectTitle" UNIQUE ("name"), CONSTRAINT "PK_2187088ab5ef2a918473cb99007" PRIMARY KEY ("name"))`);
        await queryRunner.query(`CREATE TABLE "weeks" ("id" SERIAL NOT NULL, "year" integer NOT NULL, "week_no" integer NOT NULL, "month_no" integer NOT NULL, "begin" date NOT NULL, "end" date NOT NULL, CONSTRAINT "week_end" UNIQUE ("end"), CONSTRAINT "week_begin" UNIQUE ("begin"), CONSTRAINT "week_year_week" UNIQUE ("year", "week_no"), CONSTRAINT "PK_003488ee2ca80ef0c85a02a8065" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "times" ("time_id" SERIAL NOT NULL, "name" character varying NOT NULL, "minutes" integer NOT NULL, "day_id" integer, CONSTRAINT "PK_72de58b45bd981c13c681453c7c" PRIMARY KEY ("time_id"))`);
        await queryRunner.query(`CREATE TABLE "days" ("day_id" SERIAL NOT NULL, "day_user_email" character varying NOT NULL, "day" date NOT NULL, "week_id" integer NOT NULL, CONSTRAINT "user_day" UNIQUE ("day_user_email", "day"), CONSTRAINT "PK_c70e74e271d63872bb17f6b8b9a" PRIMARY KEY ("day_id"))`);
        await queryRunner.query(`CREATE TABLE "weeklies" ("weekly_user_email" character varying NOT NULL, "week_id" integer NOT NULL, "document" character varying, "preview" character varying, "user_signed" character varying, "supervisor_signed" boolean, CONSTRAINT "PK_032d63c89bff99240f39cdd2b31" PRIMARY KEY ("weekly_user_email", "week_id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_032d63c89bff99240f39cdd2b3" ON "weeklies" ("weekly_user_email", "week_id") `);
        await queryRunner.query(`CREATE TABLE "users" ("email" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "supervisor_email" character varying NOT NULL, "darpa_allocation_pct" integer NOT NULL, "is_supervisor" boolean NOT NULL DEFAULT false, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "full_name" UNIQUE ("first_name", "last_name"), CONSTRAINT "PK_97672ac88f789774dd47f7c8be3" PRIMARY KEY ("email"))`);
        await queryRunner.query(`CREATE TABLE "user_projects" ("usersEmail" character varying NOT NULL, "projectsName" character varying NOT NULL, CONSTRAINT "PK_6ab68292649b57659453e068015" PRIMARY KEY ("usersEmail", "projectsName"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7f39f29d4dcf2051baca16e414" ON "user_projects" ("usersEmail") `);
        await queryRunner.query(`CREATE INDEX "IDX_573382152f76b38d84cd38291d" ON "user_projects" ("projectsName") `);
        await queryRunner.query(`ALTER TABLE "times" ADD CONSTRAINT "FK_7e472dea473b6feb91e55400a98" FOREIGN KEY ("name") REFERENCES "projects"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "times" ADD CONSTRAINT "FK_d24e5eacbf4fcb5d750455ea1ac" FOREIGN KEY ("day_id") REFERENCES "days"("day_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "days" ADD CONSTRAINT "FK_c2d9fb7fc147576c01fe1ce2d50" FOREIGN KEY ("day_user_email") REFERENCES "users"("email") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "days" ADD CONSTRAINT "FK_05d53f1cf969e283c37f736ce39" FOREIGN KEY ("week_id") REFERENCES "weeks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "weeklies" ADD CONSTRAINT "FK_d17231199d416a12449ed0367ef" FOREIGN KEY ("weekly_user_email") REFERENCES "users"("email") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "weeklies" ADD CONSTRAINT "FK_c30d5c895d30caf3500b5efddf3" FOREIGN KEY ("week_id") REFERENCES "weeks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_projects" ADD CONSTRAINT "FK_7f39f29d4dcf2051baca16e4144" FOREIGN KEY ("usersEmail") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_projects" ADD CONSTRAINT "FK_573382152f76b38d84cd38291dd" FOREIGN KEY ("projectsName") REFERENCES "projects"("name") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_projects" DROP CONSTRAINT "FK_573382152f76b38d84cd38291dd"`);
        await queryRunner.query(`ALTER TABLE "user_projects" DROP CONSTRAINT "FK_7f39f29d4dcf2051baca16e4144"`);
        await queryRunner.query(`ALTER TABLE "weeklies" DROP CONSTRAINT "FK_c30d5c895d30caf3500b5efddf3"`);
        await queryRunner.query(`ALTER TABLE "weeklies" DROP CONSTRAINT "FK_d17231199d416a12449ed0367ef"`);
        await queryRunner.query(`ALTER TABLE "days" DROP CONSTRAINT "FK_05d53f1cf969e283c37f736ce39"`);
        await queryRunner.query(`ALTER TABLE "days" DROP CONSTRAINT "FK_c2d9fb7fc147576c01fe1ce2d50"`);
        await queryRunner.query(`ALTER TABLE "times" DROP CONSTRAINT "FK_d24e5eacbf4fcb5d750455ea1ac"`);
        await queryRunner.query(`ALTER TABLE "times" DROP CONSTRAINT "FK_7e472dea473b6feb91e55400a98"`);
        await queryRunner.query(`DROP INDEX "IDX_573382152f76b38d84cd38291d"`);
        await queryRunner.query(`DROP INDEX "IDX_7f39f29d4dcf2051baca16e414"`);
        await queryRunner.query(`DROP TABLE "user_projects"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "IDX_032d63c89bff99240f39cdd2b3"`);
        await queryRunner.query(`DROP TABLE "weeklies"`);
        await queryRunner.query(`DROP TABLE "days"`);
        await queryRunner.query(`DROP TABLE "times"`);
        await queryRunner.query(`DROP TABLE "weeks"`);
        await queryRunner.query(`DROP TABLE "projects"`);
    }

}
