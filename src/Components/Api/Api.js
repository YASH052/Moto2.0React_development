import axios from "axios";
// Base URL from environment variables
const baseURL = "https://qa.nuralsales.com/MotoNewAPI/api/user";
// Retrieve user ID with a fallback to 1
const userId = localStorage.getItem("userId") || 1;
// Create Axios instance with default configurations
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
// Add Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authKey");
    // console.log("token", token);
    if (token) {
      config.headers["authkey"] = token;
    } else {
      // Redirect to login page if token is missing
      console.warn("Session expired. Redirecting to login...");
      localStorage.removeItem("authKey"); // Ensure auth key is cleared
      // window.location.href = "/login";
    }
    return config;
  },
  (error) => Promise.reject(error) // Return rejected promise for request errors
);

// Add Response Interceptor
api.interceptors.response.use(
  (response) => {
    if (response.data.statusCode == 401 || response.status == 401) {
      alert("Unauthorized. Redirecting to login...");
      localStorage.removeItem("authKey");
      // window.location.href = "/login";
    }
    return response; // Ensure the response is returned
  },
  (error) => {
    const { response } = error;

    if (response) {
      if (response.status == 401) {
        alert("Unauthorized. Redirecting to login...");
        localStorage.removeItem("authKey");
        window.location.href = "/login";
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } else {
      console.error("Network Error: Unable to connect to the server.");
    }
    return Promise.reject(error); // Ensure errors are propagated
  }
);

// ------------------------------ Download Sales Report start ---------------------------------------------
export const GetSalestype = async (body) => {
  try {
    const response = await api.post(`/GetSalestype/${userId}`, body);
    return response.data;
  } catch (error) {
    console.error("Error GetSalestype types:", error);
    throw error;
  }
};

export const GetSalerseport = async (body) => {
  try {
    const response = await api.post(`/GetSalerseport/${userId}`, body);
    return response.data;
  } catch (error) {
    console.error("Error GetSalerseport types:", error);
    throw error;
  }
};

// ------------------------------ Download Sales Report end ---------------------------------------------

export const Regionmasterlist = async (body) => {
  try {
    const response = await api.post(`/Regionmasterlist/${userId}`, body);
    return response.data;
  } catch (error) {
    console.error("Error fetching Regionmasterlist  :", error);
    throw error;
  }
};

export const StateList = async (body) => {
  try {
    const response = await api.post(`/getstatelist/${userId}`, body);
    return response.data;
  } catch (error) {
    console.error("Error fetching sales types:", error);
    throw error;
  }
};

// ------------------------------ Serial Number Movement start ---------------------------------------------

export const ViewSerialNumberMovement = async (body) => {
  try {
    const response = await api.post(
      `/ViewSerialNumberMovement/${userId}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching ViewSerialNumberMovement  :", error);
    throw error;
  }
};

// ------------------------------ Serial Number Movement end ---------------------------------------------

// ------------------------------ View Attendance Report start ---------------------------------------------
export const GetRoleList = async (body) => {
  console.log("Fetching sales type...");
  try {
    const response = await api.get(`/GetRoleList/${userId}`, body);
    return response.data;
  } catch (error) {
    console.error("Error GetRoleList types:", error);
    throw error;
  }
};

export const GetUserListBasedOnRoleID = async (body) => {
  console.log("Fetching sales type...");
  try {
    const response = await api.post(
      `/GetUserListBasedOnRoleID/${userId}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error GetUserListBasedOnRoleID types:", error);
    throw error;
  }
};

export const GetAttendancedetailReport = async (params) => {
  try {
    const response = await api.post(
      `/GetAttendancedetailReport/${userId}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetAttendancedetailReport:", error);
    throw error;
  }
};

// ------------------------------ View Attendance Report end ---------------------------------------------

// ------------------------------ Competition Sales Report start ---------------------------------------------

export const ISPForBindDropDown = async () => {
  try {
    const response = await api.get(`/ISPForBindDropDown/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error in ISPForBindDropDown:", error);
    throw error;
  }
};

export const GetCompetitionBrand = async (params) => {
  try {
    const response = await api.post(`/GetCompetitionBrand/${userId}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in GetCompetitionBrand:", error);
    throw error;
  }
};

export const GetCompetitionCategoryData = async (params) => {
  try {
    const response = await api.post(
      `/GetCompetitionCategoryData/${userId}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetCompetitionCategoryData:", error);
    throw error;
  }
};

export const GetCompetitionModelData = async (params) => {
  try {
    const response = await api.post(
      `/GetCompetitionModelData/${userId}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetCompetitionModelData:", error);
    throw error;
  }
};

export const GetCompetitionSaleReport = async (params) => {
  try {
    const response = await api.post(
      `/GetCompetitionSaleReport/${userId}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetCompetitionSaleReport:", error);
    throw error;
  }
};

// ------------------------------ Competition Sales Report end ---------------------------------------------

//------------------------------ Primary sales report start ---------------------------------------------

export const GetStockBinTypeInfo = async (params) => {
  try {
    const response = await api.get(`/GetStockBinTypeInfo/${userId}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in GetStockBinTypeInfo:", error);
    throw error;
  }
};

export const GetAllTemplateDataV2 = async (params) => {
  try {
    const response = await api.post(`/GetAllTemplateDataV2/${userId}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in GetAllTemplateDataV2:", error);
    throw error;
  }
};

export const UploadPrimarySales = async (params) => {
  try {
    const response = await api.post(`/UploadPrimarySales/${userId}`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in UploadPrimarySales:", error);
    throw error;
  }
};
//------------------------------ Primary sales report end ---------------------------------------------

//------------------------------ Secondary sales report start ---------------------------------------------

export const UploadSecondarySales = async (params) => {
  try {
    const response = await api.post(`/UploadSecondarySales/${userId}`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in UploadSecondarySales:", error);
    throw error;
  }
};
//------------------------------ Secondary sales report end ---------------------------------------------

// ----------------------------- Primary to Tertiary report start ---------------------------------------------

export const GetModelListForDropdown = async (params) => {
  try {
    const response = await api.post(
      `/GetModelListForDropdown/${userId}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetModelListForDropdown:", error);
    throw error;
  }
};

export const GetSKUListForDropdown = async (params) => {
  try {
    const response = await api.post(`/GetSKUListForDropdown/${userId}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in GetSKUListForDropdown:", error);
    throw error;
  }
};

export const GetPrimaryToTertiaryTrackReportMoto = async (params) => {
  try {
    const response = await api.post(
      `/GetPrimaryToTertiaryTrackReportMoto/${userId}`,
      params,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetPrimaryToTertiaryTrackReportMoto:", error);
    throw error;
  }
};

// ----------------------------- Primary to Tertiary report end ---------------------------------------------
