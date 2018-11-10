
import axios from 'axios';
import { RegisterData } from '@/models/RegisterData'

export async function register(registerData, url)
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

  const response = await axios.post(url, dtoIn);
  const dtoOut = await response.data;

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
}