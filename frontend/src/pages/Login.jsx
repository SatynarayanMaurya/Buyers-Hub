import React, { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { loginSchema } from "../validation/userSchemas";
import {toast} from "react-toastify"
import { apiConnector } from "../services/apiConnector";
import { authEndpoints } from "../services/apis";
import {useNavigate} from "react-router-dom"
import Spinner from "../components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUserDetails } from "../redux/userSlice";

export default function Login() {

  const navigate = useNavigate();
  const loading = useSelector((state)=>state.user.loading)
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    password: "",
    emailOrPhone:""
  });

  const [errors, setErrors] = useState({}); // store field errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "emailOrPhone") {
      const { success } = loginSchema.shape.emailOrPhone.safeParse(value);
      if (success) {
        const { emailOrPhone, ...rest } = errors;
        setErrors(rest);
      }
    }

    if (name === "password") {
      if (value.length >= 6) {
        const { password, ...rest } = errors;
        setErrors(rest);
      }
    }
  };

  const handleSubmit =async (e) => {
    e.preventDefault();

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try{
      dispatch(setLoading(true))
      const result = await apiConnector("POST",authEndpoints.LOGIN,formData)
      dispatch(setLoading(false))
      localStorage?.setItem("token",result?.data?.token)
      dispatch(setUserDetails(result?.data?.userDetails))
      toast.success(result?.data?.message)
      navigate("/")
    }
    catch(error){
      console.log("Error in login : ",error)
      toast.error(error?.response?.data?.message?.[0]?.message || error?.response?.data?.message || error.message || "Error in login ")
      dispatch(setLoading(false))
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-200 to-purple-200 p-4">
      {loading && <Spinner/>}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8"
      >
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-extrabold mb-6 text-center text-gray-800"
        >
          Welcome Back 👋
        </motion.h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <motion.div whileFocus={{ scale: 1.02 }} className="flex flex-col">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Email
            </label>
            <input
              type="text"
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition ${
                errors.emailOrPhone
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
              placeholder="you@example.com"
            />
            {errors.emailOrPhone && (
              <p className="text-sm text-red-500 mt-1">{errors.emailOrPhone}</p>
            )}
          </motion.div>

          {/* Password */}
          <motion.div whileFocus={{ scale: 1.02 }} className="flex flex-col">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition ${
                errors.password
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </motion.div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg shadow-md hover:bg-indigo-700 transition"
          >
            Login
          </motion.button>
        </form>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm text-gray-600 mt-6 text-center"
        >
          Don’t have an account?{" "}
          <span onClick={()=>navigate("/signup")} className="text-indigo-600 font-medium hover:underline cursor-pointer">
            Sign up
          </span>
        </motion.p>
      </motion.div>
    </div>
  );
}
