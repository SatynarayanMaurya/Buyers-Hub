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

export const importCsv = async (file) => {
  try {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const result = await apiConnector(
      "POST",
      buyerEndpoints.IMPORT_CSV,
      formData,
      { "Content-Type": "multipart/form-data" }
    );

    toast.success(result?.data?.message || "CSV imported successfully");
    return result?.data;
  } catch (error) {
    console.error("Error importing CSV:", error);

    if (error?.response?.status === 400 && error?.response?.data?.errors) {
      toast.error("Some rows failed validation. Please check the table.");
      return { errors: error.response.data.errors };
    }

    toast.error(error?.response?.data?.message || "Error importing CSV");
    return null;
  }
};
