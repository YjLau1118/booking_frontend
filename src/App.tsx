import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/user/home";
import Login from "./pages/auth/login";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";
import { MantineProvider } from "@mantine/core";
import SignUp from "./pages/auth/signup";
import ForgetPassword from "./pages/auth/forgetpassword";
import Details from "./pages/user/details";
import BookingHistory from "./pages/user/history";
import AdminDashboard from "./pages/admin/dashboard";

function App() {
  const location = useLocation();
  return (
    <Routes location={location}>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgetPwd" element={<ForgetPassword />} />

      <Route path="/" element={<HomePage />} />
      <Route path="/details/:id" element={<Details />} />
      <Route path="/history" element={<BookingHistory />} />

      <Route path="/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
