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

function Feedbacks() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [feedbackData, setFeedbackData] = useState({
    feedbackID: "",
    teksti: "",
    rating: "",
    parentID: "",
  });
  const [parents, setParents] = useState([]);

  useEffect(() => {
    fetchFeedbacks();
    fetchParents();
  }, []);

  const fetchFeedbacks = () => {
    axios
      .get("http://localhost:3001/feedbacks")
      .then((res) => {
        const feedbacks = res.data;
        const cols = [
          { Header: "Text", accessor: "teksti", align: "left" },
          { Header: "Rating", accessor: "rating", align: "center" },
          { Header: "Parent", accessor: "parentName", align: "left" },
          { Header: "Actions", accessor: "actions", align: "center" },
        ];
        setColumns(cols);

        const formattedRows = feedbacks.map((feedback) => ({
          teksti: feedback.teksti,
          rating: feedback.rating,
          parentName: feedback.User?.username || "No Parent Assigned",
          actions: (
            <div>
              <Button color="primary" onClick={() => handleEdit(feedback)}>
                Edit
              </Button>
              <Button color="error" onClick={() => handleDelete(feedback.feedbackID)}>
                Delete
              </Button>
            </div>
          ),
        }));

        setRows(formattedRows);
      })
      .catch((err) => console.error("Failed to fetch feedbacks:", err));
  };

  const fetchParents = () => {
    axios
      .get("http://localhost:3001/users")
      .then((res) => setParents(res.data))
      .catch((err) => console.error("Failed to fetch parents:", err));
  };

  const handleEdit = (feedback) => {
    setFeedbackData(feedback);
    setDialogType("edit");
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setFeedbackData({ feedbackID: "", teksti: "", rating: "", parentID: "" });
    setDialogType("add");
    setOpenDialog(true);
  };

  const handleDelete = (feedbackID) => {
    axios
      .delete(`http://localhost:3001/feedbacks/${feedbackID}`)
      .then(() => {
        alert("Feedback deleted.");
        fetchFeedbacks();
      })
      .catch((err) => console.error("Failed to delete feedback:", err));
  };

  const handleSave = () => {
    const { feedbackID, ...payload } = feedbackData;
    const method = dialogType === "edit" ? "put" : "post";
    const url =
      dialogType === "edit"
        ? `http://localhost:3001/feedbacks/${feedbackID}`
        : "http://localhost:3001/feedbacks";

    axios[method](url, payload)
      .then(() => {
        alert(dialogType === "edit" ? "Feedback updated." : "Feedback added.");
        setOpenDialog(false);
        fetchFeedbacks();
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
                  Feedbacks
                </MDTypography>
                <Button
                  variant="contained"
                  color="info"
                  onClick={handleAdd}
                  style={{ marginTop: 20 }}
                >
                  Add Feedback
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
        <DialogTitle>{dialogType === "edit" ? "Edit Feedback" : "Add Feedback"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Text"
            value={feedbackData.teksti}
            onChange={(e) => setFeedbackData({ ...feedbackData, teksti: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Rating"
            value={feedbackData.rating}
            onChange={(e) => setFeedbackData({ ...feedbackData, rating: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            select
            label="Parent"
            value={feedbackData.parentID}
            onChange={(e) => setFeedbackData({ ...feedbackData, parentID: e.target.value })}
            margin="normal"
            SelectProps={{ native: true }}
          >
            <option value=""></option>
            {parents.map((parent) => (
              <option key={parent.userID} value={parent.userID}>
                {parent.username}
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

export default Feedbacks;
