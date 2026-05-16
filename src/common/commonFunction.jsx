import { useMediaQuery } from "@mui/material";

export const LoacalVariables = {
    //user:
    UserId: "UserId",
    UserType: "UserType",
    Name: "Name",
    Email: "Email",
    Address: "Address",
    Permissions: "Permissions",
    SystemUser: "SystemUser"
}

export const customValidation = (required, validations) => ({
    required: required,
    pattern: {
        value: validations.regExp,
        message: validations.error
    }
});

export const validations = {
    email: {
        regExp: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        error: 'Invalid email address'
    },
    phone: {
        regExp: /^[0-9]{10}$/,
        error: 'Phone number must be 10 digits'
    },
    password: {
        regExp: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
        error: 'Password must be at least 8 characters, include letters and numbers'
    },
    name: {
        regExp: /^[a-zA-Z\s]{2,}$/,
        error: 'Name must contain only letters and be at least 2 characters'
    },
    number: {
        regExp: /^[0-9]+$/,
        error: 'Only numeric values are allowed'
    },
    url: {
        regExp: /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\/?#].*)?$/,
        error: 'Invalid URL format'
    },
    username: {
        regExp: /^[a-zA-Z0-9_]{3,15}$/,
        error: 'Username must be 3-15 characters and only contain letters, numbers, and underscores'
    },
    postalCode: {
        regExp: /^[1-9][0-9]{5}$/, // For Indian postal codes
        error: 'Invalid postal code format'
    }
};


export async function callAPI(url, method, body, id, formData) {
    let response = {};
    try {
        switch (method) {
            case Method.POST:
                response = await http.post(url, body);
                break;
            case Method.GET:
                if (id) {
                    response = await http.get(`${url}/${id}`);
                }
                else {
                    response = await http.get(`${url}`);
                }
                break;
            case Method.DELETE:
                response = await http.del(url, id);
                break;
            case Method.PUT:
                response = await http.put(url, body);
                break;
            case Method.PATCH:
                response = await http.patch(url, body);
                break;
            case Method.POSTFORMDATA:
                response = await http.postFormData(url, formData);
                break;
            case Method.PUTFORMDATA:
                response = await http.putFormData(url, formData);
                break;
        }
        return response;
    }
    catch (error) {
        console.error('API call error:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }
}

export const Method = {
    POST: 'POST',
    GET: 'GET',
    DELETE: 'DELETE',
    PUT: 'PUT',
    PATCH: 'PATCH',
    POSTFORMDATA: "POSTFORMDATA",
    PUTFORMDATA: "PUTFORMDATA"
}
/**
* Converts a string to upper case.
* @param str The string to be converted.
* @returns The string in title case.
*/
export function toUpperCase(str) {
    return str && str.toUpperCase()
}
/**
* Converts a string to lower case.
* @param str The string to be converted.
* @returns The string in title case.
*/
export function toLowerCase(str) {
    return str && str.toLowerCase()
}

export const IsSmallScreen = () => {
    return useMediaQuery('(max-width:600px)');
};

export function setLocalValues(key, value) {
    try {
        let objectOfValue = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(key, objectOfValue);
    } catch (error) {
        console.error('Error setting values in localStorage:', error);
    }
}

export function clearLocalValue(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing  values in localStorage:', error);
    }
}
export function getLocalValue(key, tranformToObject) {
    try {
        let strValue = localStorage.getItem(key);
        return tranformToObject === true ? (convertToJson(strValue)) : strValue || null;
    } catch (error) {
        console.error('Error getting  values from localStorage:', error);
    }
}

export function convertToJson(value) {
    return JSON.parse(value)
}

let currentAccessToken = null;

export const setAccessTokenForAxios = (token) => {
    currentAccessToken = token;
};

export const getAccessTokenForAxios = () => currentAccessToken;