// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Login from "./pages/login";
// import Signup from "./pages/signup";
// import Dashboard from "./pages/dashboard";

// function App() {
//   const token = localStorage.getItem("token");

//   return (
//     <>   {/* ✅ Only one BrowserRouter here */}
//       <Navbar />       {/* Navbar inside Router context */}
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route
//           path="/home"
//           element={token ? <Dashboard /> : <Navigate to="/login" />}
//         />
//       </Routes>
//     </>
//   );
// }

// export default App;
