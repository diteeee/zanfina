import React, { useEffect, useState } from "react";
// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import axios from "axios";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import { jwtDecode } from "jwt-decode";

function Dashboard() {
  const [enrollmentData, setEnrollmentData] = useState({ labels: [], datasets: [] });
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("token") || localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      console.log("Token saved to localStorage:", token);

      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        const userRoleFromToken = decodedToken.role || "guest";
        console.log("User Role from Token:", userRoleFromToken);

        localStorage.setItem("role", userRoleFromToken);

        if (userRoleFromToken !== "Admin") {
          console.warn("Unauthorized access. Redirecting to presentation page.");
          window.location.href = "http://localhost:3000/presentation";
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    } else {
      localStorage.removeItem("token");
      console.warn("Unauthorized access. Redirecting to presentation page.");
      window.location.href = "http://localhost:3000/presentation";
    }
  }, [token]);

  useEffect(() => {
    // Fetch enrollment stats from backend
    axios
      .get("http://localhost:3001/enrollments/stats/enrollments-by-date")
      .then((response) => {
        const data = response.data;

        // Prepare chart labels (dates) and data points (counts)
        const labels = data.map((item) => item.date);
        const counts = data.map((item) => Number(item.count));

        // Format data for ReportsLineChart
        setEnrollmentData({
          labels,
          datasets: { label: "Enrollments", data: counts, borderColor: "#4caf50", tension: 0.4 },
        });
      })
      .catch((error) => {
        console.error("Failed to fetch enrollment stats", error);
      });
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3} px={2}>
        {" "}
        {/* added horizontal padding for breathing room */}
        <Grid container spacing={3} justifyContent="center">
          {/* Make the chart take more horizontal space */}
          <Grid item xs={12} md={10} lg={8}>
            <MDBox mb={3}>
              <ReportsLineChart
                color="success"
                title="Student Enrollments Over Time"
                date="updated just now"
                chart={enrollmentData}
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
