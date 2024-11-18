import { PartialType } from '@nestjs/mapped-types';
import { CriaPedidoDTO } from 'src/pedido/dto/CriaPedido.dto';

export class AtualizaUsuarioDTO extends PartialType(CriaPedidoDTO) {}
