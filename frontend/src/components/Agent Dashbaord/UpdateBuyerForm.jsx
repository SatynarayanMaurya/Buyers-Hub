import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {toast} from "react-toastify"
import { clearAllBuyers, setLoading } from "../../redux/userSlice";
import { apiConnector } from "../../services/apiConnector";
import { buyerEndpoints } from "../../services/apis";
import Spinner from "../Spinner";
import { useEffect } from "react";
import { useRef } from "react";

const UpdateBuyerForm = () => {
  const {id} = useParams()
  const location = useLocation()
  const dispatch = useDispatch();
  const loading = useSelector((state)=>state.user.loading)
  const navigate = useNavigate()
  const buyerDetails = location.state
  const userDetails = useSelector((state)=>state.user.userDetails)

  const toastShown = useRef(false);

  useEffect(() => {
    if (!toastShown.current && buyerDetails && userDetails) {
      if (buyerDetails.ownerId === userDetails.id) {
        toast.success("✅ You are allowed to edit this buyer's details.");
      } else {
        toast.warn("⚠ Editing restricted. You do not own this buyer..");
      }
      toastShown.current = true; // prevent further toasts
    }
  }, [buyerDetails, userDetails]);


  const [formData, setFormData] = useState({
    fullName: buyerDetails?.fullName || "",
    email: buyerDetails?.email || "",
    phone:  buyerDetails?.phone || "",
    city:  buyerDetails?.city || "Chandigarh",
    propertyType: buyerDetails?.propertyType || "Apartment",
    bhk:  buyerDetails?.bhk || "",
    purpose:  buyerDetails?.purpose || "Buy",
    budgetMin:  buyerDetails?.budgetMin || "",
    budgetMax:  buyerDetails?.budgetMax || "",
    timeline:  buyerDetails?.timeline || "0-3m",
    source: buyerDetails?.source || "Website",
    status: buyerDetails?.status || "New",
    notes:  buyerDetails?.notes || "",
    tags:  buyerDetails?.tags?.join(", ") || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (["fullName", "bhk","budgetMin","budgetMax","phone"].includes(name) && value?.length > 0) {
      setErrors((prev) => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
  };


  const [errors, setErrors] = useState({});

  const handleSubmit =async (e) => {
    e.preventDefault();

    console.log("Submit")
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10–15 digits";
    }
    if (!formData.bhk && (formData?.propertyType === "Apartment" || formData?.propertyType === "Villa")) newErrors.bhk = "BHK is required";

    if (!formData.budgetMin) newErrors.budgetMin = "Minimum budget is required";
    if (!formData.budgetMax) newErrors.budgetMax = "Maximum budget is required";
    if (
      formData.budgetMin &&
      formData.budgetMax &&
      Number(formData.budgetMin) > Number(formData.budgetMax)
    ) {
      newErrors.budgetMax = "Max budget must be greater than Min budget";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.warn("Please fix the errors before submitting.") 
      return;
    }
    
    try{
      dispatch(setLoading(true))
      const result = await apiConnector("PUT",`${buyerEndpoints.UPDATE_BUYER}/${id}`,{...formData,tags: formData.tags.split(",").map((tag) => tag.trim()),
      updatedAt: new Date().toISOString(),})
      toast.success(result?.data?.message )
      dispatch(setLoading(false))
      dispatch(clearAllBuyers())
      navigate("/buyers")
    }
    catch(error){
      dispatch(setLoading(false))
      toast.error(error?.response?.data?.message || error.message || "Error in updating the buyer details")
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-4 px-4">
      {loading && <Spinner/>}
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mb-2 shadow-lg">
            <span className="text-xl">✏️</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Update Buyer
          </h1>
          <p className="text-gray-600">
            Modify the details to update this buyer in your database
          </p>
        </div>


        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <span>👤</span>
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    readOnly={buyerDetails?.ownerId !== userDetails?.id}
                    className={`w-full border ${
                      errors.fullName ? "border-red-500" : "border-gray-200"
                    } rounded-lg p-3 ${
                      buyerDetails?.ownerId !== userDetails?.id
                        ? "bg-gray-100 cursor-not-allowed focus:outline-none" // read-only styles
                        : "focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm ">{errors.fullName}</p>
                   )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <span>📧</span>
                    <span>Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    readOnly={buyerDetails?.ownerId !== userDetails?.id}
                    className={`w-full border ${
                      errors.email ? "border-red-500" : "border-gray-200"
                    } rounded-lg p-3 ${
                      buyerDetails?.ownerId !== userDetails?.id
                        ? "bg-gray-100 cursor-not-allowed focus:outline-none" // read-only styles
                        : "focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }`}
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <span>📱</span>
                    <span>Phone *</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    readOnly={buyerDetails?.ownerId !== userDetails?.id}
                    className={`w-full border ${
                      errors.phone ? "border-red-500" : "border-gray-200"
                    } rounded-lg p-3 ${
                      buyerDetails?.ownerId !== userDetails?.id
                        ? "bg-gray-100 cursor-not-allowed focus:outline-none" // read-only styles
                        : "focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }`}
                        
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-sm ">{errors.phone}</p>
                    )}
                </div>
              </div>
            </div>

            {/* Property Preferences Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Property Preferences</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* City */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <span>🏙️</span>
                    <span>City</span>
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={buyerDetails?.ownerId !== userDetails?.id}
                    className={`w-full border ${
                      errors.city ? "border-red-500" : "border-gray-200"
                    } rounded-lg p-3 ${
                      buyerDetails?.ownerId !== userDetails?.id
                        ? "bg-gray-100 cursor-not-allowed focus:outline-none appearance-none" // read-only styles
                        : "focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }`}
                  >
                    <option>Chandigarh</option>
                    <option>Mohali</option>
                    <option>Zirakpur</option>
                    <option>Panchkula</option>
                    <option>Other</option>
                  </select>
                </div>

                {/* Property Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <span>🏠</span>
                    <span>Property Type</span>
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    disabled={buyerDetails?.ownerId !== userDetails?.id}
                    className={`w-full border ${
                      errors.propertyType ? "border-red-500" : "border-gray-200"
                    } rounded-lg p-3 ${
                      buyerDetails?.ownerId !== userDetails?.id
                        ? "bg-gray-100 cursor-not-allowed focus:outline-none appearance-none" // read-only styles
                        : "focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }`}
                  >
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>Plot</option>
                    <option>Office</option>
                    <option>Retail</option>
                  </select>
                </div>

                {/* BHK */}
                {["Apartment", "Villa"].includes(formData.propertyType) && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                      <span>🛏️</span>
                      <span>BHK</span>
                    </label>
                    <select
                      name="bhk"
                      value={formData.bhk}
                      onChange={handleChange}
                      disabled={buyerDetails?.ownerId !== userDetails?.id}
                      className={`w-full border ${
                      ((formData?.propertyType === "Apartment" || formData?.propertyType === "Villa") && errors.bhk) ? "border-red-500" : "border-gray-200"
                    } rounded-lg p-3 ${
                      buyerDetails?.ownerId !== userDetails?.id
                        ? "bg-gray-100 cursor-not-allowed focus:outline-none appearance-none" // read-only styles
                        : "focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }`}
                    >
                      <option value="">Select BHK</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>Studio</option>
                    </select>

                        
                    {(formData?.propertyType === "Apartment" || formData?.propertyType === "Villa") && errors.bhk && (
                        <p className="text-red-500 text-sm ">{errors.bhk}</p>
                    )}
                  </div>
                )}

                {/* Purpose */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <span>🎯</span>
                    <span>Purpose</span>
                  </label>
                  <select
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    disabled={buyerDetails?.ownerId !== userDetails?.id}
                    className={`w-full border border-gray-200 rounded-lg p-3 ${
                      buyerDetails?.ownerId !== userDetails?.id
                        ? "bg-gray-100 cursor-not-allowed focus:outline-none appearance-none" // read-only styles
                        : "focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }`}
                  >
                    <option>Buy</option>
                    <option>Rent</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Budget & Timeline Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Budget & Timeline</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Budget Min */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <span>💰</span>
                    <span>Budget Min (₹)</span>
                  </label>
                  <input
                    type="number"
                    name="budgetMin"
                    placeholder="5,000,000"
                    value={formData.budgetMin}
                    onChange={handleChange}
                    readOnly={buyerDetails?.ownerId !== userDetails?.id}
                    className={`w-full border ${
                      errors.budgetMin ? "border-red-500" : "border-gray-200"
                    } rounded-lg p-3 ${
                      buyerDetails?.ownerId !== userDetails?.id
                        ? "bg-gray-100 cursor-not-allowed focus:outline-none" // read-only styles
                        : "focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }`}
                        
                    />
                    {errors.budgetMin && (
                        <p className="text-red-500 text-sm ">{errors.budgetMin}</p>
                    )}
                </div>

                {/* Budget Max */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <span>💎</span>
                    <span>Budget Max (₹)</span>
                  </label>
                  <input
                    type="number"
                    name="budgetMax"
                    placeholder="10,000,000"
                    value={formData.budgetMax}
                    onChange={handleChange}
                    readOnly={buyerDetails?.ownerId !== userDetails?.id}
                    className={`w-full border ${
                      errors.budgetMax ? "border-red-500" : "border-gray-200"
                    } rounded-lg p-3 ${
                      buyerDetails?.ownerId !== userDetails?.id
                        ? "bg-gray-100 cursor-not-allowed focus:outline-none" // read-only styles
                        : "focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }`}
                        
                    />
                    {errors.budgetMax && (
                        <p className="text-red-500 text-sm ">{errors.budgetMax}</p>
                    )}
                </div>

                {/* Timeline */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <span>⏰</span>
                    <span>Timeline</span>
                  </label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    disabled={buyerDetails?.ownerId !== userDetails?.id}
                    className={`w-full border border-gray-200 rounded-lg p-3 ${
                      buyerDetails?.ownerId !== userDetails?.id
                        ? "bg-gray-100 cursor-not-allowed focus:outline-none appearance-none" // read-only styles
                        : "focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }`}
                  >
                    <option value="0-3m">0-3 months</option>
                    <option value="3-6m">3-6 months</option>
                    <option value=">6m">More than 6 months</option>
                    <option value="Exploring">Exploring</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">4</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Additional Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Source */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <span>📊</span>
                    <span>Source</span>
                  </label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    disabled={buyerDetails?.ownerId !== userDetails?.id}
                    className={`w-full border border-gray-200 rounded-lg p-3 ${
                      buyerDetails?.ownerId !== userDetails?.id
                        ? "bg-gray-100 cursor-not-allowed focus:outline-none appearance-none" // read-only styles
                        : "focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }`}
                  >
                    <option>Website</option>
                    <option>Referral</option>
                    <option>Walk-in</option>
                    <option>Call</option>
                    <option>Other</option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <span>📈</span>
                    <span>Status</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={buyerDetails?.ownerId !== userDetails?.id}
                                        className={`w-full border border-gray-200 rounded-lg p-3 ${
                      buyerDetails?.ownerId !== userDetails?.id
                        ? "bg-gray-100 cursor-not-allowed focus:outline-none appearance-none" // read-only styles
                        : "focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }`}
                  >
                    <option>New</option>
                    <option>Qualified</option>
                    <option>Contacted</option>
                    <option>Visited</option>
                    <option>Negotiation</option>
                    <option>Converted</option>
                    <option>Dropped</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <span>📝</span>
                  <span>Notes</span>
                </label>
                <textarea
                  name="notes"
                  placeholder="Add any additional notes about the buyer..."
                  value={formData.notes}
                  onChange={handleChange}
                  maxLength={500}
                  readOnly={buyerDetails?.ownerId !== userDetails?.id}
                  // className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 bg-white/60 backdrop-blur-sm hover:bg-white/80 h-28 resize-none"
                  className={`w-full border border-gray-200 rounded-lg p-3 h-28 resize-none ${
                      buyerDetails?.ownerId !== userDetails?.id
                        ? "bg-gray-100 cursor-not-allowed focus:outline-none" // read-only styles
                        : "focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }`}
                />
                <div className="text-right text-sm text-gray-500">
                  {formData.notes.length}/500
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <span>🏷️</span>
                  <span>Tags</span>
                </label>
                <input
                  type="text"
                  name="tags"
                  placeholder="VIP, NRI, Investor, First-time buyer..."
                  value={formData.tags}
                  onChange={handleChange}
                  readOnly={buyerDetails?.ownerId !== userDetails?.id}
                  className={`w-full border border-gray-200 rounded-lg p-3 ${
                      buyerDetails?.ownerId !== userDetails?.id
                        ? "bg-gray-100 cursor-not-allowed focus:outline-none" // read-only styles
                        : "focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }`}
                />
                <div className="text-sm text-gray-500">
                  Separate multiple tags with commas
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
              type="submit"
                onClick={handleSubmit}
                disabled={buyerDetails?.ownerId !== userDetails?.id}
                className={`w-full ${buyerDetails?.ownerId !== userDetails?.id ?"cursor-not-allowed":"cursor-pointer"} bg-gradient-to-r from-green-300 via-pink-400 to-yellow-300 text-white font-semibold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-3`}
              >
                <span className="text-xl">✨</span>
                <span>Update Buyer to Database</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateBuyerForm;