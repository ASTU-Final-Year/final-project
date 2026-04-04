// services/password.service.ts

export default class PasswordService {
  static async hashPassword(password: string) {
    return Bun.password.hashSync(password);
  }

  static async verifyPassword(password: string, hash: string) {
    return Bun.password.verifySync(password, hash);
  }
}
