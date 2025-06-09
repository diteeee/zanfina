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
import DataTable from "examples/Tables/DataTable";

function Meals() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [mealData, setMealData] = useState({
    mealID: "",
    emri: "",
    pershkrimi: "",
    orari: "",
  });

  // Get token from localStorage (adjust if token comes from elsewhere)
  const token = localStorage.getItem("token");

  // Axios instance with Bearer token header
  const axiosInstance = axios.create({
    baseURL: "http://localhost:3001",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = () => {
    axiosInstance
      .get("/meals")
      .then((res) => {
        const meals = res.data;
        setColumns([
          { Header: "Name", accessor: "emri", align: "left" },
          { Header: "Description", accessor: "pershkrimi", align: "left" },
          { Header: "Time", accessor: "orari", align: "left" },
          { Header: "Actions", accessor: "actions", align: "center" },
        ]);
        setRows(
          meals.map((m) => ({
            emri: m.emri,
            pershkrimi: m.pershkrimi,
            orari: m.orari,
            actions: (
              <div>
                <Button color="primary" onClick={() => handleEdit(m)}>
                  Edit
                </Button>
                <Button color="error" onClick={() => handleDelete(m.mealID)}>
                  Delete
                </Button>
              </div>
            ),
          }))
        );
      })
      .catch((err) => console.error("Failed to fetch meals:", err));
  };

  const handleAdd = () => {
    setMealData({ mealID: "", emri: "", pershkrimi: "", orari: "" });
    setDialogType("add");
    setOpenDialog(true);
  };

  const handleEdit = (meal) => {
    setMealData(meal);
    setDialogType("edit");
    setOpenDialog(true);
  };

  const handleDelete = (mealID) => {
    axiosInstance
      .delete(`/meals/${mealID}`)
      .then(() => {
        alert("Meal deleted.");
        fetchMeals();
      })
      .catch((err) => console.error("Failed to delete meal:", err));
  };

  const handleSave = () => {
    const { mealID, ...payload } = mealData;
    const method = dialogType === "edit" ? "put" : "post";
    const url = dialogType === "edit" ? `/meals/${mealID}` : "/meals";

    axiosInstance[method](url, payload)
      .then(() => {
        alert(dialogType === "edit" ? "Meal updated." : "Meal added.");
        setOpenDialog(false);
        fetchMeals();
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
                  Meals
                </MDTypography>
                <Button
                  variant="contained"
                  color="info"
                  onClick={handleAdd}
                  style={{ marginTop: 20 }}
                >
                  Add Meal
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
        <DialogTitle>{dialogType === "edit" ? "Edit Meal" : "Add Meal"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={mealData.emri}
            onChange={(e) => setMealData({ ...mealData, emri: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={mealData.pershkrimi}
            onChange={(e) => setMealData({ ...mealData, pershkrimi: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Time"
            type="time"
            value={mealData.orari}
            onChange={(e) => setMealData({ ...mealData, orari: e.target.value })}
            InputLabelProps={{ shrink: true }}
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

export default Meals;
