import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, PlusCircle, FileText, Activity, Filter, Download, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setAllBuyers, setLoading, setUserDetails } from "../../redux/userSlice";
import { apiConnector } from "../../services/apiConnector";
import { agentEndpoints, buyerEndpoints } from "../../services/apis";

export default function AgentDashboard() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate()
  const userDetails = useSelector((state)=>state.user.userDetails)
  const loading = useSelector((state)=>state.user.loading)
  const dispatch = useDispatch()
  const allBuyers = useSelector((state)=>state.user.allBuyers)

  const viewOrEditBuyer = (buyer)=>{
    navigate(`/buyers/${buyer?._id}`,{state:buyer})
  }

  const getUserDetails = async()=>{
    try{
      if(userDetails) return ;
      dispatch(setLoading(true))
      const result = await apiConnector("GET",agentEndpoints.GET_USER_DETAILS)
      dispatch(setUserDetails(result?.data?.userDetails))
      toast.success(result?.data?.message)
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
      if(allBuyers) return ;
      dispatch(setLoading(true))
      const result = await apiConnector("GET",buyerEndpoints.GET_ALL_BUYERS)
      dispatch(setAllBuyers(result?.data?.allBuyers))
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
    getUserDetails()
  },[])

  return (
    <div className="min-h-screen bg-gray-50 p-6">

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
          <select className="border border-gray-300 rounded-lg px-2 py-2">
            <option value="">City</option>
            <option>Chandigarh</option>
            <option>Mohali</option>
            <option>Zirakpur</option>
            <option>Panchkula</option>
            <option>Other</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-2 py-2">
            <option value="">Property Type</option>
            <option>Apartment</option>
            <option>Villa</option>
            <option>Plot</option>
            <option>Office</option>
            <option>Retail</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-2 py-2">
            <option value="">Status</option>
            <option>New</option>
            <option>Qualified</option>
            <option>Contacted</option>
            <option>Visited</option>
            <option>Negotiation</option>
            <option>Converted</option>
            <option>Dropped</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-2 py-2">
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
          <button className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            <Upload size={18} /> Import CSV
          </button>
          <button className="flex items-center gap-1 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800">
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Leads", value: "120", icon: Users, color: "bg-blue-100 text-blue-600" },
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
        transition={{ duration: 0.4 }}
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
                <th className="p-3 font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {allBuyers?.map((buyer, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
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
                  <td onClick={()=>viewOrEditBuyer(buyer)} className="p-3">
                    <button className="text-blue-600 hover:underline cursor-pointer">View / Edit</button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Activity Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-md p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <ul className="space-y-3">
          {[
            "Added new buyer: Amit Sharma",
            "Updated status: Priya Verma → Contacted",
            "Imported 10 new leads via CSV",
          ].map((activity, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              className="text-gray-600 text-sm"
            >
              • {activity}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
