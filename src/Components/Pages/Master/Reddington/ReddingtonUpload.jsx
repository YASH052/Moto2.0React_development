// import { Divider, Grid, Stack, Typography, Skeleton } from "@mui/material";
// import React, { useRef, useState } from "react";
// import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
// import {
//   AQUA,
//   DARK_PURPLE,
//   LIGHT_GRAY2,
//   MEDIUM_BLUE,
//   PRIMARY_BLUE2,
// } from "../../../Common/colors";
// import NuralFileUpload from "../../NuralCustomComponents/NuralFileUpload";
// import NuralAccordion from "../../NuralCustomComponents/NuralAccordion";
// import NuralButton from "../../NuralCustomComponents/NuralButton";
// import { useNavigate } from "react-router-dom";
// import {
//   BulkUploadTSMRetailerAPI,
//   TSMRetailerMappingUploadRefCode,
// } from "../../../Api/Api";
// import StatusModel from "../../../Common/StatusModel";

// const ReddingtonBulkUpload = () => {
//   const navigate = useNavigate();
//   const [status, setStatus] = React.useState(null);
//   const [title, setTitle] = React.useState("");
//   const [isLoading, setIsLoading] = React.useState(false);
//   const fileInputRef = useRef(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [fileError, setFileError] = useState(null);

//   const handleDownloadRefCode = async () => {
//     try {
//       setIsLoading(true);
//       const response = await TSMRetailerMappingUploadRefCode();
//       if (response.statusCode === "200") {
//         window.location.href = response?.referenceDataLink;
//         setStatus(response?.statusCode);
//         setTitle(response?.statusMessage);
//         setTimeout(() => {
//           if (response.statusCode === "200") {
//             setStatus(null);
//             setTitle("");
//           }
//         }, 5000);
//       } else {
//         setStatus(response?.statusCode);
//         setTitle(response?.statusMessage);
//       }
//       console.log("Template Downloaded:", response);
//     } catch (error) {
//       console.error("Error in handleDownloadRefCode:", error);
//       setStatus(500);
//       setTitle("Internal Server Error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDownloadTemplate = async () => {
//     try {
//       setIsLoading(true);
//       window.location.href = `${
//         import.meta.env.VITE_TEMPLATE_URL
//       }TSMRetailerMapping.xlsx`;
//       setStatus(200);
//       setTitle("Template Downloaded Successfully");
//       setTimeout(() => {
//         setStatus(null);
//         setTitle("");
//       }, 5000);
//     } catch (error) {
//       console.error("Error in handleDownloadTemplate:", error);
//       setStatus(500);
//       setTitle("Internal SServer Error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const validateFileType = (file) => {
//     const validTypes = [
//       "application/vnd.ms-excel",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       "text/csv",
//     ];

//     if (!validTypes.includes(file.type)) {
//       return "Please upload a valid Excel (.xlsx, .xls) or CSV file";
//     }
//     return null;
//   };

//   const validateFileName = (file) => {
//     const validExtensions = [".xlsx", ".xls", ".csv"];
//     const fileExtension = "." + file.name.split(".").pop().toLowerCase();

//     if (!validExtensions.includes(fileExtension)) {
//       return "File must have .xlsx, .xls, or .csv extension";
//     }
//     return null;
//   };

//   const handleFileChange = (file) => {
//     setFileError(null);
//     setStatus(null);
//     setTitle("");

//     if (!file) {
//       setSelectedFile(null);
//       return;
//     }

//     // Validate file type
//     const typeError = validateFileType(file);
//     if (typeError) {
//       setFileError(typeError);
//       setSelectedFile(null);
//       return;
//     }

//     // Validate file name
//     const nameError = validateFileName(file);
//     if (nameError) {
//       setFileError(nameError);
//       setSelectedFile(null);
//       return;
//     }

//     setSelectedFile(file);
//   };

//   const handleCancel = () => {
//     setIsLoading(true);
//     setStatus(null);
//     setTitle("");
//     setSelectedFile(null);
//     setFileError(null);

//     // Reset the file input element
//     if (fileInputRef && fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }

//     // Show skeleton for a brief moment
//     setTimeout(() => {
//       setIsLoading(false);
//     }, 1000);
//   };

//   const uploadReddingtonMapping = async () => {
//     if (!selectedFile) {
//       setStatus(400);
//       setTitle("Please select a file to upload");
//       return;
//     }

