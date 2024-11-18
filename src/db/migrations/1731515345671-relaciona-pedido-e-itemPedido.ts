import { MigrationInterface, QueryRunner } from "typeorm";

export class RelacionaPedidoEItemPedido1731515345671 implements MigrationInterface {
    name = 'RelacionaPedidoEItemPedido1731515345671'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`itens_pedidos\` (\`id\` varchar(36) NOT NULL, \`quantidade\` int NOT NULL, \`preco_venda\` int NOT NULL, \`pedidoId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`itens_pedidos\` ADD CONSTRAINT \`FK_aaa757efbf4f9fb222709a140b2\` FOREIGN KEY (\`pedidoId\`) REFERENCES \`pedidos\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`itens_pedidos\` DROP FOREIGN KEY \`FK_aaa757efbf4f9fb222709a140b2\``);
        await queryRunner.query(`DROP TABLE \`itens_pedidos\``);
    }

}
