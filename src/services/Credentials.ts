export default class Credentials {
    private token: string;
    private userName: string;
    private userMail: string;
  
    constructor(token: string, userName: string, userMail: string) {
      this.token = token;
      this.userName = userName;
      this.userMail = userMail;
    }
  
    // Getters
    getToken(): string {
      return this.token;
    }
  
    getUserName(): string {
      return this.userName;
    }
  
    getUserMail(): string {
      return this.userMail;
    }
  }
  