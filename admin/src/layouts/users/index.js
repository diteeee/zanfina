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

function Users() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [userData, setUserData] = useState({
    userID: "",
    username: "",
    email: "",
    password: "",
    role: "User", // Default role
  });

  // Get token from localStorage (adjust if token is stored elsewhere)
  const token = localStorage.getItem("token");

  // Axios instance with Authorization header
  const axiosInstance = axios.create({
    baseURL: "http://localhost:3001",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axiosInstance
      .get("/users")
      .then((res) => {
        const users = res.data;
        const cols = [
          { Header: "Username", accessor: "username", align: "left" },
          { Header: "Email", accessor: "email", align: "left" },
          { Header: "Role", accessor: "role", align: "left" },
          { Header: "Actions", accessor: "actions", align: "center" },
        ];
        setColumns(cols);

        const formattedRows = users.map((user) => ({
          username: user.username,
          email: user.email,
          role: user.role,
          actions: (
            <div>
              <Button color="primary" onClick={() => handleEdit(user)}>
                Edit
              </Button>
              <Button color="error" onClick={() => handleDelete(user.userID)}>
                Delete
              </Button>
            </div>
          ),
        }));

        setRows(formattedRows);
      })
      .catch((err) => console.error("Failed to fetch users:", err));
  };

  const handleEdit = (user) => {
    setUserData(user);
    setDialogType("edit");
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setUserData({
      userID: "",
      username: "",
      email: "",
      password: "",
      role: "User", // Default role for adding a new user
    });
    setDialogType("add");
    setOpenDialog(true);
  };

  const handleDelete = (userID) => {
    axiosInstance
      .delete(`/users/${userID}`)
      .then(() => {
        alert("User deleted.");
        fetchUsers();
      })
      .catch((err) => console.error("Failed to delete user:", err));
  };

  const handleSave = () => {
    const { userID, ...payload } = userData;
    const method = dialogType === "edit" ? "put" : "post";
    const url = dialogType === "edit" ? `/users/${userID}` : "/users";

    axiosInstance[method](url, payload)
      .then(() => {
        alert(dialogType === "edit" ? "User updated." : "User added.");
        setOpenDialog(false);
        fetchUsers();
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
                  Users
                </MDTypography>
                <Button
                  variant="contained"
                  color="info"
                  onClick={handleAdd}
                  style={{ marginTop: 20 }}
                >
                  Add User
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

      {/* Dialog for Add/Edit */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{dialogType === "edit" ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Username"
            value={userData.username}
            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            select
            label="Role"
            variant="outlined"
            value={userData.role}
            onChange={(e) => setUserData({ ...userData, role: e.target.value })}
            margin="normal"
            SelectProps={{
              native: true,
            }}
          >
            <option value=""></option>
            <option value="User">user</option>
            <option value="Admin">admin</option>
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

export default Users;
