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

function Kids() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [kidData, setKidData] = useState({
    kidID: "",
    emri: "",
    mbiemri: "",
    ditelindja: "",
    parentID: "",
  });
  const [parents, setParents] = useState([]);

  // Axios instance with auth header
  const axiosInstance = axios.create({
    baseURL: "http://localhost:3001",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace "token" with the correct key if different
    },
  });

  useEffect(() => {
    fetchKids();
    fetchParents();
  }, []);

  const fetchKids = () => {
    axiosInstance
      .get("/kids")
      .then((res) => {
        const kids = res.data;
        const cols = [
          { Header: "First Name", accessor: "emri", align: "left" },
          { Header: "Last Name", accessor: "mbiemri", align: "left" },
          { Header: "Birthday", accessor: "ditelindja", align: "left" },
          { Header: "Parent", accessor: "parentName", align: "left" },
          { Header: "Actions", accessor: "actions", align: "center" },
        ];
        setColumns(cols);

        const formattedRows = kids.map((kid) => ({
          emri: kid.emri,
          mbiemri: kid.mbiemri,
          ditelindja: kid.ditelindja,
          parentName: kid.User?.username || "No Parent Assigned",
          actions: (
            <div>
              <Button color="primary" onClick={() => handleEdit(kid)}>
                Edit
              </Button>
              <Button color="error" onClick={() => handleDelete(kid.kidID)}>
                Delete
              </Button>
            </div>
          ),
        }));

        setRows(formattedRows);
      })
      .catch((err) => console.error("Failed to fetch kids:", err));
  };

  const fetchParents = () => {
    axiosInstance
      .get("/users")
      .then((res) => {
        console.log("Fetched Parents:", res.data);
        setParents(res.data);
      })
      .catch((err) => console.error("Failed to fetch parents:", err));
  };

  const handleEdit = (kid) => {
    setKidData(kid);
    setDialogType("edit");
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setKidData({ kidID: "", emri: "", mbiemri: "", ditelindja: "", parentID: "" });
    setDialogType("add");
    setOpenDialog(true);
  };

  const handleDelete = (kidID) => {
    axiosInstance
      .delete(`/kids/${kidID}`)
      .then(() => {
        alert("Kid deleted.");
        fetchKids();
      })
      .catch((err) => console.error("Failed to delete kid:", err));
  };

  const handleSave = () => {
    const { kidID, ...payload } = kidData;
    const method = dialogType === "edit" ? "put" : "post";
    const url = dialogType === "edit" ? `/kids/${kidID}` : "/kids";

    axiosInstance[method](url, payload)
      .then(() => {
        alert(dialogType === "edit" ? "Kid updated." : "Kid added.");
        setOpenDialog(false);
        fetchKids();
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
                  Kids
                </MDTypography>
                <Button
                  variant="contained"
                  color="info"
                  onClick={handleAdd}
                  style={{ marginTop: 20 }}
                >
                  Add Kid
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
        <DialogTitle>{dialogType === "edit" ? "Edit Kid" : "Add Kid"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="First Name"
            value={kidData.emri}
            onChange={(e) => setKidData({ ...kidData, emri: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Last Name"
            value={kidData.mbiemri}
            onChange={(e) => setKidData({ ...kidData, mbiemri: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            type="date"
            value={kidData.ditelindja}
            onChange={(e) => setKidData({ ...kidData, ditelindja: e.target.value })}
            margin="normal"
          />

          <TextField
            fullWidth
            select
            label="Parent"
            value={kidData.parentID}
            onChange={(e) => setKidData({ ...kidData, parentID: e.target.value })}
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

export default Kids;
