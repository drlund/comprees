import { MigrationInterface, QueryRunner } from "typeorm";

export class CriaTabelas1731436520121 implements MigrationInterface {
    name = 'CriaTabelas1731436520121'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`produto_caracteristicas\` (\`id\` varchar(36) NOT NULL, \`nome\` varchar(100) NOT NULL, \`descricao\` varchar(255) NOT NULL, \`produtoId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`produtos\` (\`id\` varchar(36) NOT NULL, \`usuario_id\` varchar(100) NOT NULL, \`nome\` varchar(100) NOT NULL, \`valor\` int NOT NULL, \`quantidade_disponivel\` int NOT NULL, \`descricao\` varchar(255) NOT NULL, \`categoria\` varchar(100) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`produto_imagens\` (\`id\` varchar(36) NOT NULL, \`url\` varchar(100) NOT NULL, \`descricao\` varchar(100) NOT NULL, \`produtoId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`usuarios\` (\`id\` varchar(36) NOT NULL, \`nome\` varchar(100) NOT NULL, \`email\` varchar(70) NOT NULL, \`senha\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`produto_caracteristicas\` ADD CONSTRAINT \`FK_67339e59ab4b3ed091cf318f426\` FOREIGN KEY (\`produtoId\`) REFERENCES \`produtos\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`produto_imagens\` ADD CONSTRAINT \`FK_eb1531605709dd94ec67b2141d0\` FOREIGN KEY (\`produtoId\`) REFERENCES \`produtos\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produto_imagens\` DROP FOREIGN KEY \`FK_eb1531605709dd94ec67b2141d0\``);
        await queryRunner.query(`ALTER TABLE \`produto_caracteristicas\` DROP FOREIGN KEY \`FK_67339e59ab4b3ed091cf318f426\``);
        await queryRunner.query(`DROP TABLE \`usuarios\``);
        await queryRunner.query(`DROP TABLE \`produto_imagens\``);
        await queryRunner.query(`DROP TABLE \`produtos\``);
        await queryRunner.query(`DROP TABLE \`produto_caracteristicas\``);
    }

}
