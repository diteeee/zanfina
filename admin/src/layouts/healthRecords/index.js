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

function HealthRecords() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [recordData, setRecordData] = useState({
    healthRecordID: "",
    alergjite: "",
    medicalConditions: "",
    gjaku: "",
    healthRecordKidID: "",
  });
  const [kids, setKids] = useState([]);

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
    fetchHealthRecords();
    fetchKids();
  }, []);

  const fetchHealthRecords = () => {
    axiosInstance
      .get("/healthRecords")
      .then((res) => {
        const healthRecords = res.data;
        const cols = [
          { Header: "Allergies", accessor: "alergjite", align: "left" },
          { Header: "Medical Conditions", accessor: "medicalConditions", align: "left" },
          { Header: "Blood Type", accessor: "gjaku", align: "center" },
          { Header: "Kid", accessor: "kidName", align: "left" },
          { Header: "Actions", accessor: "actions", align: "center" },
        ];
        setColumns(cols);

        const formattedRows = healthRecords.map((record) => ({
          alergjite: record.alergjite,
          medicalConditions: record.medicalConditions,
          gjaku: record.gjaku,
          kidName: record.Kid?.emri || "No Kid Assigned",
          actions: (
            <div>
              <Button color="primary" onClick={() => handleEdit(record)}>
                Edit
              </Button>
              <Button color="error" onClick={() => handleDelete(record.healthRecordID)}>
                Delete
              </Button>
            </div>
          ),
        }));

        setRows(formattedRows);
      })
      .catch((err) => console.error("Failed to fetch health records:", err));
  };

  const fetchKids = () => {
    axiosInstance
      .get("/kids")
      .then((res) => setKids(res.data))
      .catch((err) => console.error("Failed to fetch kids:", err));
  };

  const handleEdit = (record) => {
    setRecordData(record);
    setDialogType("edit");
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setRecordData({
      healthRecordID: "",
      alergjite: "",
      medicalConditions: "",
      gjaku: "",
      healthRecordKidID: "",
    });
    setDialogType("add");
    setOpenDialog(true);
  };

  const handleDelete = (healthRecordID) => {
    axiosInstance
      .delete(`/healthRecords/${healthRecordID}`)
      .then(() => {
        alert("Health record deleted.");
        fetchHealthRecords();
      })
      .catch((err) => console.error("Failed to delete health record:", err));
  };

  const handleSave = () => {
    const { healthRecordID, ...payload } = recordData;
    const method = dialogType === "edit" ? "put" : "post";
    const url = dialogType === "edit" ? `/healthRecords/${healthRecordID}` : "/healthRecords";

    axiosInstance[method](url, payload)
      .then(() => {
        alert(dialogType === "edit" ? "Health record updated." : "Health record added.");
        setOpenDialog(false);
        fetchHealthRecords();
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
                  Health Records
                </MDTypography>
                <Button
                  variant="contained"
                  color="info"
                  onClick={handleAdd}
                  style={{ marginTop: 20 }}
                >
                  Add Health Record
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
        <DialogTitle>
          {dialogType === "edit" ? "Edit Health Record" : "Add Health Record"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Allergies"
            value={recordData.alergjite}
            onChange={(e) => setRecordData({ ...recordData, alergjite: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Medical Conditions"
            value={recordData.medicalConditions}
            onChange={(e) => setRecordData({ ...recordData, medicalConditions: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Blood Type"
            value={recordData.gjaku}
            onChange={(e) => setRecordData({ ...recordData, gjaku: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            select
            label="Kid"
            value={recordData.healthRecordKidID}
            onChange={(e) => setRecordData({ ...recordData, healthRecordKidID: e.target.value })}
            margin="normal"
            SelectProps={{ native: true }}
          >
            <option value=""></option>
            {kids.map((kid) => (
              <option key={kid.kidID} value={kid.kidID}>
                {kid.emri}
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

export default HealthRecords;
