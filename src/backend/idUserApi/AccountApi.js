import { CommonApi } from '@/backend/CommonApi';
import { RegisterData } from '@/models/RegisterData'

export class AccountApi extends CommonApi {

  constructor(apiUrl) {
    super(apiUrl, null, null);
  }

  async register(registerData) {

    const dtoIn = {
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      userName: registerData.userName,
      eMail: registerData.eMail,
      password: registerData.password,
      dateOfBirth: registerData.dateOfBirth,
      role: registerData.role,
      userNumber: registerData.userNumber
    };
    
    const responseData = await this.post('register', dtoIn, false);

    const registerDataOut = new RegisterData();
    registerDataOut.firstName = responseData.firstName ? responseData.firstName : '';
    registerDataOut.lastName = responseData.lastName  ? responseData.lastName : '';
    registerDataOut.userName = responseData.userName ? responseData.userName : '';
    registerDataOut.eMail = responseData.eMail ? responseData.eMail : '';
    registerDataOut.id = responseData.id ? responseData.id : '';
    registerDataOut.dateOfBirth = responseData.dateOfBirth ? responseData.dateOfBirth : '';
    registerDataOut.role = responseData.role ? responseData.role : ''; 
    registerDataOut.userNumber = responseData.userNumber ? responseData.userNumber : '';
    return registerDataOut;
  }
}
