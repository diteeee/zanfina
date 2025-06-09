import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";

// Presentation page sections
import Information from "pages/Presentation/sections/Information";

// Routes
import routes from "routes";
import footerRoutes from "footer.routes";

// Images
import bgImage from "assets/images/bg-presentation.jpg";

// Example images for cards — replace with your actual images!
import diningImage from "assets/images/dining-area.jpg";
import playgroundImage from "assets/images/playground.jpg";
import artClassImage from "assets/images/art-class.jpg";
import musicRoomImage from "assets/images/music-room.jpg";

function Presentation() {
  const cardData = [
    { title: "Dining Area 🍽️", image: diningImage },
    { title: "Playground 🛝", image: playgroundImage },
    { title: "Art Class 🎨", image: artClassImage },
    { title: "Music Room 🎵", image: musicRoomImage },
  ];

  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox
        minHeight="75vh"
        width="100%"
        sx={{
          backgroundImage: `linear-gradient(rgba(255, 243, 176, 0.7), rgba(255, 204, 204, 0.8)), url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Container>
          <Grid container item xs={12} lg={7} justifyContent="center" mx="auto">
            <MKTypography
              variant="h1"
              color="white"
              mt={-6}
              mb={1}
              sx={({ breakpoints, typography: { size } }) => ({
                [breakpoints.down("md")]: {
                  fontSize: size["3xl"],
                },
              })}
            >
              Sunflower Kindergarten 🌻
            </MKTypography>
            <MKTypography
              variant="body1"
              color="white"
              textAlign="center"
              px={{ xs: 6, lg: 12 }}
              mt={1}
            >
              Where little stars shine brightly and learning feels like a magical adventure!
            </MKTypography>
          </Grid>
        </Container>
      </MKBox>
      <Card
        sx={{
          p: 3,
          mx: { xs: 2, lg: 3 },
          mt: -8,
          mb: 4,
          backgroundColor: ({ palette: { white }, functions: { rgba } }) => rgba(white.main, 0.85),
          backdropFilter: "saturate(200%) blur(30px)",
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
          borderRadius: "20px",
        }}
      >
        <Information />

        {/* Cards Section */}
        <MKBox pt={6} pb={3}>
          <Container>
            <Grid container spacing={3} justifyContent="center">
              {cardData.map(({ title, image }) => (
                <Grid item xs={12} sm={6} md={3} key={title}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: "20px",
                      overflow: "hidden",
                      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                      cursor: "pointer",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  >
                    <MKBox
                      component="img"
                      src={image}
                      alt={title}
                      width="100%"
                      height="200px"
                      sx={{
                        objectFit: "cover",
                        borderBottom: "3px solid #FFD700",
                      }}
                    />
                    <MKBox p={2} textAlign="center">
                      <MKTypography variant="h6" fontWeight="bold" color="primary">
                        {title}
                      </MKTypography>
                    </MKBox>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </MKBox>

        <MKBox pt={10} pb={6}>
          <Container>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={5} mx="auto" sx={{ textAlign: "center" }}>
                <MKTypography variant="h4" fontWeight="bold" mb={0.5}>
                  Thank you for visiting! 🌟
                </MKTypography>
                <MKTypography variant="body1" color="text.secondary">
                  Making unforgettable memories together!
                </MKTypography>
              </Grid>
            </Grid>
          </Container>
        </MKBox>
      </Card>
      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default Presentation;
