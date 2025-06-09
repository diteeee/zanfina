import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

function Enrollments() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [enrollmentData, setEnrollmentData] = useState({
    enrollmentID: "",
    data: "",
    enrollmentKidID: "",
    enrollmentClassID: "",
  });
  const [kids, setKids] = useState([]);
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchEnrollments();
      fetchKids();
      fetchClasses();
    }
  }, [navigate]);

  const fetchEnrollments = () => {
    axios
      .get("http://localhost:3001/enrollments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const enrollments = res.data;
        setColumns([
          { Header: "Date", accessor: "data", align: "left" },
          { Header: "Kid", accessor: "kidName", align: "left" },
          { Header: "Class", accessor: "className", align: "left" },
          { Header: "Actions", accessor: "actions", align: "center" },
        ]);

        setRows(
          enrollments.map((e) => ({
            data: e.data,
            kidName: e.Kid?.emri + " " + e.Kid?.mbiemri,
            className: e.Class?.emri,
            actions: (
              <div>
                <Button color="primary" onClick={() => handleEdit(e)}>
                  Edit
                </Button>
                <Button color="error" onClick={() => handleDelete(e.enrollmentID)}>
                  Delete
                </Button>
              </div>
            ),
          }))
        );
      })
      .catch((err) => console.error("Failed to fetch enrollments:", err));
  };

  const fetchKids = () => {
    axios
      .get("http://localhost:3001/kids", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setKids(res.data))
      .catch((err) => console.error("Failed to fetch kids:", err));
  };

  const fetchClasses = () => {
    axios
      .get("http://localhost:3001/classs", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setClasses(res.data))
      .catch((err) => console.error("Failed to fetch classes:", err));
  };

  const handleAdd = () => {
    setEnrollmentData({
      enrollmentID: "",
      data: "",
      enrollmentKidID: "",
      enrollmentClassID: "",
    });
    setDialogType("add");
    setOpenDialog(true);
  };

  const handleEdit = (enr) => {
    setEnrollmentData(enr);
    setDialogType("edit");
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/enrollments/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        alert("Enrollment deleted.");
        fetchEnrollments();
      })
      .catch((err) => console.error("Failed to delete enrollment:", err));
  };

  const handleSave = () => {
    const { enrollmentID, ...payload } = enrollmentData;
    const method = dialogType === "edit" ? "put" : "post";
    const url =
      dialogType === "edit"
        ? `http://localhost:3001/enrollments/${enrollmentID}`
        : "http://localhost:3001/enrollments";

    axios[method](url, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(() => {
        alert(dialogType === "edit" ? "Enrollment updated." : "Enrollment added.");
        setOpenDialog(false);
        fetchEnrollments();
      })
      .catch((err) => console.error("Save failed:", err));
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Enrollments
                </MDTypography>
                <Button
                  variant="contained"
                  color="info"
                  onClick={handleAdd}
                  style={{ marginTop: 20 }}
                >
                  Add Enrollment
                </Button>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{dialogType === "edit" ? "Edit Enrollment" : "Add Enrollment"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="date"
            label="Date"
            value={enrollmentData.data}
            onChange={(e) => setEnrollmentData({ ...enrollmentData, data: e.target.value })}
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />

          <TextField
            fullWidth
            select
            value={enrollmentData.enrollmentKidID}
            onChange={(e) =>
              setEnrollmentData({ ...enrollmentData, enrollmentKidID: e.target.value })
            }
            margin="normal"
            SelectProps={{ native: true }}
          >
            <option value="">Select Kid</option>
            {kids.map((k) => (
              <option key={k.kidID} value={k.kidID}>
                {k.emri} {k.mbiemri}
              </option>
            ))}
          </TextField>

          <TextField
            fullWidth
            select
            value={enrollmentData.enrollmentClassID}
            onChange={(e) =>
              setEnrollmentData({ ...enrollmentData, enrollmentClassID: e.target.value })
            }
            margin="normal"
            SelectProps={{ native: true }}
          >
            <option value="">Select Class</option>
            {classes.map((c) => (
              <option key={c.classID} value={c.classID}>
                {c.emri}
              </option>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="info">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default Enrollments;
