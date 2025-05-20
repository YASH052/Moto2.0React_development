import { GetRelEDIInetgrationStatusView } from "../../../Api/Api";

export const initialSearchParams = {
    processTypeId: 0, // 0 = Tertiary Sale Status, 1 = Stock Transfer Status
    processStatusId: null, // -1 = All List 0 = Pending, 1 = Success, 2 = Fail 3 = Partial Success
    stockTransferId: 0, // Send stockTransferId Get this Details
    tertiarySaleId: 0, // Send tertiarySaleId Get this Details
    fromDate: "2025-01-01",
    toDate: "2025-03-19",
    pageIndex: 1,
    pageSize: 20,
    pageIndex1: 1,
    pageSize1: 20
};

export const processTypeOptions = [
    { id: 0, label: "Tertiary Sale Status" },
    { id: 1, label: "Stock Transfer Status" },
];

export const processStatusOptions = [
    { id: -1, label: "All" },
    { id: 0, label: "Pending" },
    { id: 1, label: "Success" },
    { id: 2, label: "Fail" },
    { id: 3, label: "Partial Success" },
];

export const fetchRelApiStatus = async (searchParams) => {
    try {
        const response = await GetRelEDIInetgrationStatusView(searchParams);
        console.log(response, "response");
        if (response.statusCode == 200) {
            return {
                success: true,
                data: {
                    tertairySaleHeaderItem: response.tertairySaleHeaderItem || [],
                    stkTranHeaderItem: response.stkTranHeaderItem || [],
                    totalRecords: response.totalRecords || 0
                }
            };
        } else {
            return {
                success: false,
                error: {
                    statusCode: response.statusCode,
                    message: response.statusMessage
                }
            };
        }
    } catch (error) {
        return {
            success: false,
            error: {
                statusCode: error.statusCode || "500",
                message: error.message || "An error occurred while fetching data"
            }
        };
    }
};

export const handleDateValidation = (fromDate, toDate) => {
    if (!fromDate || !toDate) {
        return {
            isValid: false,
            error: "Both From Date and To Date are required"
        };
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (from > to) {
        return {
            isValid: false,
            error: "From date cannot be greater than To date"
        };
    }

    return {
        isValid: true,
        error: null
    };
};

export const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
};

export const tableColumns = [
    { id: "storeName", label: "STORE NAME" },
    { id: "storeNumber", label: "STORE NUMBER" },
    { id: "storeFormat", label: "STORE FORMAT" },
    { id: "status", label: "STATUS" },
    { id: "createdOn", label: "CREATED ON" },
    { id: "processedOn", label: "PROCESSED ON" },
    { id: "view", label: "VIEW" }
]; 


export const tableColumns1 = [
    { id: "sno", label: "SNO" },

    { id: "storeName", label: "STORE NAME" },
    { id: "storeNumber", label: "STORE NUMBER" },
    { id: "storeFormat", label: "STORE FORMAT" },
    { id: "status", label: "STATUS" },
    { id: "receiveDate", label: "RECEIVE DATE" },
    { id: "transferDate", label: "TRANSFER DATE" },
    { id: "isReceived", label: "IS RECEIVED" },
    { id: "acknowlegeDate", label: "ACKNOWLEDGE DATE" },
    { id: "view", label: "VIEW" }

];

