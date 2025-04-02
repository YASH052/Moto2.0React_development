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

// ----------------------------- View Sales Channel stock SB start ---------------------------------------------
export const fetchSalesChannelDropdown = async (body) => {
  try {
    const response = await api.post(
      `/GetSalesChannelTypedropdown/${userId}`,
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
      `/SalesChannelListWithRetailer/${userId}`,
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
    const response = await api.post(`/BindEntityList/${userId}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in BindEntityList:", error);
    throw error;
  }
};

export const GetStateListForDropdown = async (params) => {
  try {
    const response = await api.post(
      `/GetStateListForDropdown/${userId}`,
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
      `/GetCityListForDropdown/${userId}`,
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
      `/GetRetailerListDrpdown/${userId}`,
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
    const response = await api.post(`/getRetailerlistV2/${userId}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in getRetailer:", error);
    throw error;
  }
};

export const RetailerStatusUpdate = async (params) => {
  try {
    const response = await api.post(`/RetailerStatusUpdate/${userId}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in RetailerStatusUpdate:", error);
    throw error;
  }
};

// ----------------------------- view / search retailer end ---------------------------------------------

// ----------------------------- Price Master List V2 start ---------------------------------------------

export const GetPriceMasterListV2 = async (params) => {
  try {
    const response = await api.post(`/GetPriceMasterListV2/${userId}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in GetPriceMasterListV2:", error);
    throw error;
  }
};

export const Countrymasterlist = async (params) => {
  try {
    const response = await api.post(`/Countrymasterlist/${userId}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in Countrymasterlist:", error);
    throw error;
  }
};

export const GetPriceListName = async (params) => {
  try {
    const response = await api.post(`/GetPriceListName/${userId}`, params);
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
    const response = await api.post(`/GetSalesChannelType/${userId}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in GetSalesChannelType:", error);
    throw error;
  }
};

export const GetParentSalesChannel = async (params) => {
  try {
    const response = await api.post(`/GetParentSalesChannel/${userId}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in GetParentSalesChannel:", error);
    throw error;
  }
};

export const GetReportingHierarchyList = async (params) => {
  try {
    const response = await api.post(
      `/GetReportingHierarchyList/${userId}`,
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
      `/ManageSalesChannelMoto/${userId}`,
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
      `/getSalesChannelExcelReferenceDataLink/${userId}`,
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
      `/UpdateSalesChannelStatus/${userId}`,
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
      `/UploadSalesChannelMasterMoto/${userId}`,
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
      `/UploadRetailerMaster/${userId}?salesChannelID=0&password=''&passwordSalt=''`,
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
    const response = await api.post(`/StockBinTypeMaster/${userId}`, body);
    return response.data;
  } catch (error) {
    console.error("Error in fetchBinType:", error);
    throw error;
  }
};

export const fetchModelDropdown = async (body) => {
  try {
    const response = await api.post(`/GetModelListForDropdown/${userId}`, body);
    return response.data;
  } catch (error) {
    console.error("Error in fetchModelDropdown:", error);
    throw error;
  }
};

export const fetchSKUList = async (body) => {
  try {
    const response = await api.post(`/GetSKUListForDropdown/${userId}`, body);
    return response.data;
  } catch (error) {
    console.error("Error in fetchSKUList:", error);
    throw error;
  }
};

export const fetchSalesChannelStockSB = async (body) => {
  try {
    const response = await api.post(`/Saleschannelstockreport/${userId}`, body);
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
      `/InterfaceGetProcessMaster/${userId}`,
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
    const response = await api.post(`/InterfaceGetFileDetail/${userId}`, body);
    return response.data;
  } catch (error) {
    console.error("Error in fetchSAPList:", error);
    throw error;
  }
};

export const uploadRedigntionFile = async (body) => {
  try {
    const response = await api.post(`/InterfaceUploadFile/${userId}`, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in uploadRedigntionFile:", error);
    throw error;
  }
};

export const UploadRedigntionFile = async (form) => {
  try {
    const response = await api.post(`/UploadSapFile/${userId}`, form, {
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
    const response = await api.get(`/ISPForBindDropDown/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error in fetchISPLIst:", error);
    throw error;
  }
};

export const fetchCounterShareReport = async (body) => {
  try {
    const response = await api.post(`/CounterShareReport/${userId}`, body);
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
      `/StockBinTypeReferenceDatalinkAPI/${userId}`,
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
      `/StockAdjustmentReferenceDatalinkAPI/${userId}`,
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
      `/StockAdjustmentUploadAPIForMoto/${userId}`,
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
    const response = await api.post(`/GetSalesChannelType/${userId}`, body);
    return response.data;
  } catch (error) {
    console.error("Error in fetchChannelName:", error);
    throw error;
  }
};

export const fetchReason = async (body) => {
  try {
    const response = await api.post(`/GetReasonMasterListAPI/${userId}`, body);
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
    const response = await api.post(`/GetBrandListDrpdown/${userId}`, body);
    return response.data;
  } catch (error) {
    console.error("Error in fetchBrandList:", error);
    throw error;
  }
};

export const fetchCategoryList = async (body) => {
  try {
    const response = await api.post(
      `/GetProductCategoryListDropdown/${userId}`,
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
    const response = await api.post(`/GetCategoryListDropdown/${userId}`, body);
    return response.data;
  } catch (error) {
    console.error("Error in fetchSubCategoryList:", error);
    throw error;
  }
};

export const manageModel = async (body) => {
  try {
    const response = await api.post(`/ManageModelAPIForMoto/${userId}`, body);
    return response.data;
  } catch (error) {
    console.error("Error in manageModel:", error);
    throw error;
  }
};

export const fetchModelList = async (body) => {
  try {
    const response = await api.post(`/GetModelListforMoto/${userId}`, body);
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
      `/ViewSerialNumberForFinanceUnblock/${userId}`,
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
    const response = await api.get(`/GetRankingWeightageListMoto/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error in fetchRankingWeightage:", error);
    throw error;
  }
};

export const manageRankingWeightage = async (body) => {
  try {
    const response = await api.post(
      `/SaveRankingWeightageMoto/${userId}`,
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
      `/UploadIntermediarySales/${userId}`,
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
      `/GetSalesChannelMasterList/${userId}`,
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
    const response = await api.post(`/GetISPSaleReport/${userId}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in GetISPSaleReport:", error);
    throw error;
  }
};
export const GetSalesChannelListForDropdown = async (body) => {
  try {
    const response = await api.post(
      `/GetSalesChannelListForDropdown/${userId}`,
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
    const response = await api.post(`/GetTargetInfoV2/${userId}`, params);
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
    const response = await api.post(`/GetTargetForDropdown/${userId}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in GetTargetForDropdown:", error);
    throw error;
  }
};

export const GetTargetNameList = async (params) => {
  try {
    const response = await api.post(`/GetTargetNameList/${userId}`, params);
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
      `/UploadPrimarySalesReturn/${userId}?templateType=${selectedUserId}&date=${formattedDate}`,
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
      `/getReportingHierarchyName/${userId}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error in getReportingHierarchyName:", error);

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
      `/UploadSecondarySalesReturn/${userId}?templateType=${selectedUserId}&date=${formattedDate}`,
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
      `/UploadIntermediarySalesReturn/${userId}?templateType=${selectedUserId}&date=${formattedDate}`,
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
    const response = await api.post(`/getRetailerlist/${userId}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in getRetailerlist:", error);
    throw error;
  }
};

export const SCRCategoryList = async (params) => {
  try {
    const response = await api.post(`/SCRCategoryList/${userId}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in SCRCategoryList:", error);
    throw error;
  }
};

export const getSalesmaninfo = async (params) => {
  try {
    const response = await api.post(`/getSalesmaninfo/${userId}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in getSalesmaninfo:", error);
    throw error;
  }
};

export const AddRetailerForMoto = async (params) => {
  try {
    const response = await api.post(`/AddRetailerForMoto/${userId}`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
    const response = await api.post(`/GetColorDropdownList/${userId}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in GetColorDropdownList:", error);
    throw error;
  }
};

export const GetSKUListForMoto = async (params) => {
  try {
    const response = await api.post(`/GetSKUListForMoto/${userId}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in GetSKUListForMoto:", error);
    throw error;
  }
};

export const ManageSkuForMoto = async (body) => {
  try {
    const response = await api.post(`/ManageSkuForMoto/${userId}`, body);
    return response.data;
  } catch (error) {
    console.error("Error in ManageSkuForMoto:", error);
    throw error;
  }
};

export const GetHSNMasterListForDropdown = async (params) => {
  try {
    const response = await api.post(
      `/GetHSNMasterListForDropdown/${userId}`,
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
    const response = await api.post(`/ManageISPAgencyMaster/${userId}`, body);
    return response.data;
  } catch (error) {
    console.error("Error in ManageISPAgencyMaster:", error);
    throw error;
  }
};

export const GetISPAgencyList = async (body) => {
  try {
    const response = await api.post(`/GetISPAgencyList/${userId}`, body);
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
    const response = await api.post(`/ManagePricebandmaster/${userId}`, body);
    return response.data;
  } catch (error) {
    console.error("Error in ManagePricebandmaster:", error);
    throw error;
  }
};

export const GetPriceBandMasterList = async (body) => {
  try {
    const response = await api.post(`/GetPricebandmasterlist/${userId}`, body);
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
    const response = await api.post(`/viewLeaveReport/${userId}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in viewLeaveReport:", error);
    throw error;
  }
};

// export const GetUserListBasedOnRoleID = async(params)=>{
//   try {
//     const response = await api.post(`/GetUserListBasedOnRoleID/${userId}`, params);
//     return response.data;
//   } catch (error) {
//     console.error("Error in GetUserListBasedOnRoleID:", error);
//     throw error;
//   }
// }

// export const GetRoleList = async(params)=>{
//   try {
//     const response = await api.post(`/GetRoleList/${userId}`, params);
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
//     const response = await api.post(`/GetRegionListDropdown/${userId}`, params);
//     return response.data;
//   } catch (error) {
//     console.error("Error in GetRegionListDropdown:", error);
//     throw error;
//   }
// }


export const GetStateListForMoto = async(params)=>{
  try {
    const response = await api.post(`/GetStateListForMoto/${userId}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in GetStateListForMoto:", error);
    throw error;
  }
}
export const ManageStateAPIForMoto = async(body)=>{
  try {
    const response = await api.post(`/ManageStateAPIForMoto/${userId}`, body);
    return response.data;
  } catch (error) {
    console.error("Error in ManageStateAPIForMoto:", error);
    throw error;
  }
}
// ----------------------------- State end ---------------------------------------------

// ----------------------------- City start ---------------------------------------------
export const getCityMasterlist = async(params)=>{
  try {
    const response = await api.post(`/getCityMasterlist/${userId}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in getCityMasterlist:", error);
    throw error;
  }
}

export const manageCityMaster = async(body)=>{
  try {
    const response = await api.post(`/manageCityMaster/${userId}`, body);
    return response.data;
  } catch (error) {
    console.error("Error in manageCityMaster:", error);
    throw error;
  }
}
// ----------------------------- City end ---------------------------------------------

// ----------------------------- Brand start ---------------------------------------------


export const getbrandlist = async(body)=>{
  try {
    const response = await api.post(`/getbrandlist/${userId}`, body);
    return response.data;
  } catch (error) {
    console.error("Error in getbrandlist:", error);
    throw error;
  }
}

export const managebrandMaster = async(body)=>{
  try {
    const response = await api.post(`/managebrandMaster/${userId}`, body);
    return response.data;
  } catch (error) {
    console.error("Error in managebrandMaster:", error);
    throw error;
  }
}


// ----------------------------- Brand end ---------------------------------------------

// ----------------------------- sub-Category start ---------------------------------------------

export const ManageSubCategoryMaster = async(body)=>{
  try {
    const response = await api.post(`/ManageSubCategoryMaster/${userId}`, body);
    return response.data;
  } catch (error) {
    console.error("Error in ManageSubCategoryMaster:", error);
    throw error;
  }
}

export const GetSubCategoryList = async(body)=>{
  try {
    const response = await api.post(`/GetSubCategoryList/${userId}`, body);
    return response.data;
  } catch (error) {
    console.error("Error in GetSubCategoryList:", error);
    throw error;
  }
}

// ----------------------------- sub-Category end ---------------------------------------------

// ----------------------------- Leave Allocation start ---------------------------------------------
export const GetLeaveTypeDropdownList = async () => {
  try {
    const response = await api.get(`/GetLeaveTypeDropdownList/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error in GetLeaveTypeDropdownList:", error);
    throw error;
  }
};

export const SaveLeaveAllocation = async (params) => {
  try {
    const response = await api.post(`/SaveLeaveAllocation/${userId}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in SaveLeaveAllocation:", error);
    throw error;
  }
};

export const GetAllotedLeaveList = async (params) => {
  try {
    const response = await api.post(`/GetAllotedLeaveList/${userId}`, params);
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
    const response = await api.post(`/GetRegionListDropdown/${userId}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in GetRegionListDropdown:", error);
    throw error;
  }
};

export const GetTargetReferenceCode = async (params) => {
  try {
    const response = await api.post(
      `/GetTargetReferenceCode/${userId}`,
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
    const url = `/UploadTargetV2/${userId}?targetName=${targetName}&regionID=${regionID}&stateID=${stateID}&cityID=${cityID}&targetType=${targetType}&targetBasedOn=${targetBasedOn}&targetUserTypeID=${targetUserTypeID}&targetCategory=${targetCategory}&targetFrom=${targetFrom}&targetTo=${targetTo}`;

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
    const response = await api.post(`/GetUserLaggardReport/${userId}`, params);
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
    const url = `/UploadPriceMaster/${userId}?priceListID=${priceListID}&effectiveDate=${effectiveDate}&status=${status}&mapWithAllState=${mapWithAllState}`;

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
    const response = await api.get(`/GetPriceListAPI/${userId}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in GetPriceListDataWithMappingAPI:", error);
    throw error;
  }
};

export const GetPriceListDataWithMappingAPI = async (params) => {
  try {
    const response = await api.post(
      `/GetPriceListDataWithMappingAPI/${userId}`,
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
    const response = await api.post(`/GetCategoryList/${userId}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in GetCategoryList:", error);
    throw error;
  }
};


export const ManageProductCategory = async(body)=>{
  try {
    const response = await api.post(`/ManageProductCategory/${userId}`, body);
    return response.data;
  } catch (error) {
    console.error("Error in ManageProductCategory:", error);
    throw error;
  }
}
// ----------------------------- Category end ---------------------------------------------
// ----------------------------- ISP start ---------------------------------------------

export const GetISPParentHierarchyList = async () => {
  try {
    const response = await api.get(`/GetISPParentHierarchyList/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error in GetISPParentHierarchyList:", error);
    throw error;
  }
}


export const  GetAgencyListDropdown = async () => {
  try {
    const response = await api.get(`/GetAgencyListDropdown/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error in GetAgencyListDropdown:", error);
    throw error;
  }
}

export const getISPRetailerReferenceDataLink = async (params) => {
  try {
    const response = await api.post(`/getISPRetailerReferenceDataLink/${userId}`, params);
    return response.data;
  } catch (error) {
    console.error("Error in getISPRetailerReferenceDataLink:", error);
    throw error;
  }
}

export const SaveUpdateISPData = async (body) => {
  try {
    const response = await api.post(`/SaveUpdateISPData/${userId}`, body);
    return response.data;
  } catch (error) {
    console.error("Error in SaveUpdateISPData:", error);
    throw error;
  }
}
// ----------------------------- Product end ---------------------------------------------

export const ManagePriceListWithMappingAPI = async (params) => {
  try {
    const response = await api.post(
      `/ManagePriceListWithMappingAPI/${userId}`,
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

export const LocationMasterUploadRefCode = async (  ) => {
  try {
    const response = await api.get(`/LocationMasterUploadRefCode/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error in LocationMasterUploadRefCode:", error);
    throw error;
  }
}

export const BulkLocationUploadAPIV2 = async (form) => {
  try {
    const response = await api.post(`/BulkLocationUploadAPIV2/${userId}`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in BulkLocationUploadAPIV2:", error);
    throw error;
  }
}
// ----------------------------- Gregraphy single upload end ---------------------------------------------
 

