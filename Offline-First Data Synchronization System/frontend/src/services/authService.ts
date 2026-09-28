import api from "./api";

import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  User,
} from "../types/auth";

export async function login(
  data: LoginRequest
): Promise<TokenResponse> {
  const response =
    await api.post<TokenResponse>(
      "/api/v1/auth/login",
      data
    );

  return response.data;
}

export async function register(
  data: RegisterRequest
): Promise<User> {
  const response =
    await api.post<User>(
      "/api/v1/auth/register",
      data
    );

  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response =
    await api.get<User>(
      "/api/v1/auth/me"
    );

  return response.data;
}

export async function updateProfile(
  email: string
): Promise<User> {
  const response =
    await api.put<User>(
      "/api/v1/auth/profile",
      { email }
    );

  return response.data;
}

export async function changePassword(
  current_password: string,
  new_password: string
) {
  const response =
    await api.put(
      "/api/v1/auth/change-password",
      {
        current_password,
        new_password,
      }
    );

  return response.data;
}