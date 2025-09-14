import React, { useState } from "react";

const AddBuyerForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "Chandigarh",
    propertyType: "Apartment",
    bhk: "",
    purpose: "Buy",
    budgetMin: "",
    budgetMax: "",
    timeline: "0-3m",
    source: "Website",
    status: "New",
    notes: "",
    tags: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validations
    if (formData.fullName.length < 2) {
      alert("Full name must be at least 2 characters.");
      return;
    }
    if (!/^\d{10,15}$/.test(formData.phone)) {
      alert("Phone must be 10–15 digits.");
      return;
    }
    if (formData.budgetMin && formData.budgetMax && Number(formData.budgetMax) < Number(formData.budgetMin)) {
      alert("Budget Max must be greater than or equal to Budget Min.");
      return;
    }
    if (["Apartment", "Villa"].includes(formData.propertyType) && !formData.bhk) {
      alert("BHK is required for Apartment/Villa.");
      return;
    }

    // For now just log the data
    console.log("New Buyer:", {
      ...formData,
      tags: formData.tags.split(",").map((tag) => tag.trim()), // convert tags to array
      updatedAt: new Date().toISOString(),
    });
    alert("Buyer submitted! Check console.");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Buyer</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email (optional)"
          value={formData.email}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        {/* Phone */}
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />

        {/* City */}
        <select name="city" value={formData.city} onChange={handleChange} className="p-2 border rounded">
          <option>Chandigarh</option>
          <option>Mohali</option>
          <option>Zirakpur</option>
          <option>Panchkula</option>
          <option>Other</option>
        </select>

        {/* Property Type */}
        <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="p-2 border rounded">
          <option>Apartment</option>
          <option>Villa</option>
          <option>Plot</option>
          <option>Office</option>
          <option>Retail</option>
        </select>

        {/* BHK (only for Apartment/Villa) */}
        {["Apartment", "Villa"].includes(formData.propertyType) && (
          <select name="bhk" value={formData.bhk} onChange={handleChange} className="p-2 border rounded">
            <option value="">Select BHK</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>Studio</option>
          </select>
        )}

        {/* Purpose */}
        <select name="purpose" value={formData.purpose} onChange={handleChange} className="p-2 border rounded">
          <option>Buy</option>
          <option>Rent</option>
        </select>

        {/* Budget Min */}
        <input
          type="number"
          name="budgetMin"
          placeholder="Budget Min (INR)"
          value={formData.budgetMin}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        {/* Budget Max */}
        <input
          type="number"
          name="budgetMax"
          placeholder="Budget Max (INR)"
          value={formData.budgetMax}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        {/* Timeline */}
        <select name="timeline" value={formData.timeline} onChange={handleChange} className="p-2 border rounded">
          <option value="0-3m">0-3 months</option>
          <option value="3-6m">3-6 months</option>
          <option value=">6m">More than 6 months</option>
          <option value="Exploring">Exploring</option>
        </select>

        {/* Source */}
        <select name="source" value={formData.source} onChange={handleChange} className="p-2 border rounded">
          <option>Website</option>
          <option>Referral</option>
          <option>Walk-in</option>
          <option>Call</option>
          <option>Other</option>
        </select>

        {/* Status */}
        <select name="status" value={formData.status} onChange={handleChange} className="p-2 border rounded">
          <option>New</option>
          <option>Qualified</option>
          <option>Contacted</option>
          <option>Visited</option>
          <option>Negotiation</option>
          <option>Converted</option>
          <option>Dropped</option>
        </select>

        {/* Notes */}
        <textarea
          name="notes"
          placeholder="Notes (optional, max 1000 chars)"
          value={formData.notes}
          onChange={handleChange}
          maxLength={1000}
          className="p-2 border rounded md:col-span-2"
        />

        {/* Tags */}
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={handleChange}
          className="p-2 border rounded md:col-span-2"
        />

        {/* Submit */}
        <button
          type="submit"
          className="md:col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Add Buyer
        </button>
      </form>
    </div>
  );
};

export default AddBuyerForm;
