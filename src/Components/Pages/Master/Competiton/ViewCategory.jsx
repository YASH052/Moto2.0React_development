import { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { FormSkeleton } from "../../../Common/Skeletons";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";

import useHttp from "../../../../hooks.js/use-http";
import {
  DARK_BLUE,
  LIGHT_BLUE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
} from "../../../Common/colors";
import { competitionCategoryAPI } from "./api";

const ViewCategory = ({
  searchFormLoading,
  searchAccordionExpanded,
  handleSearchAccordionChange,
  handleSearchCancel,
  handleSearch,
  searchStatus,
  searchTitle,
  setSearchParams,
  searchParams,
  brand,
  brandCheckList,
  setBrandCheckList,
}) => {
  const API = useHttp();
  const API2 = useHttp();
  const [brandList, setBrandList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    API.sendRequest(
      competitionCategoryAPI.brand,
      (response) => {
        console.log("response", response);
        if (response.statusCode === "200") {
          const activeBrands = response.competitionBrandList || [];
          setBrandList(activeBrands);
          setBrandCheckList(activeBrands);
        } else {
          console.error(
            "Failed to fetch brand dropdown:",
            response.statusMessage
          );
          setBrandList([]);
          setBrandCheckList([]);
        }
      },
      {
        mode: 2,
        status: 0,
        pageIndex: 1,
        pageSize: 0,
        brandId: 0,
        brandName: "",
      },
      null,
      (error) => {
        console.error("Error fetching brand dropdown:", error);
        setBrandList([]);
        setBrandCheckList([]);
      }
    );
  }, []);
  useEffect(() => {
    API2.sendRequest(
      competitionCategoryAPI.category,
      (response) => {
        console.log("response", response);
        if (response.statusCode === "200") {
          const activeCategories = response.competitionCategoryDataList || [];
          setCategoryList(activeCategories);
        } else {
          console.error(
            "Failed to fetch category dropdown:",
            response.statusMessage
          );
          setCategoryList([]);
        }
      },
      {
        competitionBrandID: 0,
        competitionCategoryID: 0,
        callType: 2, //  2= bind dropdown
        pageIndex: 1, // 1= default
      },
      null,
      (error) => {
        console.error("Error fetching category dropdown:", error);
        setCategoryList([]);

      }
    );
  }, [searchParams.competitionBrandID]);

  return (
    <Grid item xs={12} pr={1.5}>
      <Grid container spacing={2} direction="column">
        <Grid item>
          {searchFormLoading ? (
            <FormSkeleton />
          ) : (
            <>
              <NuralAccordion2
                title="View Category"
                backgroundColor={LIGHT_GRAY2}
                expanded={searchAccordionExpanded}
                onChange={handleSearchAccordionChange}
                controlled={true}
              >
                <Grid container spacing={2} sx={{ width: "100%" }}>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: DARK_BLUE,
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        mb: 1,
                      }}
                    >
                      BRAND
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      placeholder="SELECT"
                      backgroundColor={LIGHT_BLUE}
                      options={brandList}
                      isOptionEqualToValue={(option, value) =>
                        option?.competitionBrandID === value?.competitionBrandID
                      }
                      getOptionLabel={(option) =>
                        option?.competitionBrandName || ""
                      }
                      onChange={(event, value) => {
                        setSearchParams({
                          ...searchParams,
                          competitionBrandID: value
                            ? value.competitionBrandID
                            : 0,
                        });
                      }}
                      value={
                        brandList.find(
                          (brand) =>
                            brand.competitionBrandID ===
                            searchParams.competitionBrandID
                        ) || null
                      }
                      loading={API.isLoading}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: DARK_BLUE,
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        mb: 1,
                      }}
                    >
                      CATEGORY NAME
                    </Typography>
                    {/*  {
            "sNo": 1,
            "competitionCategoryID": 19,
            "competitionCategoryName": "NuralBrandRPCategory1",
            "status": "1",
            "competitionBrandName": ""
        }, */}
                    <NuralAutocomplete
                      width="100%"
                      placeholder="SELECT"
                      backgroundColor={LIGHT_BLUE}
                      options={categoryList}
                      isOptionEqualToValue={(option, value) =>
                        option?.competitionCategoryID === value?.competitionCategoryID
                      }
                      getOptionLabel={(option) =>
                        option?.competitionCategoryName || ""
                      }
                      onChange={(event, value) => {
                        setSearchParams({
                          ...searchParams,
                          competitionCategoryID: value
                            ? value.competitionCategoryID
                            : 0,
                        });
                      }}
                      value={
                        categoryList.find(
                          (category) =>
                            category.competitionCategoryID ===
                            searchParams.competitionCategoryID
                        ) || null
                      }
                      loading={API2.isLoading}
                    />
                  </Grid>
                </Grid>

                {searchAccordionExpanded && (
                  <Grid container spacing={1} mt={1}>
                    <Grid item xs={6} sm={2} md={1.5}>
                      <NuralButton
                        text="CANCEL"
                        variant="outlined"
                        color={PRIMARY_BLUE2}
                        fontSize="12px"
                        height="36px"
                        borderColor={PRIMARY_BLUE2}
                        onClick={handleSearchCancel}
                        width="100%"
                      />
                    </Grid>
                    <Grid item xs={6} sm={10} md={10.5} pr={1.5}>
                      <NuralTextButton
                        icon={"./Icons/searchIcon.svg"}
                        iconPosition="right"
                        height="36px"
                        backgroundColor={PRIMARY_BLUE2}
                        color="#fff"
                        width="100%"
                        fontSize="12px"
                        onClick={handleSearch}
                      >
                        SEARCH
                      </NuralTextButton>
                    </Grid>
                  </Grid>
                )}
              </NuralAccordion2>
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ViewCategory;
