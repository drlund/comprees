import { IsEnum } from 'class-validator';
import { StatusPedido } from '../enum/statusPedido.enum';

export class AtualizaPedidoDTO {
  @IsEnum(StatusPedido)
  status: StatusPedido;

  constructor(status: StatusPedido){
    this.status = status;
  }
}
