export class LoginDTO {
    email: string;
    senha: string;
  
    constructor(email: string, senha: string) {
      this.email = email;
      this.senha = senha;
    }
  }