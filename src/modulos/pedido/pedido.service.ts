import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CriaPedidoDTO } from './dto/CriaPedido.dto';
import { PedidoEntity } from './pedido.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { StatusPedido } from './enum/statusPedido.enum';
import { ItemPedidoEntity } from './itemPedido.entity';
import { ProdutoEntity } from '../produto/produto.entity';
import { AtualizaPedidoDTO } from './dto/AtualizaPedido.dto';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(PedidoEntity)
    private readonly pedidoRepository: Repository<PedidoEntity>,
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
    @InjectRepository(ProdutoEntity)
    private readonly produtoRepository: Repository<ProdutoEntity>,
  ) {}

  private async buscaUsuario(id) {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (usuario === null) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return usuario;
  }

  private async trataDadosDoPedido(
    produtosRelacionados: ProdutoEntity[],
    dadosDoPedido: CriaPedidoDTO,
  ): Promise<void> {
    // dadosDoPedido.itensPedido.forEach((itemPedido) => {
    for (const itemPedido of dadosDoPedido.itensPedido) {
      const produtoRelacionado = produtosRelacionados.find(
        (produto) => produto.id === itemPedido.produtoId,
      );

      if (produtoRelacionado === undefined) {
        throw new NotFoundException(
          `Produto com id ${itemPedido.produtoId} não encontrado`,
        );
      }

      if (itemPedido.quantidade > produtoRelacionado.quantidadeDisponivel) {
        throw new BadRequestException(
          `Quantidade solicitada (${itemPedido.quantidade}) ultrapassa a disponibilidade (${produtoRelacionado.quantidadeDisponivel}) para o produto ${produtoRelacionado.nome}. `,
        );
      }
    }
  }

  async cadastraPedido(usuarioId: string, dadosDoPedido: CriaPedidoDTO) {
    const usuario = await this.buscaUsuario(usuarioId);

    const pedidoEntity = new PedidoEntity();

    pedidoEntity.status = StatusPedido.EM_PROCESSAMENTO;
    pedidoEntity.usuario = usuario;

    const produtosIds = dadosDoPedido.itensPedido.map(
      (itemPedido) => itemPedido.produtoId,
    );

    const produtosRelacionados = await this.produtoRepository.findBy({
      id: In(produtosIds),
    });

    try {
      await this.trataDadosDoPedido(produtosRelacionados, dadosDoPedido);
    } catch (error) {
      console.error('Erro ao tratar dados do pedido:', error);
      throw error;
    }

    const itensPedidoEntidades = dadosDoPedido.itensPedido.map((itemPedido) => {
      const produtoRelacionado = produtosRelacionados.find(
        (produto) => produto.id === itemPedido.produtoId,
      );

      const itemPedidoEntity = new ItemPedidoEntity();
      itemPedidoEntity.produto = produtoRelacionado!;
      itemPedidoEntity.precoVenda = produtoRelacionado!.valor;
      itemPedidoEntity.quantidade = itemPedido.quantidade;
      itemPedidoEntity.produto.quantidadeDisponivel -= itemPedido.quantidade;

      return itemPedidoEntity;
    });

    const valorTotal = itensPedidoEntidades.reduce((total, item) => {
      return total + item.precoVenda * item.quantidade;
    }, 0);

    pedidoEntity.itensPedido = itensPedidoEntidades;
    pedidoEntity.valorTotal = valorTotal;

    const pedidoCriado = await this.pedidoRepository.save(pedidoEntity);
    return pedidoCriado;
  }

  async obtemPedidosDeUsuario(usuarioId: string) {
    return this.pedidoRepository.find({
      where: {
        usuario: { id: usuarioId },
      },
      relations: {
        usuario: true,
      },
    });
  }

  async atualizaPedido(id: string, dto: AtualizaPedidoDTO) {
    const pedido = await this.pedidoRepository.findOneBy({ id });

    if (pedido === null) {
      throw new NotFoundException('Pedido não encontrado');
    }

    Object.assign(pedido, dto);

    return this.pedidoRepository.save(pedido);
  }
}