//     const form = new FormData();
//     form.append("UploadedFile", selectedFile);
//     console.log(form);
//     try {
//       setIsLoading(true);
//       const response = await BulkUploadTSMRetailerAPI(form);
//       if (response.statusCode == 200) {
//         setStatus(response?.statusCode);
//         setTitle(response?.statusMessage);
//         setSelectedFile(null);
//         setTimeout(() => {
//           if (response.statusCode == 200) {
//             setStatus(null);
//             setTitle("");
//           }
//         }, 5000);
//       } else if (response.statusCode == 400) {
//         if (response?.invalidDataLink) {
//           window.location.href = response?.invalidDataLink;
//         }
//         setStatus(response?.statusCode);
//         setTitle(response?.statusMessage);
//       } else {
//         setStatus(response?.statusCode);
//         setTitle(response?.statusMessage);
//       }
//     } catch (error) {
//       console.error("Error in uploadReddingtonMapping:", error);
//       setStatus(500);
//       setTitle("Internal Server Error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const templates = [
//     {
//       name: "Template 1",
//       onView: () => console.log("View Template 1"),
//       onDownload: handleDownloadTemplate,
//     },
//   ];

//   const renderSkeleton = () => (
//     <Grid container spacing={2}>
//       <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
//         <Grid container spacing={2} direction="column">
//           <Grid item>
//             <Skeleton variant="rectangular" height={200} />
//           </Grid>
//           <Grid item>
//             <Skeleton variant="rectangular" height={150} />
//           </Grid>
//         </Grid>
//       </Grid>
//       <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
//         <Grid container spacing={2} direction="column">
//           <Grid item>
//             <Skeleton variant="rectangular" height={150} />
//           </Grid>
//           <Grid item>
//             <Skeleton variant="rectangular" height={100} />
//           </Grid>
//           <Grid item>
//             <Grid container spacing={1}>
//               <Grid item xs={6}>
//                 <Skeleton variant="rectangular" height={40} />
//               </Grid>
//               <Grid item xs={6}>
//                 <Skeleton variant="rectangular" height={40} />
//               </Grid>
//             </Grid>
//           </Grid>
//         </Grid>
//       </Grid>
//     </Grid>
//   );

//   return (
//     <Grid container spacing={0}>
//       <Grid
//         item
//         xs={12}
//         md={6}
//         lg={12}
//         mt={3}
//         mb={0}
//         sx={{
//           position: "sticky",
//           top: 0,
//           zIndex: 1000,
//           backgroundColor: "#fff",
//           paddingBottom: 1,
//         }}
//       >
//         <BreadcrumbsHeader pageTitle="Reddington TSM Retailer Mapping" />
//       </Grid>

//       <Grid container spacing={0} lg={12} mt={2}>
//         {isLoading ? (
//           renderSkeleton()
//         ) : (
//           <>
//             <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
//               <Grid container spacing={2} direction="column">
//                 <Grid item>
//                   <NuralAccordion
//                     titleColor={DARK_PURPLE}
//                     buttonColor={PRIMARY_BLUE2}
//                     buttonBg={MEDIUM_BLUE}
//                     backgroundColor={LIGHT_GRAY2}
//                     width="100%"
//                     referenceIcon2={"./Icons/downloadIcon.svg"}
//                     title="Templates"
//                     templates={templates}
//                     buttons={true}
//                     eye={false}
//                     onClickReference={() => handleDownloadRefCode()}
//                   />
//                 </Grid>
//               </Grid>
//             </Grid>

//             <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
//               <Grid container spacing={2} direction="column">
//                 <Grid item>
//                   <NuralFileUpload
//                     backgroundColor={LIGHT_GRAY2}
//                     fileRef={fileInputRef}
//                     onChange={handleFileChange}
//                     accept=".xlsx,.xls,.csv"
//                     mandatory={true}
//                   />
//                 </Grid>
//                 <Grid item>
//                   {fileError && (
//                     <Typography
//                       color="error"
//                       variant="body2"
//                       sx={{ mt: 1, mb: 1 }}
//                     >
//                       {fileError}
//                     </Typography>
//                   )}
//                   {status && (
//                     <StatusModel
//                       width="98%"
//                       status={status || ""}
//                       title={title || ""}
//                       onClose={() => setStatus(null)}
//                     />
//                   )}
//                 </Grid>
//                 <Grid item mt={-1}>
//                   <Grid container spacing={1}>
//                     <Grid item xs={12} md={6} lg={6}>
//                       <NuralButton
//                         text="CANCEL"
//                         variant="outlined"
//                         borderColor={PRIMARY_BLUE2}
//                         onClick={handleCancel}
//                         width="100%"
//                       />
//                     </Grid>
//                     <Grid item xs={12} md={6} lg={6}>
//                       <NuralButton
//                         text="PROCEED"
//                         backgroundColor={AQUA}
//                         variant="contained"
//                         onClick={uploadReddingtonMapping}
//                         width="100%"
//                       />
//                     </Grid>
//                   </Grid>
//                 </Grid>
//               </Grid>
//             </Grid>
//           </>
//         )}
//       </Grid>
//     </Grid>
//   );
// };

// export default ReddingtonBulkUpload;

