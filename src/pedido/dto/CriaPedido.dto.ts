import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, IsUUID, ValidateNested } from 'class-validator';

class ItemPedidoDTO {
  
  constructor(produtoId: string, quantidade: number) {
    this.produtoId = produtoId;
    this.quantidade = quantidade; 
  }

  @IsUUID()
  produtoId: string;
  @IsInt()
  quantidade: number;
}

export class CriaPedidoDTO {
  @ValidateNested()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => ItemPedidoDTO)
  itensPedido: ItemPedidoDTO[]=[];
}
