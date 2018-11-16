
export class RegisterData {
  id = '';
  userName = '';
  eMail = '';
  dateOfBirth = '';
  firstName = '';
  lastName = '';
  password = '';
  role = '';
  userNumber = '';

  clone() {
    const registerData = new RegisterData();
    for(const key of Object.keys(registerData)) {
      registerData[key] = this[key];
    }
    return registerData;
  }
}