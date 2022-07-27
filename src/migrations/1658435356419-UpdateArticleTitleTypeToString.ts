import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateArticleTitleTypeToString1658435356419 implements MigrationInterface {
    name = 'UpdateArticleTitleTypeToString1658435356419'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "articles" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "articles"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "articles"."updatedAt" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "articles"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "articles"."createdAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "articles" ADD "title" integer NOT NULL`);
    }

}
