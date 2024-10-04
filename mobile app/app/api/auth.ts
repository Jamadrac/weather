import axios from "axios";
import { User } from "../atoms/userAtom";

const API_URL = "http://your-api-url.com";

export const login = async (email: string, password: string): Promise<User> => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const signup = async (
  username: string,
  email: string,
  password: string,
  phoneNumber: string
): Promise<void> => {
  try {
    await axios.post(`${API_URL}/create`, {
      username,
      email,
      password,
      phoneNumber,
    });
  } catch (error: any) {
    throw error.response.data;
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await axios.post(`${API_URL}/forgot-password`, { email });
  } catch (error: any) {
    throw error.response.data;
  }
};

export const updateProfile = async (
  userId: string,
  username: string,
  email: string,
  phoneNumber: string
): Promise<User> => {
  try {
    const response = await axios.patch(`${API_URL}/profile/update`, {
      userId,
      username,
      email,
      phoneNumber,
    });
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};
