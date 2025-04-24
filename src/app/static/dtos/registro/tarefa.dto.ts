import { ColaboradorDTO } from "./colaborador.dto";

export class TarefaDTO {
    codigo: number;
    titulo: string;
    descricao: string;
    status: string;
    dataCriacao: Date;
    colaborador!: ColaboradorDTO;
  
    constructor(codigo: number,titulo: string,descricao: string,status: string,dataCriacao: Date, colaborador: ColaboradorDTO) {
      this.codigo =  codigo;
      this.titulo = titulo;
      this.descricao = descricao;
      this.status = status;
      this.dataCriacao = dataCriacao;
      this.colaborador = colaborador
    }
  }