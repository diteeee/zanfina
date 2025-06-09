import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  FormControl,
  TextField,
} from "@mui/material";
import MKBox from "components/MKBox";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import { useUser } from "context/UserContext"; // Adjust path as needed

const HealthRecordPage = () => {
  const { user } = useUser();
  const [kids, setKids] = useState([]);
  const [selectedKidID, setSelectedKidID] = useState(null);
  const [healthRecord, setHealthRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch kids for the logged in user
  useEffect(() => {
    if (!user?.userID) return;

    const fetchKids = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/kids?parentID=${user.userID}`);

        console.log("Fetched kids data:", res.data);

        setKids(res.data);

        if (res.data.length > 0) {
          setSelectedKidID(res.data[0].kidID); // use kidID exactly
        } else {
          setSelectedKidID(null);
          setHealthRecord(null);
        }
      } catch (error) {
        console.error("Failed to fetch kids", error);
      }
    };

    fetchKids();
  }, [user]);

  // Fetch health record whenever selectedKidID changes
  useEffect(() => {
    if (!selectedKidID) return;

    const fetchHealthRecord = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3001/healthrecords/kid/${selectedKidID}`);

        console.log("Fetched health record:", res.data);

        setHealthRecord(res.data);
      } catch (err) {
        console.error("Failed to fetch health record", err);
        setHealthRecord(null);
      }
      setLoading(false);
    };

    fetchHealthRecord();
  }, [selectedKidID]);

  const handleKidChange = (event) => {
    setSelectedKidID(event.target.value);
  };

  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox
        sx={{
          paddingTop: "100px",
          paddingBottom: "40px",
          backgroundColor: "#fce4ec",
          minHeight: "100vh", // Ensures the background covers the entire viewport height
        }}
      >
        <Container>
          {kids.length > 0 && (
            <FormControl fullWidth sx={{ mb: 4 }}>
              <TextField
                fullWidth
                select
                variant="outlined"
                value={selectedKidID || ""}
                label="Select Kid"
                onChange={handleKidChange}
                style={{ marginTop: 20 }}
                SelectProps={{ native: true }}
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: "#ffccbc",
                    borderRadius: "12px",
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "Comic Sans MS, sans-serif",
                    color: "#ff7043",
                  },
                }}
              >
                {kids.map((kid) => (
                  <option key={kid.kidID} value={kid.kidID}>
                    {kid.emri} {kid.mbiemri}
                  </option>
                ))}
              </TextField>
            </FormControl>
          )}

          {loading ? (
            <Grid item xs={12} textAlign="center" sx={{ mt: 4 }}>
              <CircularProgress color="secondary" />
              <Typography
                variant="h6"
                mt={2}
                sx={{ fontFamily: "Comic Sans MS, sans-serif", color: "#d81b60" }}
              >
                Loading health record...
              </Typography>
            </Grid>
          ) : healthRecord ? (
            <Grid container justifyContent="center">
              <Grid item xs={12} sm={8} md={6}>
                <Card
                  sx={{
                    borderRadius: "16px",
                    backgroundColor: "#fff8e1",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{
                        fontFamily: "Comic Sans MS, sans-serif",
                        color: "#ff7043",
                        textAlign: "center",
                      }}
                    >
                      Health Record for {healthRecord.Kid?.emri || "Your Kid"}
                    </Typography>

                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{ fontFamily: "Comic Sans MS, sans-serif" }}
                    >
                      <strong>Allergies:</strong> {healthRecord.alergjite || "None"}
                    </Typography>

                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{ fontFamily: "Comic Sans MS, sans-serif" }}
                    >
                      <strong>Medical Conditions:</strong>{" "}
                      {healthRecord.medicalConditions || "None"}
                    </Typography>

                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{ fontFamily: "Comic Sans MS, sans-serif" }}
                    >
                      <strong>Blood Type:</strong> {healthRecord.gjaku || "Unknown"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : (
            <Typography
              variant="h6"
              mt={4}
              align="center"
              sx={{ fontFamily: "Comic Sans MS, sans-serif", color: "#d81b60" }}
            >
              No health record found for this kid.
            </Typography>
          )}
        </Container>
      </MKBox>
    </>
  );
};

export default HealthRecordPage;
