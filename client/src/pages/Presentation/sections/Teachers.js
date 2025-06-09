import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import MKBox from "components/MKBox";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3001/teachers");
      setTeachers(res.data);
    } catch (err) {
      console.error("Failed to fetch teachers", err);
    }
    setLoading(false);
  };

  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox
        sx={{
          paddingTop: "100px",
          paddingBottom: "40px",
          backgroundColor: "#e3f2fd",
          minHeight: "100vh", // Ensures the background covers the entire viewport height
        }}
      >
        <Container>
          {loading ? (
            <Grid item xs={12} textAlign="center" sx={{ mt: 4 }}>
              <CircularProgress color="primary" />
              <Typography
                variant="h6"
                mt={2}
                sx={{
                  fontFamily: "Comic Sans MS, sans-serif",
                  color: "#1976d2",
                }}
              >
                Loading teachers...
              </Typography>
            </Grid>
          ) : teachers.length > 0 ? (
            <Grid container spacing={3}>
              {teachers.map((teacher) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={teacher.teacherID}>
                  <Card
                    sx={{
                      borderRadius: "16px",
                      backgroundColor: "#ffffff",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    {teacher.imageURL && (
                      <CardMedia
                        component="img"
                        height="180"
                        image={teacher.imageURL}
                        alt={`${teacher.emri} ${teacher.mbiemri}`}
                        sx={{
                          borderRadius: "16px 16px 0 0",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          fontFamily: "Comic Sans MS, sans-serif",
                          color: "#0d47a1",
                          textAlign: "center",
                        }}
                      >
                        {teacher.emri} {teacher.mbiemri}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontFamily: "Comic Sans MS, sans-serif" }}
                      >
                        <strong>Phone:</strong> {teacher.nrTel}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                        sx={{ fontFamily: "Comic Sans MS, sans-serif" }}
                      >
                        <strong>Specialization:</strong> {teacher.specializimi}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography
              variant="h6"
              mt={4}
              align="center"
              sx={{
                fontFamily: "Comic Sans MS, sans-serif",
                color: "#1976d2",
              }}
            >
              No teachers found.
            </Typography>
          )}
        </Container>
      </MKBox>
    </>
  );
};

export default TeachersPage;
