export class TarefaDTO {
    codigo: number;
    titulo: string;
    descricao: string;
    status: string;
    dataCriacao: Date;
  
    constructor(codigo: number,titulo: string,descricao: string,status: string,dataCriacao: Date) {
      this.codigo =  codigo;
      this.titulo = titulo;
      this.descricao = descricao;
      this.status = status;
      this.dataCriacao = dataCriacao;
    }
  }