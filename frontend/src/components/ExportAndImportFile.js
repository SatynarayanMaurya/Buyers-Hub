import { toast } from "react-toastify";
import { apiConnector } from "../services/apiConnector";
import { buyerEndpoints } from "../services/apis";

export const exportCsv = async(filter={})=>{
    try{
        const result = await apiConnector("GET",buyerEndpoints.EXPORT_CSV,null,{},filter)
        const blob = new Blob([result.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "buyers_export.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
    catch(error){
        console.log("Error in exporting csv file : ",error)
        toast.error(error?.response?.data?.message || error.message || "Error in exporting the csv file")
    }
}