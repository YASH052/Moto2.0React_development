import { APIConstant } from "../../../../utils/constant";

export const competitionCategoryAPI = {
  brand: {
    type: APIConstant.post,
    endpoint: `/GetCompetitionBrand/${APIConstant.userId}`,
  },
  category: {
    type: APIConstant.post,
    endpoint: `/GetCompetitionCategoryListMoto/${APIConstant.userId}`,
  },
};

export const attendanceDashboardAPI = {
  dropdown: {
    type: APIConstant.post,
    endpoint: `/GetDashboardDropdown/${APIConstant.userId}`,
  },
  ISPDashboard: {
    type: APIConstant.post,
    endpoint: `/GetISPAttandanceDashboard/${APIConstant.userId}`,
  },
  ISPAttendanceTypeWise: {
    type: APIConstant.post,
    endpoint: `/GetISPAttandanceTypeWise/${APIConstant.userId}`,
  },
  exportExcel: {
    type: APIConstant.post,
    endpoint: `/GetISPAttandanceDashboardExportToExcel/${APIConstant.userId}`,
  },
};

export const UserMasterAPI = {
  hierarchyDropdown: {
    type: APIConstant.post,
    endpoint: `/getHierarchyLevel/${APIConstant.userId}`,
  },

  reportingHierarchyDropdown: {
    type: APIConstant.post,
    endpoint: `/GetParentHierarchy/${APIConstant.userId}`,
  },

  countryDropdown: {
    type: APIConstant.post,
    endpoint: `/Countrymasterlist/${APIConstant.userId}`,
  },

  stateDropdown: {
    type: APIConstant.post,
    endpoint: `/GetStateListForDropdown/${APIConstant.userId}`,
  },

  regionDropdown: {
    type: APIConstant.post,
    endpoint: `/GetRegionListDropdown/${APIConstant.userId}`,
  },

  cityDropdown: {
    type: APIConstant.post,
    endpoint: `/GetCityListForDropdown/${APIConstant.userId}`,
  },

  saveUpdateOrgHierarchy: {
    type: APIConstant.post,
    endpoint: `/SaveUpdateOrgnHierarchyForMoto/${APIConstant.userId}`,
  },

  getOrgHierarchy: {
    type: APIConstant.post,
    endpoint: `/GetOrgnHierarchyData/${APIConstant.userId}`,
  },

  updateStatus: {
    type: APIConstant.post,
    endpoint: `/UpdateStatusOrgnHierarchy/${APIConstant.userId}`,
  },

  locationDropdown: {
    type: APIConstant.post,
    endpoint: `/GetLocationListDropdown/${APIConstant.userId}`,
  },

  getOrgHierarchyList: {
    type: APIConstant.post,
    endpoint: `/GetLocationList/${APIConstant.userId}`,
  },

  roleDropdown: {
    type: APIConstant.get,
    endpoint: `/GetRoleList/${APIConstant.userId}`,
  },

  locationCheckList: {
    type: APIConstant.post,
    endpoint: `/GetLocationByRoleId/${APIConstant.userId}`,
  },

  saveUpdateUser: {
    type: APIConstant.post,
    endpoint: `/InsUpdateUserData/${APIConstant.userId}`,
  },

  getUserList: {
    type: APIConstant.post,
    endpoint: `/GetUserDetailList/${APIConstant.userId}`,
  },

  getLocationList: {
    type: APIConstant.post,
    endpoint: `/GetLocationList/${APIConstant.userId}`,
  },
  getUserRoleList: {
    type: APIConstant.post,
    endpoint: `/GetUserListBasedOnRoleID/${APIConstant.userId}`,
  },
};
