import { Usuario } from '../../types';
import { STORAGE_KEYS } from '../../utils/constants';
import { db } from '../database/db';

export class AuthService {
  static async login(email: string, senha: string): Promise<Usuario | null> {
    try {
      // Garantir que o banco está aberto
      if (!db.isOpen()) {
        await db.open();
      }

      // Buscar usuário no IndexedDB
      const usuario = await db.usuarios.where('email').equals(email).first();
      
      if (!usuario) {
        console.log('Usuário não encontrado:', email);
        return null;
      }

      // Em produção, comparar hash da senha
      // Por enquanto, validação simples para desenvolvimento
      if (usuario.senha && usuario.senha !== senha) {
        console.log('Senha incorreta para:', email);
        return null;
      }

      // Salvar sessão
      const { senha: _, ...usuarioSemSenha } = usuario;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(usuarioSemSenha));
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, `token_${usuario.id}`);

      console.log('Login bem-sucedido:', usuarioSemSenha.nome);
      return usuarioSemSenha as Usuario;
    } catch (error) {
      console.error('Erro no login:', error);
      return null;
    }
  }

  static logout(): void {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  static getCurrentUser(): Usuario | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) return null;
    return JSON.parse(userStr);
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }
}