import { Grid } from "@mui/material";
import React from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE2,
} from "../../../Common/colors";
import NuralFileUpload from "../../NuralCustomComponents/NuralFileUpload";
import NuralAccordion from "../../NuralCustomComponents/NuralAccordion";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import {
  BulkUploadTSMRetailerAPI,
  TSMRetailerMappingUploadRefCode,
} from "../../../Api/Api";
import StatusModel from "../../../Common/StatusModel";
import { MenuConstants } from "../../../Common/MenuConstants";
import { UploadContentSkeleton } from "../../../Common/SkeletonComponents";
import { templateUrl } from "../../../Common/urls";

const ReddingtonUpload = () => {
  const [status, setStatus] = React.useState(null);
  const [title, setTitle] = React.useState(null);
  const fileInputRef = React.useRef(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [fileKey, setFileKey] = React.useState(0);
  // const [isReferenceLoading, setIsReferenceLoading] = React.useState(false);
  const templates = [
    {
      name: "Reddinton template download",
      onView: () => console.log("View Template 1"),
      onDownload: () => {
        setIsLoading(true);
        setTimeout(() => {
          window.location.href = `${templateUrl}TSMRetailerMapping.xlsx`;
          setStatus(200)
          setTitle("Template download successfully");


          setIsLoading(false);
        }, 1000);
        setTimeout
      },
    },
  ];

  const handleReferenceClick = async () => {
    setIsLoading(true);

    try {
      let res = await TSMRetailerMappingUploadRefCode();
      if (res.statusCode == 200) {
        window.location.href = res.referenceDataLink;
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
        setTimeout(() => {
          setStatus(null);
          setTitle(null);
        }, 3000);
      } else {
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      }
    } catch (error) {
      setStatus(error.status || 500);
      setTitle(error.statusMessage || "Something went wrong");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadClick = async () => {
    const fileInput = fileInputRef.current;

    if (!fileInput?.files?.[0]) {
      setStatus(String(400));
      setTitle("Please select a file to upload");
      return;
    }

    setIsLoading(true);
    setIsUploading(true);
    const formData = new FormData();
    formData.append("UploadedFile", fileInput.files[0]);
    // console.log("loading the data");
      try {
      let res = await BulkUploadTSMRetailerAPI(formData);
    
      if (res.statusCode == 200) {
        fileInput.value = "";
        setStatus(String(res.statusCode));
        setTitle(res.statusMessage);
        setTimeout(() => {
          setStatus(null);
          setTitle(null);
        }, 3000);
      } else if (res.statusCode == 400 && res.invalidDataLink) {
        setStatus(String(res.statusCode));
        setTitle(res.statusMessage);
        window.location.href = res.invalidDataLink;
      } else {
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      }
    } catch (error) {
      setStatus(String(error.status));
      setTitle(MenuConstants.somethingWentWrong);
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  const handleClearStatus = () => {
    setStatus(null);
    setTitle(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setFileKey(prev => prev + 1);
    
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // if (isLoading) {
  //   return <UploadContentSkeleton />;
  // }

  return (
    <Grid container spacing={0}>
      <Grid
        item
        xs={12}
        md={6}
        lg={12}
        mt={1}
        mb={0}
        sx={{
          position: "sticky",
          top: 0,
          ml: 1,
        }}
      >
        <BreadcrumbsHeader pageTitle="Reddington TSM Retailer" />
      </Grid>

      {isLoading ? (
        <UploadContentSkeleton />
      ) : (
        <Grid container spacing={0} lg={12} mt={1}>
          <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralAccordion
                  titleColor={DARK_PURPLE}
                  buttonColor={PRIMARY_BLUE2}
                  buttonBg={MEDIUM_BLUE}
                  backgroundColor={LIGHT_GRAY2}
                  width="100%"
                  onClickReference={handleReferenceClick}
                  referenceIcon2={"./Icons/downloadIcon.svg"}
                  title="Templates"
                  templates={templates}
                  buttons={true}
                  eye={false}
                  isReferenceLoading={isLoading}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralFileUpload
                  key={fileKey}
                  backgroundColor={LIGHT_GRAY2}
                  fileRef={fileInputRef}
                  accept=".xlsx,.xls,.csv"
                />
              </Grid>
              <Grid item md={6} lg={6} pr={2}>
                {status && title && (
                  <StatusModel
                    width="100%"
                    status={status}
                    title={title}
                    onClose={handleClearStatus}
                  />
                )}
              </Grid>
              <Grid item>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={6} lg={6}>
                    <NuralButton
                      text="CANCEL"
                      variant="outlined"
                      borderColor={PRIMARY_BLUE2}
                      onClick={handleClearStatus}
                      width="100%"
                      disabled={isUploading}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
                    <NuralButton
                      text={isUploading ? "UPLOADING..." : "PROCEED"}
                      backgroundColor={AQUA}
                      variant="contained"
                      onClick={handleUploadClick}
                      width="100%"
                      disabled={isUploading}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default ReddingtonUpload;
