import React, { useEffect, useState } from "react";
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

function Supplies() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [supplyData, setSupplyData] = useState({
    supplyID: "",
    emri: "",
    sasia: "",
    supplyClassID: "",
  });
  const [classes, setClasses] = useState([]);

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
    fetchSupplies();
    fetchClasses();
  }, []);

  const fetchSupplies = () => {
    axiosInstance
      .get("/supplies")
      .then((res) => {
        const supplies = res.data;
        const cols = [
          { Header: "Name", accessor: "emri", align: "left" },
          { Header: "Quantity", accessor: "sasia", align: "center" },
          { Header: "Class", accessor: "className", align: "left" },
          { Header: "Actions", accessor: "actions", align: "center" },
        ];
        setColumns(cols);

        const formattedRows = supplies.map((supply) => ({
          emri: supply.emri,
          sasia: supply.sasia,
          className: supply.Class?.emri || "No Class Assigned",
          actions: (
            <div>
              <Button color="primary" onClick={() => handleEdit(supply)}>
                Edit
              </Button>
              <Button color="error" onClick={() => handleDelete(supply.supplyID)}>
                Delete
              </Button>
            </div>
          ),
        }));

        setRows(formattedRows);
      })
      .catch((err) => console.error("Failed to fetch supplies:", err));
  };

  const fetchClasses = () => {
    axiosInstance
      .get("/classs")
      .then((res) => setClasses(res.data))
      .catch((err) => console.error("Failed to fetch classes:", err));
  };

  const handleEdit = (supply) => {
    setSupplyData(supply);
    setDialogType("edit");
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setSupplyData({ supplyID: "", emri: "", sasia: "", supplyClassID: "" });
    setDialogType("add");
    setOpenDialog(true);
  };

  const handleDelete = (supplyID) => {
    axiosInstance
      .delete(`/supplies/${supplyID}`)
      .then(() => {
        alert("Supply deleted.");
        fetchSupplies();
      })
      .catch((err) => console.error("Failed to delete supply:", err));
  };

  const handleSave = () => {
    const { supplyID, ...payload } = supplyData;
    const method = dialogType === "edit" ? "put" : "post";
    const url = dialogType === "edit" ? `/supplies/${supplyID}` : "/supplies";

    axiosInstance[method](url, payload)
      .then(() => {
        alert(dialogType === "edit" ? "Supply updated." : "Supply added.");
        setOpenDialog(false);
        fetchSupplies();
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
                  Supplies
                </MDTypography>
                <Button
                  variant="contained"
                  color="info"
                  onClick={handleAdd}
                  style={{ marginTop: 20 }}
                >
                  Add Supply
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
        <DialogTitle>{dialogType === "edit" ? "Edit Supply" : "Add Supply"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={supplyData.emri}
            onChange={(e) => setSupplyData({ ...supplyData, emri: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Quantity"
            value={supplyData.sasia}
            onChange={(e) => setSupplyData({ ...supplyData, sasia: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            select
            label="Class"
            value={supplyData.supplyClassID}
            onChange={(e) => setSupplyData({ ...supplyData, supplyClassID: e.target.value })}
            margin="normal"
            SelectProps={{ native: true }}
          >
            <option value=""></option>
            {classes.map((cls) => (
              <option key={cls.classID} value={cls.classID}>
                {cls.emri}
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

export default Supplies;
