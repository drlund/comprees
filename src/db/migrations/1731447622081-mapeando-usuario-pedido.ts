import { MigrationInterface, QueryRunner } from "typeorm";

export class MapeandoUsuarioPedido1731447622081 implements MigrationInterface {
    name = 'MapeandoUsuarioPedido1731447622081'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`pedidos\` (\`id\` varchar(36) NOT NULL, \`valor_total\` int NOT NULL, \`status\` enum ('em_processamento', 'processado', 'cancelado') NOT NULL DEFAULT 'em_processamento', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`usuarioId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`pedidos\` ADD CONSTRAINT \`FK_e60a655127c227b5e063e73165b\` FOREIGN KEY (\`usuarioId\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pedidos\` DROP FOREIGN KEY \`FK_e60a655127c227b5e063e73165b\``);
        await queryRunner.query(`DROP TABLE \`pedidos\``);
    }

}
