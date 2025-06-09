import React from "react";
// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";

// Routes
import routes from "routes";

// Images
import bgImage from "assets/images/kindergarten-bg.jpg"; // Replace with a cheerful background related to kids or sunflowers

function AboutUs() {
  return (
    <>
      <DefaultNavbar routes={routes} />
      <MKBox
        minHeight="50vh"
        width="100%"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.4),
              rgba(gradients.info.state, 0.4)
            )}, url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Container>
          <Grid
            container
            item
            xs={12}
            lg={8}
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            sx={{ textAlign: "center" }}
          >
            <MKTypography
              variant="h2"
              color="white"
              gutterBottom
              sx={{
                fontFamily: "Comic Sans MS, cursive",
                fontWeight: "bold",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
              }}
            >
              Welcome to Sunflowers Kindergarten
            </MKTypography>
            <MKTypography
              variant="body1"
              color="white"
              opacity={0.9}
              mt={1}
              mb={3}
              sx={{ fontFamily: "Comic Sans MS, cursive" }}
            >
              A place where learning blooms and childhood memories are made!
            </MKTypography>
          </Grid>
        </Container>
      </MKBox>
      <Card
        sx={{
          p: 3,
          mx: { xs: 2, lg: 3 },
          mt: -6,
          mb: 6,
          borderRadius: "20px",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        <MKBox p={3}>
          <MKTypography
            variant="h4"
            textAlign="center"
            gutterBottom
            sx={{
              fontFamily: "Comic Sans MS, cursive",
              color: "#FFA000",
            }}
          >
            About Us
          </MKTypography>
          <MKTypography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            mb={3}
            sx={{ fontFamily: "Comic Sans MS, cursive" }}
          >
            Sunflowers Kindergarten is dedicated to nurturing young minds with love, care, and an
            engaging curriculum. Our mission is to create a safe and joyful environment where kids
            can grow, learn, and play together.
          </MKTypography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={6}>
              <MKTypography
                variant="body1"
                color="text.primary"
                textAlign="center"
                sx={{ fontFamily: "Comic Sans MS, cursive" }}
              >
                🌻 <strong>Experienced and caring teachers</strong>
              </MKTypography>
              <MKTypography
                variant="body1"
                color="text.primary"
                textAlign="center"
                sx={{ fontFamily: "Comic Sans MS, cursive" }}
              >
                🌻 <strong>Fun and interactive learning</strong>
              </MKTypography>
              <MKTypography
                variant="body1"
                color="text.primary"
                textAlign="center"
                sx={{ fontFamily: "Comic Sans MS, cursive" }}
              >
                🌻 <strong>A nurturing environment for your child</strong>
              </MKTypography>
            </Grid>
          </Grid>
        </MKBox>
        <MKBox p={3} mt={4}>
          <MKTypography
            variant="h4"
            textAlign="center"
            gutterBottom
            sx={{
              fontFamily: "Comic Sans MS, cursive",
              color: "#FFA000",
            }}
          >
            Daily Schedule
          </MKTypography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={8}>
              {[
                { time: "08:00 AM", activity: "Arrival and Free Play" },
                { time: "09:00 AM", activity: "Morning Circle Time" },
                { time: "10:00 AM", activity: "Arts and Crafts" },
                { time: "11:30 AM", activity: "Snack Time" },
                { time: "12:00 PM", activity: "Outdoor Play" },
                { time: "01:00 PM", activity: "Lunch and Rest" },
                { time: "02:30 PM", activity: "Story Time" },
                { time: "03:00 PM", activity: "Pickup" },
              ].map(({ time, activity }, index) => (
                <MKTypography
                  key={index}
                  variant="body1"
                  color="text.primary"
                  textAlign="center"
                  mb={1}
                  sx={{
                    fontFamily: "Comic Sans MS, cursive",
                    fontWeight: "bold",
                    color: index % 2 === 0 ? "#4CAF50" : "#FFC107",
                  }}
                >
                  🕒 <strong>{time}</strong> - {activity}
                </MKTypography>
              ))}
            </Grid>
          </Grid>
        </MKBox>
      </Card>
    </>
  );
}

export default AboutUs;
