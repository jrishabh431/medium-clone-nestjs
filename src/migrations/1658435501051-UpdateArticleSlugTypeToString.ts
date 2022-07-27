import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateArticleSlugTypeToString1658435501051 implements MigrationInterface {
    name = 'UpdateArticleSlugTypeToString1658435501051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "articles" ADD "slug" character varying NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "articles"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "articles"."updatedAt" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "articles"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "articles"."createdAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "articles" ADD "slug" integer NOT NULL`);
    }

}
