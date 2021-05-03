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
