export class LoginResponse {
  expiresIn: string;
  idToken: string;
  userId: string;
  role: string;
}

export class LoginModel {
  userName: string;
  password: string;

  constructor(userName?: string, password?: string) {
    this.userName = userName;
    this.password = password;
  }
}


export class AuthModel {
  userName: string;
  token: string;
  tokenExpirationDate: Date;
  role: string;

  constructor(userName: string, token: string, tokenExp: Date, role: string) {
    this.userName = userName;
    this.token = token;
    this.tokenExpirationDate = tokenExp;
    this.role = role;
  }

  // get token() {
  //   if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
  //     return null;
  //   }
  //   return this._token;
  // }

  get tokenDuration() {
    if (!this.token) {
      return 0;
    }
    return this.tokenExpirationDate.getTime() - new Date().getTime();
  }
}
