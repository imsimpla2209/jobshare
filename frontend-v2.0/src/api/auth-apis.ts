import { IUser } from "src/types/user";
import { instance } from "./http";

export const loginGoogle = (email) => {
  return instance.post('auth/google', email);
}

export const loginFacebook = () => {
  return instance.get('auth/facebook');
}

export const getMe = () => {
  return instance.get(`auth/me`);
}

export const postLogin = (data: { username: string; password: string }) => {
  return instance.post('auth/login', data);
}

export const register = (data: Omit<
  IUser,
  | 'role'
  | 'isEmailVerified'
  | 'provider'
  | 'oAuth'
  | 'paymentInfo'
  | 'isVerified'
  | 'isActive'
  | 'balance'
  | 'refreshToken'
  | 'jobsPoints'
>) => {
  return instance.post('auth/register', data);
}

export const logout = () => {
  return instance.post('auth/logout');
}

export const refreshToken = () => {
  return instance.post('auth/refresh-tokens');
}

export const forgotPassword = (data: { email: string }) => {
  return instance.post('auth/forgot-password', data);
}

export const resetPassword = (data: { password: string }, token: string) => {
  return instance.post(`auth/reset-password?token=${token}`, data);
}

export const sendVerifyEmail = () => {
  return instance.post(`auth/send-verification-email`);
}

export const verifyEmail = (token: string) => {
  return instance.post(`auth/verify-email?token=${token}`);
}

export const sendVerifySMS = (phone: string) => {
  return instance.post(`auth/send-SMS-verify/${phone}`);
}

export const verifySMS = (token: string) => {
  return instance.post(`auth/verify-sms/${token}`);
}
