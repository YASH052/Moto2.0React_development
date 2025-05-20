import { useState, useCallback } from "react";
import axios from "axios";
// import { notification } from "antd";
import Services from "../utils/api/service";
// import { deleteAuthDetails } from "../utils/api/authStorage";

export const buildQueryString = (params) => {
  const queryParts = [];

  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const value = params[key];

      if (key.startsWith("autogenerate-mul-array-") && Array.isArray(value)) {
        const arrayKey = key.slice("autogenerate-mul-array-".length);
        value.forEach((item) => {
          queryParts.push(
            `${arrayKey}=${item}`
            // `${encodeURIComponent(arrayKey)}=${encodeURIComponent(item)}`
          );
        });
      } else {
        // Handle other cases
        queryParts.push(
          `${key}=${value}`
          // `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        );
      }
    }
  }

  return queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
};

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendRequest = useCallback(
    async (url, responseHandler, payload, successMessage, errorHandler) => {
      setIsLoading(true);
      try {
        let response;
        console.log("URL being called:", url.endpoint);
        console.log("Payload sent to server:", payload);
        switch (url.type) {
          case "POST":
            response = await Services.post(url.endpoint, payload);
            break;

          case "PUT":
            response = await Services.put(url.endpoint, payload);
            break;
          case "DELETE":
            response = await Services.delete(url.endpoint);
            break;

          case "PATCH":
            response = await Services.patch(url.endpoint, payload);
            break;

          default:
            const queryParams = buildQueryString(payload);
            response = await Services.get(`${url.endpoint}${queryParams}`);
            break;
        }

        const data = await response?.data;
        if (successMessage) {
          // notification.success({ message: successMessage, duration: "3" });
        }
        try {
          if (responseHandler) {
            responseHandler(data);
          }
        } catch (e) {
          console.log("inside reponsehandler", e);
        }
      } catch (err) {
        // console.log(err?.response);
        // if (err?.response?.data?.status === 401 && err?.response?.data?.message === "Your account is blocked") {
        //   window.location.replace('/blockuser');
        // } else
        console.error("Error caught in catch block:", err.response);

        if (err?.response) {
          console.log("Error response data:", err.response.data); // Logs server error details
          console.log("Error response status:", err.response.status); // Logs error status (422, etc.)
          console.log("Error response headers:", err.response.headers); // Logs headers for extra debugging
        }

        if (
          err?.response?.data?.status === 401 &&
          err?.response?.data?.message === "Your account is suspended"
        ) {
          window.location.replace("/suspendeduser");
        }
        if (
          err?.response?.status === 401 &&
          err?.response?.data?.status === "Permission Denied"
        ) {
          window.location.assign("/blockuser");
        }
        // else if () {

        // } else
        // if (err?.response?.data?.status === 401) {
        //   deleteAuthDetails();
        //   localStorage.removeItem("token");
        //   window.location.assign('/');
        // }
        if (
          err?.response?.data?.message === "jwt expired" ||
          err?.response?.data?.message === "You are not authorize person"
        ) {
        //   deleteAuthDetails();
          localStorage.removeItem("name");
          localStorage.removeItem("email");
          localStorage.removeItem("token");
          window.location.reload();
        }
        if (errorHandler) {
          errorHandler(err?.response?.data?.message);
        } else if (err?.response?.data?.message) {
          // notification.error({
          //   message: err?.response?.data?.message,
          //   duration: "3",
          //    });
        } else {
          // notification.error({ message: "Something Wrong Please Try again" });
        }
      }
      setIsLoading(false);
    },
    []
  );

  const sendBulkRequest = useCallback(
    async (urls, responseHandler, successMessage, errorHandler) => {
      // if (localStorage.getItem("token")) {
      //   axios.defaults.headers.common[
      //     "Authorization"
      //   ] = `Bearer ${localStorage.getItem("token")}`;
      // } else {
      //   window.location.replace("/login");
      // }

      setIsLoading(true);
      try {
        const response = await axios.all(
          urls?.map((url) => {
            switch (url?.url?.type) {
              case "POST":
                return Services.post(url?.url?.endpoint, url?.payload);

              case "PUT":
                return Services.put(url?.url?.endpoint, url?.payload);

              case "DELETE":
                return Services.delete(url?.url?.endpoint);

              case "PATCH":
                return Services.patch(url?.url?.endpoint, url?.payload);

              default:
                return Services.get(url?.endpoint);
            }
          })
        );

        if (successMessage) {
          // notification.success({ message: successMessage, duration: "3" });
        }
        try {
          if (responseHandler) {
            responseHandler(response);
          }
        } catch (e) {
          console.log(e);
        }
      } catch (err) {
        // if (err?.response?.status === 401 && err?.response?.data?.status === "Permission Denied") {
        //   window.location.assign('/blockuser');
        // }
        console.error('Hi i am error', err)
        if (
          err?.response?.data?.status === 401 &&
          err?.response?.data?.message === "Your account is blocked"
        ) {
          window.location.replace("/blockuser");
        } else if (
          err?.response?.data?.status === 401 &&
          err?.response?.data?.message === "Your account is suspended"
        ) {
          window.location.replace("/suspendeduser");
        }
        if (
          [
            "jwt expired",
            "You are not authorize person",
            "Not authorized",

            "Unknown Error",
          ].includes(err?.response?.data?.message)
        ) {
        //   deleteAuthDetails();
          localStorage.removeItem("name");
          localStorage.removeItem("email");
          localStorage.removeItem("token");
          window.location.reload();
        }
        console.log(err?.response?.data?.message);
        if (err?.response?.data?.message) {
          // notification.error({
          //   message: err?.response?.data?.message,
          //   duration: "3",
          // });
          if (errorHandler) {
            errorHandler(err?.response?.data?.message);
          }

          return;
        }

        // eslint-disable-next-line consistent-return
        // return notification.error({
        //   message: "Something Wrong Please Try again",
        // });
      }
      setIsLoading(false);
    },
    []
  );
  return {
    isLoading,
    sendRequest,
    sendBulkRequest,
  };
};

export default useHttp;


export const apiGenerator = (apiObject, exchangePair = {}, join = null) => {
  const apiObj = { ...apiObject };
  if (Object.keys(exchangePair).length) {
    Object.keys(exchangePair).forEach((el) => {
      apiObj.endpoint = apiObj.endpoint.replace(`:${el}`, exchangePair[el]);
    });
  }
  if (join) {
    apiObj.endpoint = `${apiObj.endpoint}${join}`;
  }
  return apiObj;
};



// sample how to use it 
// const API = useHttp();
  
// API.sendRequest(
//     CONSTANTS.API.auth.updateMe,
//     (res) => {
//       if (res?.status === "success") {
//         notification.success({
//           message: "Successfully Updated Info!",
//         });
//         setUserDetails({});
//         setRefresh((prev) => !prev);
//       }
//     },
//     payload,
//     "Success Message",
//     "Error Message"
//   );