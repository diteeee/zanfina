import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import MKBox from "components/MKBox";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";

const MealsPage = () => {
  const [mealsByDay, setMealsByDay] = useState({});
  const [loading, setLoading] = useState(false);

  const daysMap = {
    "E Hene": "Monday",
    "E Marte": "Tuesday",
    "E Merkure": "Wednesday",
    "E Enjte": "Thursday",
    "E Premte": "Friday",
    "E Shtune": "Saturday",
    "E Diel": "Sunday",
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3001/meals");
      const meals = res.data;
      const groupedMeals = groupMealsByDay(meals);
      setMealsByDay(groupedMeals);
    } catch (err) {
      console.error("Failed to fetch meals", err);
    }
    setLoading(false);
  };

  const groupMealsByDay = (meals) => {
    const grouped = {};
    meals.forEach((meal) => {
      const day = meal.pershkrimi; // Assuming pershkrimi contains the day
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push(meal);
    });
    return grouped;
  };

  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox
        sx={{
          paddingTop: "100px",
          paddingBottom: "40px",
          backgroundColor: "#e3f2fd",
          minHeight: "100vh",
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
                Loading meals...
              </Typography>
            </Grid>
          ) : Object.keys(mealsByDay).length > 0 ? (
            Object.keys(daysMap).map((day) => (
              <Box key={day} sx={{ mb: 4 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: "Comic Sans MS, sans-serif",
                    color: "#0d47a1",
                    mb: 2,
                  }}
                >
                  {day}
                </Typography>
                <Grid container spacing={3}>
                  {mealsByDay[day]?.map((meal) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={meal.id}>
                      <Card
                        sx={{
                          borderRadius: "16px",
                          backgroundColor: "#ffffff",
                          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                        }}
                      >
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
                            {meal.emri}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontFamily: "Comic Sans MS, sans-serif" }}
                          >
                            <strong>Week Day:</strong> {meal.pershkrimi}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                            sx={{ fontFamily: "Comic Sans MS, sans-serif" }}
                          >
                            <strong>Schedule:</strong> {meal.orari}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))
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
              No meals found.
            </Typography>
          )}
        </Container>
      </MKBox>
    </>
  );
};

export default MealsPage;
