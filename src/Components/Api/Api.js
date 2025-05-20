import axios from "axios";

// Base URL from environment variables
const baseURL = "https://qa.nuralsales.com/MotoNewAPI/api/user";
// Retrieve user ID with a fallback to 1

const getUserId = () => localStorage.getItem("userId") || 1;

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
    // console.log(token);

    // console.log("config", config);
    if (token) {
      config.headers["authkey"] = token;
    } else {
      // Avoid redirecting if token is missing, let the response interceptor handle it
      console.warn("Session token missing, but not redirecting immediately.");
    }
    // Update user ID in the URL for each request
    const userId = getUserId();
    if (config.url.includes(`/${userId}`) === false) {
      const urlParts = config.url.split("/");
      const lastPartIndex = urlParts.length - 1;
      if (urlParts[lastPartIndex].includes("?")) {
        // Handle case where there are query parameters
        const queryParts = urlParts[lastPartIndex].split("?");
        urlParts[lastPartIndex] = `${userId}?${queryParts[1]}`;
      } else {
        urlParts[lastPartIndex] = userId;
      }
      config.url = urlParts.join("/");
    }
    return config;
  },
  (error) => Promise.reject(error) // Return rejected promise for request errors
);

// Add Response Interceptor
api.interceptors.response.use(
  (response) => {
    if (response.data.statusCode == 401 || response.status == 401) {
      // Check if token exists before deciding to redirect
      const token = localStorage.getItem("authKey");
      if (!token) {
        alert("Unauthorized. Redirecting to login...");
        localStorage.removeItem("authKey");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        alert("Session expired or invalid. Redirecting to login...");
        localStorage.removeItem("authKey");
        localStorage.removeItem("token");

        window.location.href = "/login";
      }
    }
    return response; // Ensure the response is returned
  },
  (error) => {
    const { response } = error;

    if (response) {
      if (response.status == 401) {
        const token = localStorage.getItem("authKey");
        if (!token) {
          alert("Unauthorized. Redirecting to login...");
          localStorage.removeItem("authKey");
          localStorage.removeItem("token");

          window.location.href = "/login";
        } else {
          alert("Session expired or invalid. Redirecting to login...");
          localStorage.removeItem("authKey");
          localStorage.removeItem("token");

          window.location.href = "/login";
        }
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
    const response = await api.post(`/GetSalestype/${getUserId()}`, body);
    return response.data;
  } catch (error) {
    console.error("Error GetSalestype types:", error);
    throw error;
  }
};

export const GetSalerseport = async (body) => {
  try {
    const response = await api.post(`/GetSalerseport/${getUserId()}`, body);
    return response.data;
  } catch (error) {
    console.error("Error GetSalerseport types:", error);
    throw error;
  }
};

// ------------------------------ Download Sales Report end ---------------------------------------------

export const Regionmasterlist = async (body) => {
  try {
    const response = await api.post(`/Regionmasterlist/${getUserId()}`, body);
    return response.data;
  } catch (error) {
    console.error("Error fetching Regionmasterlist  :", error);
    throw error;
  }
};

export const StateList = async (body) => {
  try {
    const response = await api.post(`/getstatelist/${getUserId()}`, body);
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
      `/ViewSerialNumberMovement/${getUserId()}`,
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
    const response = await api.get(`/GetRoleList/${getUserId()}`, body);
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
      `/GetUserListBasedOnRoleID/${getUserId()}`,
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
      `/GetAttendancedetailReport/${getUserId()}`,
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
    const response = await api.get(`/ISPForBindDropDown/${getUserId()}`);
    return response.data;
  } catch (error) {
    console.error("Error in ISPForBindDropDown:", error);
    throw error;
  }
};

export const GetCompetitionBrand = async (params) => {
  try {
    const response = await api.post(
      `/GetCompetitionBrand/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetCompetitionBrand:", error);
    throw error;
  }
};

export const GetCompetitionCategoryData = async (params) => {
  try {
    const response = await api.post(
      `/GetCompetitionCategoryData/${getUserId()}`,
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
      `/GetCompetitionModelData/${getUserId()}`,
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
      `/GetCompetitionSaleReport/${getUserId()}`,
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
    const response = await api.get(
      `/GetStockBinTypeInfo/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetStockBinTypeInfo:", error);
    throw error;
  }
};

export const GetAllTemplateDataV2 = async (params) => {
  try {
    const response = await api.post(
      `/GetAllTemplateDataV2/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetAllTemplateDataV2:", error);
    throw error;
  }
};

export const UploadPrimarySales = async (params) => {
  try {
    const response = await api.post(
      `/UploadPrimarySales/${getUserId()}`,
      params,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
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
    const response = await api.post(
      `/UploadSecondarySales/${getUserId()}`,
      params,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
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
      `/GetModelListForDropdown/${getUserId()}`,
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
    const response = await api.post(
      `/GetSKUListForDropdown/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetSKUListForDropdown:", error);
    throw error;
  }
};

export const GetPrimaryToTertiaryTrackReportMoto = async (params) => {
  try {
    const response = await api.post(
      `/GetPrimaryToTertiaryTrackReportMoto/${getUserId()}`,
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

// ----------------------------- View Sales Channel stock SB start ---------------------------------------------
export const fetchSalesChannelDropdown = async (body) => {
  try {
    const response = await api.post(
      `/GetSalesChannelTypedropdown/${getUserId()}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetchSalesChannelDropdown:", error);

    throw error;
  }
};

// ----------------------------- view / search retailer start ---------------------------------------------

export const SalesChannelListWithRetailer = async (params) => {
  try {
    const response = await api.post(
      `/SalesChannelListWithRetailer/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in SalesChannelListWithRetailer:", error);
    throw error;
  }
};

export const BindEntityList = async (params) => {
  try {
    const response = await api.post(`/BindEntityList/${getUserId()}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in BindEntityList:", error);
    throw error;
  }
};

export const GetStateListForDropdown = async (params) => {
  try {
    const response = await api.post(
      `/GetStateListForDropdown/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetStateListForDropdown:", error);
    throw error;
  }
};

export const GetCityListForDropdown = async (params) => {
  try {
    const response = await api.post(
      `/GetCityListForDropdown/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetCityListForDropdown:", error);
    throw error;
  }
};

export const GetRetailerListDrpdown = async (params) => {
  try {
    const response = await api.post(
      `/GetRetailerListDrpdown/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetRetailerListDrpdown:", error);
    throw error;
  }
};

export const getRetailer = async (params) => {
  try {
    const response = await api.post(
      `/getRetailerlistV2/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in getRetailer:", error);
    throw error;
  }
};

export const RetailerStatusUpdate = async (params) => {
  try {
    const response = await api.post(
      `/RetailerStatusUpdate/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in RetailerStatusUpdate:", error);
    throw error;
  }
};

export const getRetailerlistinfo = async (params) => {
  try {
    const response = await api.post(
      `/getRetailerlistinfo/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in getRetailerlistinfo:", error);
    throw error;
  }
};

// ----------------------------- view / search retailer end ---------------------------------------------

// ----------------------------- Price Master List V2 start ---------------------------------------------

export const GetPriceMasterListV2 = async (params) => {
  try {
    const response = await api.post(
      `/GetPriceMasterListV2/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetPriceMasterListV2:", error);
    throw error;
  }
};

export const Countrymasterlist = async (params) => {
  try {
    const response = await api.post(
      `/Countrymasterlist/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in Countrymasterlist:", error);
    throw error;
  }
};

export const GetPriceListName = async (params) => {
  try {
    const response = await api.post(`/GetPriceListName/${getUserId()}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in GetPriceListName:", error);
    throw error;
  }
};

// ----------------------------- Price Master List V2 end ---------------------------------------------

// ----------------------------- Sales Channel start ---------------------------------------------

export const GetSalesChannelType = async (params) => {
  try {
    const response = await api.post(
      `/GetSalesChannelType/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetSalesChannelType:", error);
    throw error;
  }
};

export const GetParentSalesChannel = async (params) => {
  try {
    const response = await api.post(
      `/GetParentSalesChannel/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetParentSalesChannel:", error);
    throw error;
  }
};

export const GetReportingHierarchyList = async (params) => {
  try {
    const response = await api.post(
      `/GetReportingHierarchyList/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetReportingHierarchyList:", error);
    throw error;
  }
};

export const ManageSalesChannelMoto = async (params) => {
  try {
    const response = await api.post(
      `/ManageSalesChannelMoto/${getUserId()}`,
      params,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in ManageSalesChannelMoto:", error);
    throw error;
  }
};

export const getSalesChannelExcelReferenceDataLink = async (params) => {
  try {
    const response = await api.post(
      `/getSalesChannelExcelReferenceDataLink/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in getSalesChannelExcelReferenceDataLink:", error);
    throw error;
  }
};

export const UpdateSalesChannelStatus = async (params) => {
  try {
    const response = await api.post(
      `/UpdateSalesChannelStatus/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in UpdateSalesChannelStatus:", error);
    throw error;
  }
};

export const UploadSalesChannelMasterMoto = async (params) => {
  try {
    const response = await api.post(
      `/UploadSalesChannelMasterMoto/${getUserId()}`,
      params,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in UploadSalesChannelMasterMoto:", error);
    throw error;
  }
};

// ----------------------------- Sales Channel end ---------------------------------------------

// ----------------------------- Retailer start ---------------------------------------------

export const UploadRetailerMaster = async (params) => {
  try {
    const response = await api.post(
      `/UploadRetailerMaster/${getUserId()}?salesChannelID=0&password=''&passwordSalt=''`,
      params,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in UploadRetailerMaster:", error);
    throw error;
  }
};

// ----------------------------- Retailer end ---------------------------------------------
export const fetchBinType = async (body) => {
  try {
    const response = await api.post(`/StockBinTypeMaster/${getUserId()}`, body);
    return response.data;
  } catch (error) {
    console.error("Error in fetchBinType:", error);
    throw error;
  }
};

export const fetchModelDropdown = async (body) => {
  try {
    const response = await api.post(
      `/GetModelListForDropdown/${getUserId()}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetchModelDropdown:", error);
    throw error;
  }
};

export const fetchSKUList = async (body) => {
  try {
    const response = await api.post(
      `/GetSKUListForDropdown/${getUserId()}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetchSKUList:", error);
    throw error;
  }
};

export const fetchSalesChannelStockSB = async (body) => {
  try {
    const response = await api.post(
      `/Saleschannelstockreport/${getUserId()}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetchSalesChannelStockSB:", error);
    throw error;
  }
};

// ----------------------------- View Sales Channel stock SB end ---------------------------------------------

// ----------------------------- Redigntion file start --------------------------------------------

export const fetchProcessList = async (body) => {
  try {
    const response = await api.post(
      `/InterfaceGetProcessMaster/${getUserId()}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetchProcessList:", error);
    throw error;
  }
};

export const fetchSAPList = async (body) => {
  try {
    const response = await api.post(
      `/InterfaceGetFileDetail/${getUserId()}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetchSAPList:", error);
    throw error;
  }
};

export const uploadRedigntionFile = async (body) => {
  try {
    const response = await api.post(
      `/InterfaceUploadFile/${getUserId()}`,
      body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in uploadRedigntionFile:", error);
    throw error;
  }
};

export const UploadRedigntionFile = async (form) => {
  try {
    const response = await api.post(`/UploadSapFile/${getUserId()}`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in UploadRedigntionFile:", error);
    throw error;
  }
};

// ----------------------------- Redigntion file end ---------------------------------------------
// ----------------------------- Counter share report start ---------------------------------------------
export const fetchISPList = async () => {
  try {
    const response = await api.get(`/ISPForBindDropDown/${getUserId()}`);
    return response.data;
  } catch (error) {
    console.error("Error in fetchISPLIst:", error);
    throw error;
  }
};

export const fetchCounterShareReport = async (body) => {
  try {
    const response = await api.post(`/CounterShareReport/${getUserId()}`, body);
    return response.data;
  } catch (error) {
    console.error("Error in fetchCounterShareReport:", error);
    throw error;
  }
};
// ----------------------------- Counter share report end ---------------------------------------------
// ----------------------------- Stock Adjustment Upload start ---------------------------------------------

export const downloadBincode = async (body) => {
  try {
    const response = await api.post(
      `/StockBinTypeReferenceDatalinkAPI/${getUserId()}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error in downloadBincode:", error);
    throw error;
  }
};

export const downloadReferenceCode = async (body) => {
  try {
    const response = await api.post(
      `/StockAdjustmentReferenceDatalinkAPI/${getUserId()}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error in download Reference Code:", error);
    throw error;
  }
};

export const uploadStockAdjustment = async (form) => {
  try {
    const response = await api.post(
      `/StockAdjustmentUploadAPIForMoto/${getUserId()}`,
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in upload Stock Adjustment:", error);
    throw error;
  }
};

export const fetchChannelName = async (body) => {
  try {
    const response = await api.post(
      `/GetSalesChannelType/${getUserId()}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetchChannelName:", error);
    throw error;
  }
};

export const fetchReason = async (body) => {
  try {
    const response = await api.post(
      `/GetReasonMasterListAPI/${getUserId()}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetchReason:", error);
    throw error;
  }
};
// ----------------------------- Stock Adjustment Upload end ---------------------------------------------
// ----------------------------- Model  start ---------------------------------------------
export const fetchBrandList = async (body) => {
  try {
    const response = await api.post(
      `/GetBrandListDrpdown/${getUserId()}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetchBrandList:", error);
    throw error;
  }
};

export const fetchCategoryList = async (body) => {
  try {
    const response = await api.post(
      `/GetProductCategoryListDropdown/${getUserId()}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetchCategoryList:", error);
    throw error;
  }
};

export const fetchSubCategoryList = async (body) => {
  try {
    const response = await api.post(
      `/GetCategoryListDropdown/${getUserId()}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetchSubCategoryList:", error);
    throw error;
  }
};

export const manageModel = async (body) => {
  try {
    const response = await api.post(
      `/ManageModelAPIForMoto/${getUserId()}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error in manageModel:", error);
    throw error;
  }
};

export const fetchModelList = async (body) => {
  try {
    const response = await api.post(
      `/GetModelListforMoto/${getUserId()}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetchModelList:", error);
    throw error;
  }
};

// ----------------------------- Model  end ---------------------------------------------

// ----------------------------- Unblock Finance start ---------------------------------------------

export const fetchIMEIList = async (body) => {
  try {
    const response = await api.post(
      `/ViewSerialNumberForFinanceUnblock/${getUserId()}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetchIMEIList:", error);
    throw error;
  }
};

// ----------------------------- Unblock Finance end ---------------------------------------------
// ----------------------------- Ranking Weightage start ---------------------------------------------

export const fetchRankingWeightage = async () => {
  try {
    const response = await api.get(
      `/GetRankingWeightageListMoto/${getUserId()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetchRankingWeightage:", error);
    throw error;
  }
};

export const manageRankingWeightage = async (body) => {
  try {
    const response = await api.post(
      `/SaveRankingWeightageMoto/${getUserId()}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error in manageRankingWeightage:", error);
    throw error;
  }
};
// ----------------------------- Ranking Weightage end ---------------------------------------------

// -------------------------- intermediary sale--------------------------

export const UploadIntermediarySales = async (params) => {
  try {
    const response = await api.post(
      `/UploadIntermediarySales/${getUserId()}`,
      params,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in UploadIntermediarySales:", error);
    throw error;
  }
};

// ----------------------------- Sales Channel View start ---------------------------------------------

export const GetSalesChannelMasterList = async (body) => {
  try {
    const response = await api.post(
      `/GetSalesChannelMasterList/${getUserId()}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetSalesChannelMasterList:", error);

    throw error;
  }
};

export const GetISPSaleReport = async (params) => {
  try {
    const response = await api.post(`/GetISPSaleReport/${getUserId()}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in GetISPSaleReport:", error);
    throw error;
  }
};
export const GetSalesChannelListForDropdown = async (body) => {
  try {
    const response = await api.post(
      `/GetSalesChannelListForDropdown/${getUserId()}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetSalesChannelListForDropdown:", error);

    throw error;
  }
};

export const GetTargetInfoV2 = async (params) => {
  try {
    const response = await api.post(`/GetTargetInfoV2/${getUserId()}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in GetTargetInfoV2:", error);
    throw error;
  }
};
// ----------------------------- Sales Channel View end ---------------------------------------------

// ----------------------------- Retailer Type start ---------------------------------------------

export const GetTargetForDropdown = async (params) => {
  try {
    const response = await api.post(
      `/GetTargetForDropdown/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetTargetForDropdown:", error);
    throw error;
  }
};

export const GetTargetNameList = async (params) => {
  try {
    const response = await api.post(
      `/GetTargetNameList/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetTargetNameList:", error);
    throw error;
  }
};

// Primary sale upload return api

export const UploadPrimarySalesReturn = async (
  params,
  formattedDate,
  selectedUserId
) => {
  try {
    const response = await api.post(
      `/UploadPrimarySalesReturn/${getUserId()}?templateType=${selectedUserId}&date=${formattedDate}`,
      params,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in UploadPrimarySalesReturn:", error);
    throw error;
  }
};

export const getReportingHierarchyName = async (params) => {
  try {
    const response = await api.post(
      `/getReportingHierarchyName/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in getReportingHierarchyName:", error);

    throw error;
  }
};

export const getParentRetailerlist = async (params) => {
  try {
    const response = await api.post(
      `/getParentRetailerlist/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in getParentRetailerlist:", error);
    throw error;
  }
};

// Secondry sale upload return api:
export const UploadSecondarySalesReturn = async (
  params,
  formattedDate,
  selectedUserId
) => {
  try {
    // console.log(params, selectedUserId, formattedDate);
    const response = await api.post(
      `/UploadSecondarySalesReturn/${getUserId()}?templateType=${selectedUserId}&date=${formattedDate}`,
      params,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in UploadSecondarySalesReturn:", error);
    throw error;
  }
};

// Intermediary sale return upload
// Secondry sale upload return api:

export const UploadIntermediarySalesReturn = async (
  params,
  formattedDate,
  selectedUserId
) => {
  try {
    // console.log(params, selectedUserId, formattedDate);
    const response = await api.post(
      `/UploadIntermediarySalesReturn/${getUserId()}?templateType=${selectedUserId}&date=${formattedDate}`,
      params,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in UploadIntermediarySalesReturn:", error);
    throw error;
  }
};

// ----------------------------- Sales Channel View start ---------------------------------------------

// ----------------------------- Retailer Type start ---------------------------------------------

export const getRetailerlist = async (params) => {
  try {
    const response = await api.post(`/getRetailerlist/${getUserId()}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in getRetailerlist:", error);
    throw error;
  }
};

export const SCRCategoryList = async (params) => {
  try {
    const response = await api.post(`/SCRCategoryList/${getUserId()}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in SCRCategoryList:", error);
    throw error;
  }
};

export const getSalesmaninfo = async (params) => {
  try {
    const response = await api.post(`/getSalesmaninfo/${getUserId()}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in getSalesmaninfo:", error);
    throw error;
  }
};

export const AddRetailerForMoto = async (params) => {
  try {
    const response = await api.post(
      `/AddRetailerForMoto/${getUserId()}`,
      params,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in AddRetailerForMoto:", error);
    throw error;
  }
};

// ----------------------------- Retailer Type end ---------------------------------------------
// ----------------------------- SKU start ---------------------------------------------
export const GetColorDropdownList = async (params) => {
  try {
    const response = await api.post(
      `/GetColorDropdownList/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetColorDropdownList:", error);
    throw error;
  }
};

export const GetSKUListForMoto = async (params) => {
  try {
    const response = await api.post(
      `/GetSKUListForMoto/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetSKUListForMoto:", error);
    throw error;
  }
};

export const ManageSkuForMoto = async (body) => {
  try {
    const response = await api.post(`/ManageSkuForMoto/${getUserId()}`, body);
    return response.data;
  } catch (error) {
    console.error("Error in ManageSkuForMoto:", error);
    throw error;
  }
};

export const GetHSNMasterListForDropdown = async (params) => {
  try {
    const response = await api.post(
      `/GetHSNMasterListForDropdown/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetHSNMasterListForDropdown:", error);
    throw error;
  }
};
// ----------------------------- SKU end ---------------------------------------------

// ----------------------------- ISP Agency Start---------------------------------------------

export const ManageISPAgencyMaster = async (body) => {
  try {
    const response = await api.post(
      `/ManageISPAgencyMaster/${getUserId()}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error in ManageISPAgencyMaster:", error);
    throw error;
  }
};

export const GetISPAgencyList = async (body) => {
  try {
    const response = await api.post(`/GetISPAgencyList/${getUserId()}`, body);
    return response.data;
  } catch (error) {
    console.error("Error in GetISPAgencyList:", error);
    throw error;
  }
};

// ----------------------------- ISP Agency End---------------------------------------------

// ----------------------------- Price Band Master Start---------------------------------------------

export const ManagePricebandmaster = async (body) => {
  try {
    const response = await api.post(
      `/ManagePricebandmaster/${getUserId()}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error in ManagePricebandmaster:", error);
    throw error;
  }
};

export const GetPriceBandMasterList = async (body) => {
  try {
    const response = await api.post(
      `/GetPricebandmasterlist/${getUserId()}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetPriceBandMasterList:", error);
    throw error;
  }
};

// ----------------------------- Price Band Master End---------------------------------------------

// ----------------------------- Leave Report start ---------------------------------------------
export const viewLeaveReport = async (params) => {
  try {
    const response = await api.post(`/viewLeaveReport/${getUserId()}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in viewLeaveReport:", error);
    throw error;
  }
};

// export const GetUserListBasedOnRoleID = async(params)=>{
//   try {
//     const response = await api.post(`/GetUserListBasedOnRoleID/${getUserId()}`, params);
//     return response.data;
//   } catch (error) {
//     console.error("Error in GetUserListBasedOnRoleID:", error);
//     throw error;
//   }
// }

// export const GetRoleList = async(params)=>{
//   try {
//     const response = await api.post(`/GetRoleList/${getUserId()}`, params);
//     return response.data;
//   } catch (error) {
//     console.error("Error in GetRoleList:", error);
//     throw error;
//   }
// }
// ----------------------------- Leave Report end ---------------------------------------------
// ----------------------------- State start ---------------------------------------------

// export const GetRegionListDropdown = async(params)=>{
//   try {
//     const response = await api.post(`/GetRegionListDropdown/${getUserId()}`, params);
//     return response.data;
//   } catch (error) {
//     console.error("Error in GetRegionListDropdown:", error);
//     throw error;
//   }
// }

export const GetStateListForMoto = async (params) => {
  try {
    const response = await api.post(
      `/GetStateListForMoto/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetStateListForMoto:", error);
    throw error;
  }
};
export const ManageStateAPIForMoto = async (body) => {
  try {
    const response = await api.post(
      `/ManageStateAPIForMoto/${getUserId()}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error in ManageStateAPIForMoto:", error);
    throw error;
  }
};
// ----------------------------- State end ---------------------------------------------

// ----------------------------- City start ---------------------------------------------
export const getCityMasterlist = async (params) => {
  try {
    const response = await api.post(
      `/getCityMasterlist/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in getCityMasterlist:", error);
    throw error;
  }
};

export const manageCityMaster = async (body) => {
  try {
    const response = await api.post(`/manageCityMaster/${getUserId()}`, body);
    return response.data;
  } catch (error) {
    console.error("Error in manageCityMaster:", error);
    throw error;
  }
};
// ----------------------------- City end ---------------------------------------------

// ----------------------------- Brand start ---------------------------------------------

export const getbrandlist = async (body) => {
  try {
    const response = await api.post(`/getbrandlist/${getUserId()}`, body);
    return response.data;
  } catch (error) {
    console.error("Error in getbrandlist:", error);
    throw error;
  }
};

export const managebrandMaster = async (body) => {
  try {
    const response = await api.post(`/managebrandMaster/${getUserId()}`, body);
    return response.data;
  } catch (error) {
    console.error("Error in managebrandMaster:", error);
    throw error;
  }
};

// ----------------------------- Brand end ---------------------------------------------

// ----------------------------- sub-Category start ---------------------------------------------

export const ManageSubCategoryMaster = async (body) => {
  try {
    const response = await api.post(
      `/ManageSubCategoryMaster/${getUserId()}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error in ManageSubCategoryMaster:", error);
    throw error;
  }
};

export const GetSubCategoryList = async (body) => {
  try {
    const response = await api.post(`/GetSubCategoryList/${getUserId()}`, body);
    return response.data;
  } catch (error) {
    console.error("Error in GetSubCategoryList:", error);
    throw error;
  }
};

// ----------------------------- sub-Category end ---------------------------------------------

// ----------------------------- Leave Allocation start ---------------------------------------------
export const GetLeaveTypeDropdownList = async () => {
  try {
    const response = await api.get(`/GetLeaveTypeDropdownList/${getUserId()}`);
    return response.data;
  } catch (error) {
    console.error("Error in GetLeaveTypeDropdownList:", error);
    throw error;
  }
};

export const SaveLeaveAllocation = async (params) => {
  try {
    const response = await api.post(
      `/SaveLeaveAllocation/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in SaveLeaveAllocation:", error);
    throw error;
  }
};

export const GetAllotedLeaveList = async (params) => {
  try {
    const response = await api.post(
      `/GetAllotedLeaveList/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetAllotedLeaveList:", error);
    throw error;
  }
};

// ----------------------------- Leave Allocation end ---------------------------------------------

// ----------------------------- Target start ---------------------------------------------

export const GetRegionListDropdown = async (params) => {
  try {
    const response = await api.post(
      `/GetRegionListDropdown/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetRegionListDropdown:", error);
    throw error;
  }
};

export const GetTargetReferenceCode = async (params) => {
  try {
    const response = await api.post(
      `/GetTargetReferenceCode/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetTargetReferenceCode:", error);
    throw error;
  }
};

export const UploadTarget = async (formData, file) => {
  try {
    const data = new FormData();

    // Append the file
    data.append("UploadedFile", file);

    // Destructure form data values
    const {
      targetName,
      regionID,
      stateID,
      cityID,
      targetType,
      targetBasedOn,
      targetUserTypeID,
      targetCategory,
      targetFrom,
      targetTo,
    } = formData;

    // Construct URL with query parameters
    const url = `/UploadTargetV2/${getUserId()}?targetName=${targetName}&regionID=${regionID}&stateID=${stateID}&cityID=${cityID}&targetType=${targetType}&targetBasedOn=${targetBasedOn}&targetUserTypeID=${targetUserTypeID}&targetCategory=${targetCategory}&targetFrom=${targetFrom}&targetTo=${targetTo}`;

    const response = await api.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error in UploadTarget:", error);
    throw error;
  }
};
// ----------------------------- Target end ---------------------------------------------

// -----------------------------Get User Laggards API---------------------------------------------

export const GetUserLaggardReport = async (params) => {
  try {
    const response = await api.post(
      `/GetUserLaggardReport/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetUserLaggardReport:", error);
    throw error;
  }
};

// ----------------------------- Price List start ---------------------------------------------

export const UploadPriceList = async (formData, file) => {
  try {
    const data = new FormData();

    // Append the file
    data.append("UploadedFile", file);

    // Destructure form data values
    const {
      priceListID,
      effectiveDate,
      status,
      mapWithAllState,
      stateidstring,
    } = formData;

    // Construct URL with query parameters
    const url = `/UploadPriceMaster/${getUserId()}?priceListID=${priceListID}&effectiveDate=${effectiveDate}&status=${status}&mapWithAllState=${mapWithAllState}`;

    const response = await api.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error in UploadPriceList:", error);
    throw error;
  }
};

export const GetPriceListAPI = async (params) => {
  try {
    const response = await api.get(`/GetPriceListAPI/${getUserId()}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in GetPriceListDataWithMappingAPI:", error);
    throw error;
  }
};

export const GetPriceListDataWithMappingAPI = async (params) => {
  try {
    const response = await api.post(
      `/GetPriceListDataWithMappingAPI/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetPriceListDataWithMappingAPI:", error);
    throw error;
  }
};
// ----------------------------- Price List end ---------------------------------------------
// ----------------------------- Category  start ---------------------------------------------

export const GetCategoryList = async (params) => {
  try {
    const response = await api.post(`/GetCategoryList/${getUserId()}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in GetCategoryList:", error);
    throw error;
  }
};

export const ManageProductCategory = async (body) => {
  try {
    const response = await api.post(
      `/ManageProductCategory/${getUserId()}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error in ManageProductCategory:", error);
    throw error;
  }
};
// ----------------------------- Category end ---------------------------------------------
// ----------------------------- ISP start ---------------------------------------------

export const GetISPParentHierarchyList = async () => {
  try {
    const response = await api.get(`/GetISPParentHierarchyList/${getUserId()}`);
    return response.data;
  } catch (error) {
    console.error("Error in GetISPParentHierarchyList:", error);
    throw error;
  }
};

export const GetISPList = async (body) => {
  try {
    const response = await api.post(`/GetISPList/${getUserId()}`, body);
    return response.data;
  } catch (error) {
    console.error("Error in GetISPList:", error);
    throw error;
  }
};
export const getISPMasterDataLink = async (params) => {
  try {
    const response = await api.post(
      `/getISPMasterDataLink/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in getISPMasterDataLink:", error);
    throw error;
  }
};
export const GetAgencyListDropdown = async () => {
  try {
    const response = await api.get(`/GetAgencyListDropdown/${getUserId()}`);
    return response.data;
  } catch (error) {
    console.error("Error in GetAgencyListDropdown:", error);
    throw error;
  }
};

export const getISPRetailerReferenceDataLink = async (params) => {
  try {
    const response = await api.post(
      `/getISPRetailerReferenceDataLink/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in getISPRetailerReferenceDataLink:", error);
    throw error;
  }
};

export const SaveUpdateISPData = async (body) => {
  try {
    const response = await api.post(`/SaveUpdateISPData/${getUserId()}`, body);
    return response.data;
  } catch (error) {
    console.error("Error in SaveUpdateISPData:", error);
    throw error;
  }
};

export const GetISPListDrpdown = async (params) => {
  try {
    const response = await api.post(
      `/GetISPListDrpdown/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetISPListDrpdown:", error);
    throw error;
  }
};

export const ExitISP = async (params) => {
  try {
    const response = await api.post(`/ExitISP/${getUserId()}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in ExitISP:", error);
    throw error;
  }
};

export const UpdateISPMappingToNewRetailer = async (params) => {
  try {
    const response = await api.post(
      `/UpdateISPMappingToNewRetailer/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in UpdateISPMappingToNewRetailer:", error);
    throw error;
  }
};

export const UpdateStatusISP = async (params) => {
  try {
    const response = await api.post(`/UpdateStatusISP/${getUserId()}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in UpdateStatusISP:", error);
    throw error;
  }
};

// ----------------------------- Product end ---------------------------------------------

export const ManagePriceListWithMappingAPI = async (params) => {
  try {
    const response = await api.post(
      `/ManagePriceListWithMappingAPI/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in ManagePriceListWithMappingAPI:", error);
    throw error;
  }
};

// ----------------------------- Price List end ---------------------------------------------

// ----------------------------- Gregraphy single upload start ---------------------------------------------

export const LocationMasterUploadRefCode = async () => {
  try {
    const response = await api.get(
      `/LocationMasterUploadRefCode/${getUserId()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in LocationMasterUploadRefCode:", error);
    throw error;
  }
};

export const BulkLocationUploadAPIV2 = async (form) => {
  try {
    const response = await api.post(
      `/BulkLocationUploadAPIV2/${getUserId()}`,
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in BulkLocationUploadAPIV2:", error);
    throw error;
  }
};
// ----------------------------- Gregraphy single upload end ---------------------------------------------

// ----------------------------- competition brand start ---------------------------------------------

export const ManageCompetitionBrand = async (body) => {
  try {
    const response = await api.post(
      `/ManageCompetitionBrand/${getUserId()}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error in ManageCompetitionBrand:", error);
    throw error;
  }
};

// ----------------------------- competition brand end ---------------------------------------------

//----------------------------- Attendance Update start ---------------------------------------------

export const GetEntityListWithRoleID = async (roleID) => {
  try {
    console.log(roleID, "roleID");
    const response = await api.get(
      `/GetEntityListWithRoleID/${getUserId()}?roleID=${roleID}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetEntityListWithRoleID:", error);
    throw error;
  }
};
//----------------------------- Attendance Save start ---------------------------------------------
export const ManageAttendanceRegularisation = async (params) => {
  try {
    const response = await api.post(
      `/ManageAttendanceRegularisation/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in ManageAttendanceRegularisation:", error);
    throw error;
  }
};

//----------------------------- Attendance save end ---------------------------------------------

//----------------------------- User wise update balance leave start ---------------------------------------------
export const UserWiseUpdateBalanceLeave = async (params) => {
  try {
    const response = await api.post(
      `/UserWiseUpdateBalanceLeave/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in UserWiseUpdateBalanceLeave:", error);
    throw error;
  }
};

export const GetAttendanceRegularisationData = async (params) => {
  try {
    const response = await api.post(
      `/GetAttendanceRegularisationData/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetAttendanceRegularisationData:", error);
    throw error;
  }
};

export const GetUserLeaveDetailsListMoto = async (params) => {
  try {
    const response = await api.post(
      `/GetUserLeaveDetailsListMoto/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetUserLeaveDetailsListMoto:", error);
    throw error;
  }
};
//----------------------------- User wise update balance leave end ---------------------------------------------
//----------------------------- Competition Start ---------------------------------------------

//----------------------------- Product Bulk Upload Reference code start ---------------------------------------------

export const ProductMasterUploadRefCode = async () => {
  try {
    const response = await api.get(
      `/ProductMasterUploadRefCode/${getUserId()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in ProductMasterUploadRefCode:", error);
    throw error;
  }
};

//----------------------------- Product Bulk Upload Reference code end ---------------------------------------------

//----------------------------- Product Bulk Upload start ---------------------------------------------------
export const BulkProductUploadAPIv2 = async (params) => {
  console.log(params, "params");
  try {
    const response = await api.post(
      `/BulkProductUploadAPIv2/${getUserId()}`,
      params,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in BulkProductUploadAPIv2:", error);
    throw error;
  }
};
//----------------------------- Product Bulk Upload end ---------------------------------------------

export const GetCompetitionCategoryListMoto = async (params) => {
  try {
    const response = await api.post(
      `/GetCompetitionCategoryListMoto/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetCompetitionCategoryListMoto:", error);
    throw error;
  }
};

export const ManageCompetitionCategory = async (body) => {
  try {
    const response = await api.post(
      `/ManageCompetitionCategory/${getUserId()}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error in ManageCompetitionCategory:", error);
    throw error;
  }
};

//----------------------------- Competition End ---------------------------------------------

// ----------------------------- GetStockAdjustmentReport---------------------------------------------
export const GetStockAdjustmentReport = async (params) => {
  try {
    const response = await api.post(
      `/GetStockAdjustmentReportMoto/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetStockAdjustmentReport:", error);
    throw error;
  }
};

export const GetSalesChannelTypedropdown = async (params) => {
  try {
    const response = await api.post(
      `/GetSalesChannelTypedropdown/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetSalesChannelTypedropdown:", error);
    throw error;
  }
};

// ----------------------------- GetStockAdjustmentReport end ---------------------------------------------

//----------------------------- Reddington Bulk Upload start ---------------------------------------------

export const BulkUploadTSMRetailerAPI = async (params) => {
  try {
    const response = await api.post(
      `/BulkUploadTSMRetailerAPI/${getUserId()}`,
      params,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in BulkUploadTSMRetailerAPI:", error);
    throw error;
  }
};
//----------------------------- Reddington Bulk Upload end ---------------------------------------------

//----------------------------- Reddington Bulk Upload Ref Code start ---------------------------------------------

export const TSMRetailerMappingUploadRefCode = async () => {
  try {
    const response = await api.get(
      `/TSMRetailerMappingUploadRefCode/${getUserId()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in TSMRetailerMappingUploadRefCode:", error);
    throw error;
  }
};

//----------------------------- Reddington Bulk Upload Ref Code end ---------------------------------------------

// ----------------------------- Organisation Hierarchy Report start ---------------------------------------------

export const GetLocationList = async (params) => {
  try {
    const response = await api.post(`/GetLocationList/${getUserId()}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in GetLocationList:", error);
    throw error;
  }
};

export const GetOrgnHierarchyMappingReport = async (params) => {
  try {
    const response = await api.post(
      `/GetOrgnHierarchyMappingReport/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetOrgnHierarchyMappingReport:", error);
    throw error;
  }
};
// ----------------------------- Organisation Hierarchy Report end ---------------------------------------------
// ----------------------------- Prebooking SKU start ---------------------------------------------

export const SaveUpdateSkuPreBooking = async (body) => {
  try {
    const response = await api.post(
      `/SaveUpdateSkuPreBooking/${getUserId()}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error in SaveUpdateSkuPreBooking:", error);
    throw error;
  }
};

// ----------------------------- Prebooking SKU end ---------------------------------------------
// ------------------------------Report Queue start ---------------------------------------------

export const ReportQueueScreenAPI = async (params) => {
  try {
    const response = await api.post(
      `/ReportQueueScreenAPI/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in report queue screen api", error);
    throw error;
  }
};

// ------------------------------Report Queue end ---------------------------------------------
// ------------------------------Competition Model start ---------------------------------------------

export const ManageCompetitionModelMoto = async (params) => {
  try {
    const response = await api.post(
      `/ManageCompetitionModelMoto/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetCompetitionModelData:", error);
    throw error;
  }
};
// ------------------------------Competition Model end ---------------------------------------------

//----------------------------- L1&L2 Issue start ---------------------------------------------

export const manageIssueCategory = async (params) => {
  try {
    const response = await api.post(
      `/manageIssueCategory/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in manageIssueCategory:", error);
    throw error;
  }
};
//----------------------------- Grn acknowledgement purchase start ---------------------------------------------

export const GetGrnList = async (params) => {
  try {
    const response = await api.post(
      `/GetAcknowledgeList/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetGrnList:", error);
    throw error;
  }
};
//----------------------------- Grn acknowledgement purchase end ---------------------------------------------

//----------------------------- Grn Accept Reject start ------------------------------------------------------

export const GetAcceptReject = async (params) => {
  try {
    const response = await api.post(`/GetAcceptReject/${getUserId()}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in GetAcceptReject:", error);

    throw error;
  }
};

export const manageIssueMaster = async (params) => {
  let authKey = localStorage.getItem("authKey");
  try {
    const response = await api.post(
      `/manageIssueMaster/${getUserId()}?AuthKey=${authKey}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in manageIssueMaster:", error);
    throw error;
  }
};

export const getIssueCategoryDropdown = async () => {
  try {
    const response = await api.get(`/getIssueCategoryDropdown/${getUserId()}`);
    return response.data;
  } catch (error) {
    console.error("Error in getIssueCategoryDropdown:", error);
    throw error;
  }
};

export const getIssueCategoryList = async (params) => {
  try {
    const response = await api.post(
      `/getIssueCategoryList/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in getIssueCategoryList:", error);
    throw error;
  }
};

export const GetIssueMasterList = async (params) => {
  try {
    const response = await api.post(
      `/GetIssueMasterList/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetIssueMasterList:", error);
    throw error;
  }
};

// export const getIssueCategoryList = async (params) => {
//   try {
//     const response = await api.post(`/getIssueCategoryList/${getUserId()}`, params);
//     return response.data;
//   } catch (error) {
//     console.error("Error in getIssueCategoryList:", error);
//     throw error;
//   }
// };

// export const GetIssueMasterList = async (params) => {
//   try {
//     const response = await api.post(`/GetIssueMasterList/${getUserId()}`, params);
//     return response.data;
//   } catch (error) {
//     console.error("Error in GetIssueMasterList:", error);
//     throw error;
//   }
// };

//----------------------------- L1&L2 Issue end ---------------------------------------------

//----------------------------- GRN accept purchase end ---------------------------------------------

//-------------------------------Get RIscoreWeightage -------------------------------//

export const GetRIScoreWeightageListMoto = async () => {
  try {
    const response = await api.get(
      `/GetRIScoreWeightageListMoto/${getUserId()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetRIScoreWeightageListMoto:", error);
    throw error;
  }
};

//----------------------------- Get Color List start ---------------------------------------------
export const GetColorList = async (params) => {
  try {
    const response = await api.post(`/GetColorList/${getUserId()}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in GetColorList:", error);
    throw error;
  }
};
//-----------------------------Stock report start-------------------------------------------//

export const GetStockReport = async (params) => {
  try {
    const response = await api.post(`/GetStockReportv2/${getUserId()}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in GetStockReportv:", error);

    throw error;
  }
};

export const ManageColorAPI = async (params) => {
  try {
    const response = await api.post(`/ManageColorAPI/${getUserId()}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in ManageColorAPI:", error);
    throw error;
  }
};
export const GetStockRetailerReportV2 = async (params) => {
  try {
    const response = await api.post(
      `/GetStockRetailerReportV2/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetStockRetailerReportV2:", error);

    throw error;
  }
};

//----------------------------- Get Color List end ---------------------------------------------

export const GetEntityData = async (params) => {
  try {
    // Constructing the URL based on userId and the entityTypeID
    const url = `/GetEntityWithEntityTypeID/${getUserId()}?entityTypeID=${
      params.entityTypeID
    }`;

    // Performing a GET request to the endpoint with query params
    const response = await api.get(url);

    // Return the data from the response
    return response.data;
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in GetEntityData:", error);

    // Rethrow the error to be handled by the caller
    throw error;
  }
};

//-----------------------------Stock report end-------------------------------------------//

export const GetClientAppRoleMenuMappingMoto = async (params) => {
  try {
    const response = await api.post(
      `/GetClientAppRoleMenuMappingMoto/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetClientAppRoleMenuMappingMoto:", error);
    throw error;
  }
};

export const ManageClientAppRoleMenuMappingMoto = async (body) => {
  try {
    const response = await api.post(
      `/ManageClientAppRoleMenuMappingMoto/${getUserId()}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error in ManageClientAppRoleMenuMappingMoto:", error);
    throw error;
  }
};
// ------------------------------APP menu end ---------------------------------------------

//-----------------------------Demo planogram start-------------------------------------------//

export const ManageStoreCategoryAPI = async (params) => {
  try {
    const response = await api.post(
      `/ManageStoreCategoryAPI/${getUserId()}`,
      params,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in ManageStoreCategoryAPI:", error);
    throw error;
  }
};

export const getStoreList = async (params) => {
  try {
    const response = await api.post(`/getStoreList/${getUserId()}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in getStoreList:", error);

    throw error;
  }
};

export const SaveRIScoreWeightageMoto = async (params) => {
  try {
    const response = await api.post(
      `/SaveRIScoreWeightageMoto/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in SaveRIScoreWeightageMoto:", error);
    throw error;
  }
};
//-----------------------------Demo planogram end-------------------------------------------//

//-----------------------------Banner start-------------------------------------------//

export const SaveImages = async (params) => {
  try {
    const response = await api.post(`/SaveImages/${getUserId()}/10`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in SaveImages:", error);
    throw error;
  }
};

export const SaveBannerCMS = async (params) => {
  try {
    const response = await api.post(`/SaveBannerCMS/${getUserId()}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in SaveBannerCMS:", error);
    throw error;
  }
};

export const GetBannerCMSDetailList = async (params) => {
  try {
    const response = await api.post(
      `/GetBannerCMSDetailList/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetBannerCMSDetailList:", error);
    throw error;
  }
};

export const UpdateStatusBannerCMS = async (params) => {
  try {
    const response = await api.post(
      `/UpdateStatusBannerCMS/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in UpdateStatusBannerCMS:", error);

    throw error;
  }
};

//-----------------------------Banner end-------------------------------------------//

//-----------------------------Business  start-------------------------------------------//

export const GetBusinessDashboard = async (params) => {
  try {
    const response = await api.post(
      `/GetBusinessDashboard/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetBusinessDashboard:", error);

    throw error;
  }
};
// ----------------------------- Get Dropdown Hierarchy List start ---------------------------------------------
export const GetDropdownHierarchyList = async (params) => {
  try {
    const response = await api.post(
      `/GetDropdownHierarchyList/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetDropdownHierarchyList:", error);

    throw error;
  }
};
// ----------------------------- Get Dropdown Hierarchy List end ---------------------------------------------

// ----------------------------- Target Dashboard start ---------------------------------------------

export const GetTargetDashboard = async (params) => {
  try {
    const response = await api.post(
      `/GetTargetDashboard/${getUserId()}`,

      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetBusinessDashboard:", error);
    throw error;
  }
};

export const GetFocusModelGroupDropDown = async (params) => {
  try {
    const response = await api.post(
      `/GetFocusModelGroupDropDown/${getUserId()}`,

      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetFocusModelGroupDropDown:", error);

    throw error;
  }
};

export const GetPriceBandDropDown = async (params) => {
  try {
    const response = await api.post(
      `/GetPriceBandDropDown/${getUserId()}`,

      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetPriceBandDropDown:", error);

    throw error;
  }
};

//-----------------------------Business  end-------------------------------------------//

//-----------------------------Demo planogram end-------------------------------------------//

//-----------------------------Demo bin conversion start-------------------------------------------//

export const GetDemoBinConversion = async (params) => {
  try {
    const response = await api.post(
      `/GetDemotoGoodPendinglist/${getUserId()}`,
      params
    );

    return response.data;
  } catch (error) {
    console.error("Error in getStoreList:", error);

    throw error;
  }
};

export const DemotoGoodApprovedReject = async (params) => {
  try {
    const response = await api.post(
      `/GetDemotoGoodApprovedReject/${getUserId()}`,
      params
    );

    return response.data;
  } catch (error) {
    console.error("Error in DemotoGoodApprovedReject:", error);

    throw error;
  }
};

//-----------------------------Demo bin conversion end-------------------------------------------//

//-----------------------------ChannelsDashBoard start-------------------------------------------//

export const GetChannelDashboard = async (params) => {
  try {
    const response = await api.post(
      `/GetChannelDashboard/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetChannelDashboard:", error);
    throw error;
  }
};

export const GetChannelDashboardListDropDown = async (params) => {
  try {
    const response = await api.post(
      `/GetChannelDashboardListDropDown/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetChannelDashboardListDropDown:", error);
    throw error;
  }
};

//-----------------------------ChannelsDashBoard end-------------------------------------------//

//-----------------------------Audit start-------------------------------------------//

export const GetAuditTypeDropdownList = async () => {
  try {
    const response = await api.get(`/GetAuditTypeDropdownList/${getUserId()}`);
    return response.data;
  } catch (error) {
    console.error("Error in GetAuditTypeDropdownList:", error);

    throw error;
  }
};

export const ManageAuditAPI = async (params) => {
  console.log("params", params);
  try {
    const response = await api.post(`/ManageAudit/${getUserId()}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in ManageAudit:", error);

    throw error;
  }
};

export const GetAuditMasterList = async (params) => {
  console.log("params", params);
  try {
    const response = await api.post(
      `/GetAuditMasterList/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetAuditMasterList:", error);
    throw error;
  }
};

//-----------------------------Business  end-------------------------------------------//

// ----------------------------- Target Dashboard end ---------------------------------------------

export const GetSkuPreBookingDetailList = async (params) => {
  try {
    const response = await api.post(
      `/GetSkuPreBookingDetailList/${getUserId()}`,
      params
    );

    return response.data;
  } catch (error) {
    console.error("Error in GetSkuPreBookingDetailList:", error);

    throw error;
  }
};

export const UpdStatusBrandAudit = async (params) => {
  console.log("params", params);
  try {
    const response = await api.post(
      `/UpdStatusBrandAudit/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in UpdStatusBrandAudit:", error);
    throw error;
  }
};

export const UpdateStatusSkuPreBooking = async (params) => {
  try {
    const response = await api.post(
      `/UpdateStatusSkuPreBooking/${getUserId()}`,

      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in UpdateStatusSkuPreBooking:", error);
    throw error;
  }
};

//-----------------------------Audit end-------------------------------------------//

//-----------------------------REL Stock Report start-------------------------------------------//

export const GetRelStoreStockReport = async (params) => {
  console.log("params", params);
  try {
    const response = await api.post(
      `/GetRelStoreStockReport/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetRelStoreStockReport:", error);
    throw error;
  }
};

export const GetRelEDIInetgrationStatusView = async (params) => {
  try {
    const response = await api.post(
      `/GetRelEDIInetgrationStatusView/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetRelEDIInetgrationStatusView:", error);
    throw error;
  }
};

export const GetRelianceStoreType = async () => {
  try {
    const response = await api.get(`/GetRelianceStoreType/${getUserId()}`);
    return response.data;
  } catch (error) {
    console.error("Error in GetRelianceStoreType:", error);

    throw error;
  }
};

export const GetAuditReport = async (params) => {
  try {
    const response = await api.post(`/MEZ_AuditReport/${getUserId()}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in GetAuditReport:", error);
    throw error;
  }
};
//-----------------------------REL Stock Report end-------------------------------------------//

//-----------------------------L1L2 Issue Report start-------------------------------------------//

export const GetL1L2IssueReport = async (params) => {
  try {
    const response = await api.post(
      `/GetL1L2IssueReport/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetL1L2IssueReport:", error);
    throw error;
  }
};

//-----------------------------L1L2 Issue Report end-------------------------------------------//

//-----------------------------Brand Dashboard start-------------------------------------------//

export const GetBrandDashboard = async (params) => {
  try {
    const response = await api.post(
      `/GetBrandDashboard/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetBrandDashboard:", error);
    throw error;
  }
};
// Isp Approval List API

//-----------------------------Brand Dashboard end-------------------------------------------//
export const GetIspApprovalList = async (params) => {
  try {
    const response = await api.post(
      `/GetIspApprovalList/${getUserId()}`,

      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetIspApprovalList:", error);
    throw error;
  }
};

export const SaveIspApprovalList = async (params) => {
  try {
    const response = await api.post(
      `/SaveIspApprovalList/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in SaveIspApprovalList:", error);
    throw error;
  }
};
// Isp Approval List API end

//-----------------------------Audit Report start-------------------------------------------//

export const GetISP_StoreOpsReport = async (params) => {
  try {
    const response = await api.post(
      `/GetISP_StoreOpsReport/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetISP_StoreOpsReport:", error);
    throw error;
  }
};

//-----------------------------Audit Report end-------------------------------------------//

//-----------------------------Demo Audit Report-------------------------------------------//

export const GetDemoAuditReport = async (params) => {
  try {
    const response = await api.post(
      `/DemoAuditReport/${getUserId()}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetDemoAuditReport:", error);
    throw error;
  }
};

