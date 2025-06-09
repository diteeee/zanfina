import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";

// Material Kit 2 React examples
import RotatingCard from "examples/Cards/RotatingCard";
import RotatingCardFront from "examples/Cards/RotatingCard/RotatingCardFront";
import RotatingCardBack from "examples/Cards/RotatingCard/RotatingCardBack";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";

// Images
import bgFront from "assets/images/rotating-card-bg-front.jpeg";
import bgBack from "assets/images/rotating-card-bg-back.jpeg";
import { useUser } from "context/UserContext";

function Information() {
  const { user } = useUser();
  const role = user ? user.role : "guest";
  const token = localStorage.getItem("token");

  return (
    <MKBox component="section" py={6} my={6}>
      <Container>
        <Grid container item xs={11} spacing={4} alignItems="center" sx={{ mx: "auto" }}>
          <Grid item xs={12} lg={4} sx={{ mx: "auto" }}>
            <RotatingCard>
              <RotatingCardFront
                image={bgFront}
                icon="child_care"
                title={
                  <>
                    Nurturing
                    <br />
                    Bright Futures
                  </>
                }
                description="At Sunflowers Kindergarten, we nurture curiosity and creativity with a curriculum designed for young dreamers."
                customGradient="linear-gradient(135deg, rgba(255, 222, 233, 0.95) 0%, rgba(130, 200, 210, 0.95) 100%)"
                sx={{
                  color: "#1a2733", // Dark text for front side
                }}
              />

              <RotatingCardBack
                image={bgBack}
                title={
                  role === "Admin"
                    ? "Go to Dashboard"
                    : role === "User"
                    ? "Welcome Back!"
                    : "Join Our Family"
                }
                description={
                  role === "Admin"
                    ? "Manage and grow the kindergarten community."
                    : role === "User"
                    ? "Thank you for being part of our community."
                    : "A joyful start to learning where every child feels at home."
                }
                action={
                  role === "Admin"
                    ? {
                        type: "internal",
                        route: `http://localhost:3006/dashboard?token=${token}`,
                        label: "Go to Dashboard",
                      }
                    : role !== "User" && {
                        type: "internal",
                        route: "/pages/authentication/sign-up",
                        label: "Sign up",
                      }
                }
                sx={{
                  backgroundImage:
                    "linear-gradient(135deg, rgba(30, 30, 50, 0.85) 0%, rgba(40, 60, 90, 0.85) 100%)", // Much darker gradient on back side
                  color: "#e0e7f1", // Light text color for contrast on dark background
                }}
              />
            </RotatingCard>
          </Grid>
          <Grid item xs={12} lg={7} sx={{ ml: "auto" }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <DefaultInfoCard
                  icon="school"
                  title="Engaging Teachers"
                  description="Our passionate educators inspire curiosity and foster a love of learning in every child."
                  color="primary" // Bright and lively color for kindergarten vibe
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DefaultInfoCard
                  icon="palette"
                  title="Creative Activities"
                  description="Through art, music, and crafts, every day is filled with new opportunities to explore creativity."
                  color="info" // Another playful color to complement
                />
              </Grid>
            </Grid>
            <Grid container spacing={4} sx={{ mt: { xs: 0, md: 6 } }}>
              <Grid item xs={12} md={6}>
                <DefaultInfoCard
                  icon="local_florist"
                  title="Outdoor Adventures"
                  description="Explore the wonders of nature with safe and fun outdoor experiences."
                  color="success" // Fresh and cheerful green
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DefaultInfoCard
                  icon="favorite"
                  title="Caring Environment"
                  description="We create a loving and safe space where every child feels valued and happy."
                  color="primary" // Warm and inviting red/pink
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Information;
