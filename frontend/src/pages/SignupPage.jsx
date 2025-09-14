import React, { useState } from "react";
import { motion } from "framer-motion";
// import { z } from "zod";
import { signupSchema } from "../validation/userSchemas";


export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      if (formData?.password?.length >= 6) {
        const { password, ...rest } = errors;
        setErrors(rest);
      }
    }
    if (name === "phone") {
      if (formData?.password?.length >= 10 && formData?.password?.length <= 15) {
        const { phone, ...rest } = errors;
        setErrors(rest);
      }
    }

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(value)) {
        const { email, ...rest } = errors;
        setErrors(rest);
      }
    }

  };


  const handleSubmit = (e) => {
    e.preventDefault();

    const result = signupSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = {};
      result?.error?.issues?.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }


    setErrors({});

    try{
      console.log("✅ Signup Data:", formData);

    }
    catch(error){
      console.log("Error in signup : ",error)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold mb-6 text-center text-blue-700"
        >
          Agent Signup
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full border ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </motion.div>

          {/* Phone */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="9876543210"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
