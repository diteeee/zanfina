import { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

function Classs() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [classData, setClassData] = useState({
    classID: "",
    emri: "",
    orari: "",
    classTeacherID: "",
  });
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetchClasss();
    fetchTeachers();
  }, []);

  const fetchClasss = () => {
    axios
      .get("http://localhost:3001/classs")
      .then((res) => {
        const classs = res.data;
        const cols = [
          { Header: "Class Name", accessor: "emri", align: "left" },
          { Header: "Schedule", accessor: "orari", align: "left" },
          { Header: "Teacher", accessor: "teacherName", align: "left" },
          { Header: "Actions", accessor: "actions", align: "center" },
        ];
        setColumns(cols);

        const formattedRows = classs.map((cls) => ({
          emri: cls.emri,
          orari: cls.orari,
          teacherName: cls.Teacher?.emri || "No Teacher Assigned",
          actions: (
            <div>
              <Button color="primary" onClick={() => handleEdit(cls)}>
                Edit
              </Button>
              <Button color="error" onClick={() => handleDelete(cls.classID)}>
                Delete
              </Button>
            </div>
          ),
        }));

        setRows(formattedRows);
      })
      .catch((err) => console.error("Failed to fetch classs:", err));
  };

  const fetchTeachers = () => {
    axios
      .get("http://localhost:3001/teachers")
      .then((res) => setTeachers(res.data))
      .catch((err) => console.error("Failed to fetch teachers:", err));
  };

  const handleEdit = (cls) => {
    setClassData(cls);
    setDialogType("edit");
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setClassData({
      classID: "",
      emri: "",
      orari: "",
      classTeacherID: "",
    });
    setDialogType("add");
    setOpenDialog(true);
  };

  const handleDelete = (classID) => {
    axios
      .delete(`http://localhost:3001/classs/${classID}`)
      .then(() => {
        alert("Class deleted.");
        fetchClasss();
      })
      .catch((err) => console.error("Failed to delete class:", err));
  };

  const handleSave = () => {
    const { classID, ...payload } = classData;
    const method = dialogType === "edit" ? "put" : "post";
    const url =
      dialogType === "edit"
        ? `http://localhost:3001/classs/${classID}`
        : "http://localhost:3001/classs";

    axios[method](url, payload)
      .then(() => {
        alert(dialogType === "edit" ? "Class updated." : "Class added.");
        setOpenDialog(false);
        fetchClasss();
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
                  Classes
                </MDTypography>
                <Button
                  variant="contained"
                  color="info"
                  onClick={handleAdd}
                  style={{ marginTop: 20 }}
                >
                  Add Class
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
        <DialogTitle>{dialogType === "edit" ? "Edit Class" : "Add Class"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Class Name"
            value={classData.emri}
            onChange={(e) => setClassData({ ...classData, emri: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Schedule"
            value={classData.orari}
            onChange={(e) => setClassData({ ...classData, orari: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            select
            variant="outlined"
            value={classData.classTeacherID}
            onChange={(e) => setClassData({ ...classData, classTeacherID: e.target.value })}
            style={{ marginTop: 20 }}
            SelectProps={{ native: true }}
          >
            <option value="Select Teacher"></option>
            {teachers.map((teacher) => (
              <option key={teacher.teacherID} value={teacher.teacherID}>
                {teacher.emri}
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

export default Classs;
