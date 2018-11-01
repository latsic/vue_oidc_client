
import axios from 'axios';
import { RegisterData } from '@/model/RegisterData'

export function register(registerData, url)
{
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

  return axios.post(url, dtoIn)
  .then(response => response.data)
  .then(dtoOut => {
    const registerDataOut = new RegisterData();
    registerDataOut.firstName = dtoOut.firstName;
    registerDataOut.lastName = dtoOut.lastName;
    registerDataOut.userName = dtoOut.userName;
    registerDataOut.eMail = dtoOut.eMail;
    registerDataOut.id = dtoOut.id;
    registerDataOut.dateOfBirth = dtoOut.dateOfBirth;
    registerDataOut.role = dtoOut.role;
    registerDataOut.userNumber = dtoOut.userNumber;
    return registerDataOut;
  })
  .catch(error => {
    throw error;
  });
}