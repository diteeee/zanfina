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

function Activities() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [activityData, setActivityData] = useState({
    activityID: "",
    emri: "",
    pershkrimi: "",
    data: "",
    activityTeacherID: "",
  });
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetchActivities();
    fetchTeachers();
  }, []);

  const fetchActivities = () => {
    axios
      .get("http://localhost:3001/activities")
      .then((res) => {
        const activities = res.data;
        const cols = [
          { Header: "Name", accessor: "emri", align: "left" },
          { Header: "Description", accessor: "pershkrimi", align: "left" },
          { Header: "Date", accessor: "data", align: "left" },
          { Header: "Teacher", accessor: "teacherName", align: "left" },
          { Header: "Actions", accessor: "actions", align: "center" },
        ];
        setColumns(cols);

        const formattedRows = activities.map((activity) => ({
          emri: activity.emri,
          pershkrimi: activity.pershkrimi,
          data: activity.data,
          teacherName: activity.Teacher?.emri || "No Teacher Assigned",
          actions: (
            <div>
              <Button color="primary" onClick={() => handleEdit(activity)}>
                Edit
              </Button>
              <Button color="error" onClick={() => handleDelete(activity.activityID)}>
                Delete
              </Button>
            </div>
          ),
        }));

        setRows(formattedRows);
      })
      .catch((err) => console.error("Failed to fetch activities:", err));
  };

  const fetchTeachers = () => {
    axios
      .get("http://localhost:3001/teachers")
      .then((res) => {
        setTeachers(res.data);
      })
      .catch((err) => console.error("Failed to fetch teachers:", err));
  };

  const handleEdit = (activity) => {
    setActivityData(activity);
    setDialogType("edit");
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setActivityData({ activityID: "", emri: "", pershkrimi: "", data: "", activityTeacherID: "" });
    setDialogType("add");
    setOpenDialog(true);
  };

  const handleDelete = (activityID) => {
    axios
      .delete(`http://localhost:3001/activities/${activityID}`)
      .then(() => {
        alert("Activity deleted.");
        fetchActivities();
      })
      .catch((err) => console.error("Failed to delete activity:", err));
  };

  const handleSave = () => {
    const { activityID, ...payload } = activityData;
    const method = dialogType === "edit" ? "put" : "post";
    const url =
      dialogType === "edit"
        ? `http://localhost:3001/activities/${activityID}`
        : "http://localhost:3001/activities";

    axios[method](url, payload)
      .then(() => {
        alert(dialogType === "edit" ? "Activity updated." : "Activity added.");
        setOpenDialog(false);
        fetchActivities();
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
                  Activities
                </MDTypography>
                <Button
                  variant="contained"
                  color="info"
                  onClick={handleAdd}
                  style={{ marginTop: 20 }}
                >
                  Add Activity
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{dialogType === "edit" ? "Edit Activity" : "Add Activity"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={activityData.emri}
            onChange={(e) => setActivityData({ ...activityData, emri: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={activityData.pershkrimi}
            onChange={(e) => setActivityData({ ...activityData, pershkrimi: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            type="date"
            value={activityData.data}
            onChange={(e) => setActivityData({ ...activityData, data: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            select
            label="Teacher"
            value={activityData.activityTeacherID}
            onChange={(e) =>
              setActivityData({ ...activityData, activityTeacherID: e.target.value })
            }
            margin="normal"
            SelectProps={{ native: true }}
          >
            <option value=""></option>
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

export default Activities;
