import { useMediaQuery } from "@mui/material";

export const LoacalVariables = {
  //user:
  UserId: "UserId",
  UserType: "UserType",
  Name: "Name",
  Email: "Email",
  Address: "Address",
};

export const validations = {
  email: {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Invalid email address",
    },
  },

  phone: {
    required: "Phone is required",
    pattern: {
      value: /^[0-9]{10}$/,
      message: "Phone number must be 10 digits",
    },
  },

  password: {
    required: "Password is required",
    pattern: {
      value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
      message: "Password must be at least 8 characters, include letters and numbers",
    },
  },
};

/**
 * Converts a string to upper case.
 * @param str The string to be converted.
 * @returns The string in title case.
 */
export function toUpperCase(str) {
  return str && str.toUpperCase();
}
/**
 * Converts a string to lower case.
 * @param str The string to be converted.
 * @returns The string in title case.
 */
export function toLowerCase(str) {
  return str && str.toLowerCase();
}

export const IsSmallScreen = () => {
  return useMediaQuery("(max-width:600px)");
};

export function setLocalValues(key, value) {
  try {
    let objectOfValue =
      typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, objectOfValue);
  } catch (error) {
    console.error("Error setting values in localStorage:", error);
  }
}

export function clearLocalValue(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing  values in localStorage:", error);
  }
}
export function getLocalValue(key, tranformToObject) {
  try {
    let strValue = localStorage.getItem(key);
    return tranformToObject === true
      ? convertToJson(strValue)
      : strValue || null;
  } catch (error) {
    console.error("Error getting  values from localStorage:", error);
  }
}

export function convertToJson(value) {
  return JSON.parse(value);
}

let currentAccessToken = null;

export const setAccessTokenForAxios = (token) => {
  currentAccessToken = token;
};

export const getAccessTokenForAxios = () => currentAccessToken;
