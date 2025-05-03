import { useEffect, useState } from "react";
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
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

function Teachers() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [teacherData, setTeacherData] = useState({
    teacherID: "",
    emri: "",
    mbiemri: "",
    nrTel: "",
    specializimi: "",
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = () => {
    axios
      .get("http://localhost:3001/teachers")
      .then((res) => {
        const teachers = res.data;
        const cols = [
          { Header: "First Name", accessor: "emri", align: "left" },
          { Header: "Last Name", accessor: "mbiemri", align: "left" },
          { Header: "Phone Number", accessor: "nrTel", align: "left" },
          { Header: "Specialization", accessor: "specializimi", align: "left" },
          { Header: "Actions", accessor: "actions", align: "center" },
        ];
        setColumns(cols);

        const formattedRows = teachers.map((teacher) => ({
          emri: teacher.emri,
          mbiemri: teacher.mbiemri,
          nrTel: teacher.nrTel,
          specializimi: teacher.specializimi,
          actions: (
            <div>
              <Button color="primary" onClick={() => handleEdit(teacher)}>
                Edit
              </Button>
              <Button color="error" onClick={() => handleDelete(teacher.teacherID)}>
                Delete
              </Button>
            </div>
          ),
        }));

        setRows(formattedRows);
      })
      .catch((err) => console.error("Failed to fetch teachers:", err));
  };

  const handleEdit = (teacher) => {
    setTeacherData(teacher);
    setDialogType("edit");
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setTeacherData({
      teacherID: "",
      emri: "",
      mbiemri: "",
      nrTel: "",
      specializimi: "",
    });
    setDialogType("add");
    setOpenDialog(true);
  };

  const handleDelete = (teacherID) => {
    axios
      .delete(`http://localhost:3001/teachers/${teacherID}`)
      .then(() => {
        alert("Teacher deleted.");
        fetchTeachers();
      })
      .catch((err) => console.error("Failed to delete teacher:", err));
  };

  const handleSave = () => {
    const { teacherID, ...payload } = teacherData;
    const method = dialogType === "edit" ? "put" : "post";
    const url =
      dialogType === "edit"
        ? `http://localhost:3001/teachers/${teacherID}`
        : "http://localhost:3001/teachers";

    axios[method](url, payload)
      .then(() => {
        alert(dialogType === "edit" ? "Teacher updated." : "Teacher added.");
        setOpenDialog(false);
        fetchTeachers();
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
                  Teachers
                </MDTypography>
                <Button
                  variant="contained"
                  color="info"
                  onClick={handleAdd}
                  style={{ marginTop: 20 }}
                >
                  Add Teacher
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
      <Footer />

      {/* Dialog for Add/Edit */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{dialogType === "edit" ? "Edit Teacher" : "Add Teacher"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="First Name"
            value={teacherData.emri}
            onChange={(e) => setTeacherData({ ...teacherData, emri: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Last Name"
            value={teacherData.mbiemri}
            onChange={(e) => setTeacherData({ ...teacherData, mbiemri: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Phone Number"
            value={teacherData.nrTel}
            onChange={(e) => setTeacherData({ ...teacherData, nrTel: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Specialization"
            value={teacherData.specializimi}
            onChange={(e) => setTeacherData({ ...teacherData, specializimi: e.target.value })}
            margin="normal"
          />
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

export default Teachers;
