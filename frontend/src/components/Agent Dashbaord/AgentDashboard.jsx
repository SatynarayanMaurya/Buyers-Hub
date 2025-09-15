import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, PlusCircle, FileText, Activity, Filter, Download, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { clearAllBuyers, setAllBuyers, setLoading, setPaginationData, setUserDetails } from "../../redux/userSlice";
import { apiConnector } from "../../services/apiConnector";
import { agentEndpoints, buyerEndpoints } from "../../services/apis";
import Spinner from "../Spinner";
import { exportCsv, importCsv } from "../ExportAndImportFile";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AgentDashboard() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate()
  const userDetails = useSelector((state)=>state.user.userDetails)
  const loading = useSelector((state)=>state.user.loading)
  const dispatch = useDispatch()
  const allBuyers = useSelector((state)=>state.user.allBuyers)
  const [fetchAgain , setFetchAgain ] = useState(false)
  const [page,setPage] = useState(1);
  const [pageSize,setPageSize] = useState(10)
  const paginationData = useSelector((state)=>state.user.paginationData)

  const [city,setCity] = useState("")
  const [propertyType,setPropertyType] = useState("")
  const [status,setStatus] = useState("")
  const [timeline, setTimeline] = useState("")
  
   const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try{
      dispatch(setLoading(true))
      const response = await importCsv(file);
      dispatch(setLoading(false))
      dispatch(clearAllBuyers())
      setFetchAgain(!fetchAgain)
    }
    catch(error){
      dispatch(setLoading(false))
      console.log("Error in importing the file")
    }
  };

  const [filteredBuyers, setFilteredBuyers] = useState([])

  useEffect(() => {
    const filterBuyers = allBuyers?.filter((buyer) => {
      const matchesSearch =
        search === "" ||
        buyer.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        buyer.email?.toLowerCase().includes(search.toLowerCase()) ||
        buyer.phone?.includes(search);

      return (
        matchesSearch &&
        (city === "" || buyer.city === city) &&
        (propertyType === "" || buyer.propertyType === propertyType) &&
        (status === "" || buyer.status === status) &&
        (timeline === "" || buyer.timeline === timeline)
      );
    });

    setFilteredBuyers(filterBuyers);
  }, [city, propertyType, status, timeline, search, allBuyers]);


  const viewOrEditBuyer = (buyer)=>{
    navigate(`/buyers/${buyer?.id}`,{state:buyer})
  }

  const getUserDetails = async()=>{
    try{
      if(userDetails) return ;
      dispatch(setLoading(true))
      const result = await apiConnector("GET",agentEndpoints.GET_USER_DETAILS)
      dispatch(setUserDetails(result?.data?.userDetails))
    }
    catch(error){
      toast.error(error?.response?.data?.message || error.message || "Error in getting the agent details")
    }
    finally{
      dispatch(setLoading(false))
    }
  }

  const getAllBuyers = async()=>{
    try{
      dispatch(setLoading(true))
      const result = await apiConnector("GET",`${buyerEndpoints.GET_ALL_BUYERS}?q=${page}&pageSize=${pageSize}`)
      dispatch(setAllBuyers(result?.data?.buyers))
      dispatch(setPaginationData(result?.data?.pagination))
      dispatch(setLoading(false))
    }
    catch(error){
      console.log("Error in getting all the buyers : ",error)
      dispatch(setLoading(false))
      toast.error(error?.response?.data?.message || error.message || "Error in getting all the buyers")
    }
  }

  useEffect(()=>{
    getAllBuyers();
  },[fetchAgain,page,pageSize])
  
  useEffect(()=>{
    getUserDetails()
  },[])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {loading && <Spinner/>}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
      >
        {/* Dashboard Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Agent Dashboard
        </h1>

        {/* User Info */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6 text-gray-700 text-sm">
          <span>
            <strong>Agent:</strong> {userDetails?.fullName || "John Doe"}
          </span>
          <span>
            <strong>Email:</strong> {userDetails?.email || "johndoe@example.com"}
          </span>
          <span>
            <strong>Phone:</strong> {userDetails?.phone || "*******4763"}
          </span>
        </div>
      </motion.div>


      {/* Top Actions */}
      <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
        {/* Search Bar */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, email..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Filters */}
        <div className="flex gap-2">
          <select value={city} onChange={(e)=>setCity(e.target.value)} className="border border-gray-300 rounded-lg px-2 py-2">
            <option value="">City</option>
            <option >Chandigarh</option>
            <option>Mohali</option>
            <option>Zirakpur</option>
            <option>Panchkula</option>
            <option>Other</option>
          </select>
          <select value={propertyType} onChange={(e)=>setPropertyType(e.target.value)}  className="border border-gray-300 rounded-lg px-2 py-2">
            <option value="">Property Type</option>
            <option>Apartment</option>
            <option>Villa</option>
            <option>Plot</option>
            <option>Office</option>
            <option>Retail</option>
          </select>
          <select value={status} onChange={(e)=>setStatus(e.target.value)}  className="border border-gray-300 rounded-lg px-2 py-2">
            <option value="">Status</option>
            <option>New</option>
            <option>Qualified</option>
            <option>Contacted</option>
            <option>Visited</option>
            <option>Negotiation</option>
            <option>Converted</option>
            <option>Dropped</option>
          </select>
          <select value={timeline} onChange={(e)=>setTimeline(e.target.value)} className="border border-gray-300 rounded-lg px-2 py-2">
            <option value="">Timeline</option>
            <option>0-3m</option>
            <option>3-6m</option>
            <option>&gt;6m</option>
            <option>Exploring</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button onClick={()=>navigate("/buyers/new")} className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <PlusCircle size={18} /> Add Buyer
          </button>
          <label htmlFor="fileUpload" className="flex cursor-pointer items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              <Upload size={18} /> Import CSV
          </label>
          <input type="file" name="fileUpload" id="fileUpload" onChange={(e)=>handleImport(e)} className="hidden" />
          <button onClick={()=>exportCsv({city,status,propertyType,timeline,search})} className="flex items-center gap-1 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800">
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Leads", value: paginationData?.totalCount||"120", icon: Users, color: "bg-blue-100 text-blue-600" },
          { label: "New This Week", value: "15", icon: PlusCircle, color: "bg-green-100 text-green-600" },
          { label: "Converted", value: "45", icon: FileText, color: "bg-purple-100 text-purple-600" },
          { label: "Active", value: "60", icon: Activity, color: "bg-orange-100 text-orange-600" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="p-5 bg-white rounded-2xl shadow-md flex items-center space-x-4"
          >
            <div className={`p-3 rounded-xl ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <h3 className="text-xl font-bold">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Buyers Table */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.1 }}
        className="bg-white rounded-2xl shadow-md p-6 mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">Buyers List</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 font-medium text-gray-700">Name</th>
                <th className="p-3 font-medium text-gray-700">Phone</th>
                <th className="p-3 font-medium text-gray-700">City</th>
                <th className="p-3 font-medium text-gray-700">Property Type</th>
                <th className="p-3 font-medium text-gray-700">Budget</th>
                <th className="p-3 font-medium text-gray-700">Timeline</th>
                <th className="p-3 font-medium text-gray-700">Purpose</th>
                <th className="p-3 font-medium text-gray-700">Status</th>
                <th className="p-3 font-medium text-gray-700">UpdatedAt</th>
                <th className="p-3 font-medium text-gray-700">Created By</th>
                <th className="p-3 font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {
                filteredBuyers?.length ===0 ?
                (
                  <tr>
                    <td
                      colSpan="10" 
                      className="text-center p-4 bg-green-100 text-gray-700 font-medium"
                    >
                      No Buyer found
                    </td>
                  </tr>
                ):
                filteredBuyers?.slice(0,10)?.map((buyer, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{buyer.fullName}</td>
                    <td className="p-3">{buyer.phone}</td>
                    <td className="p-3">{buyer.city}</td>
                    <td className="p-3">{buyer.propertyType}</td>
                    <td className="p-3">{buyer.budgetMin}-{buyer.budgetMax}</td>
                    <td className="p-3">{buyer.timeline}</td>
                    <td className="p-3">{buyer.purpose}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                        {buyer.status}
                      </span>
                    </td>
                    <td className="p-3">{buyer.updatedAt}</td>
                    <td className="p-3">{buyer.ownerId === userDetails?.id ? <span className="px-2 py-1 rounded-full text-green-600 bg-green-100">You</span> :<span className="px-2 py-1 rounded-full text-yellow-600 bg-yellow-100">Other</span>}</td>
                    <td onClick={()=>viewOrEditBuyer(buyer)} className="p-3">
                      <button className="text-blue-600 hover:underline cursor-pointer">View / Edit</button>
                    </td>
                  </motion.tr>
                ))
              }
            </tbody>
          </table>


          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 px-4 py-2">

            <div className="flex items-center gap-2 text-gray-600">
              <span className="font-medium">Go to page:</span>
              <select
                value={page}
                onChange={(e) => setPage(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: paginationData?.totalPages || 1 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="flex cursor-pointer items-center gap-1 px-3 py-2 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Prev</span>
              </button>

              <span className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold shadow">
                {page} / {paginationData?.totalPages || 1}
              </span>

              <button
                onClick={() => setPage(page + 1)}
                disabled={paginationData?.totalPages === page}
                className="flex cursor-pointer items-center gap-1 px-3 py-2 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="flex items-center gap-2  text-gray-600">
              <span className="font-medium">Page size:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>


        </div>
      </motion.div>

    </div>
  );
}
