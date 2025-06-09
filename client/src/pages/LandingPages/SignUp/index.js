import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import bgImage from "assets/images/bg-presentation.jpg";
import axios from "axios";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("User");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleTogglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/users", {
        username,
        email,
        password,
        role,
      });

      if (response.status === 201) {
        setSuccess("Account created successfully. Redirecting...");
        setTimeout(() => navigate("/pages/authentication/sign-in"), 3000);
      } else {
        setError("Failed to create account.", setRole);
      }
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred during signup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DefaultNavbar routes={routes} transparent light />
      <MKBox
        position="absolute"
        top={0}
        left={0}
        zIndex={1}
        width="100%"
        minHeight="100vh"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba } }) =>
            `${linearGradient(
              rgba("#FFC1CC", 0.8), // soft pink gradient start
              rgba("#FFECB3", 0.8) // soft yellow gradient end
            )}, url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "brightness(0.9)",
        }}
      />
      <MKBox
        px={1}
        width="100%"
        height="100vh"
        mx="auto"
        position="relative"
        zIndex={2}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Grid
          container
          spacing={1}
          justifyContent="center"
          alignItems="center"
          sx={{ maxWidth: 400 }}
        >
          <Grid item xs={12}>
            <Card sx={{ borderRadius: "20px", boxShadow: "0 10px 30px rgba(255, 192, 203, 0.4)" }}>
              <MKBox
                variant="gradient"
                bgColor="light"
                borderRadius="lg"
                coloredShadow="info"
                mx={2}
                mt={-3}
                p={3}
                mb={1}
                textAlign="center"
                sx={{
                  background: "linear-gradient(45deg, #FF6F91, #FF9671)", // playful warm gradient header
                  color: "white",
                  fontFamily: "'Comic Sans MS', cursive, sans-serif",
                  fontWeight: "bold",
                  fontSize: "1.8rem",
                  letterSpacing: "2px",
                  borderRadius: "20px 20px 0 0",
                }}
              >
                Sign up
              </MKBox>
              <MKBox pt={4} pb={3} px={4}>
                <MKBox component="form" role="form" onSubmit={handleSubmit}>
                  <MKBox mb={2}>
                    <MKInput
                      type="text"
                      label="Userame"
                      fullWidth
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      sx={{
                        "& input": {
                          fontFamily: "'Comic Sans MS', cursive, sans-serif",
                          color: "#333",
                          fontWeight: 600,
                        },
                      }}
                    />
                  </MKBox>
                  <MKBox mb={2}>
                    <MKInput
                      type="email"
                      label="Parent's Email"
                      fullWidth
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      sx={{
                        "& input": {
                          fontFamily: "'Comic Sans MS', cursive, sans-serif",
                          color: "#333",
                          fontWeight: 600,
                        },
                      }}
                    />
                  </MKBox>
                  <MKBox mb={2}>
                    <MKInput
                      type={showPassword ? "text" : "password"}
                      label="Create Password"
                      fullWidth
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleTogglePasswordVisibility}
                              edge="end"
                              aria-label="toggle password visibility"
                            >
                              {showPassword ? (
                                <VisibilityOff sx={{ color: "#FF6F91" }} />
                              ) : (
                                <Visibility sx={{ color: "#FF6F91" }} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& input": {
                          fontFamily: "'Comic Sans MS', cursive, sans-serif",
                          color: "#333",
                          fontWeight: 600,
                        },
                      }}
                    />
                  </MKBox>
                  <MKBox mb={2}>
                    <MKInput
                      type={showPassword ? "text" : "password"}
                      label="Confirm Password"
                      fullWidth
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      sx={{
                        "& input": {
                          fontFamily: "'Comic Sans MS', cursive, sans-serif",
                          color: "#333",
                          fontWeight: 600,
                        },
                      }}
                    />
                  </MKBox>
                  {error && (
                    <MKTypography
                      variant="body2"
                      color="error"
                      mt={2}
                      sx={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}
                    >
                      {error}
                    </MKTypography>
                  )}
                  {success && (
                    <MKTypography
                      variant="body2"
                      color="success"
                      mt={2}
                      sx={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}
                    >
                      {success}
                    </MKTypography>
                  )}
                  <MKBox mt={4} mb={1}>
                    <MKButton
                      type="submit"
                      variant="contained"
                      color="secondary"
                      fullWidth
                      disabled={isLoading}
                      sx={{
                        fontFamily: "'Comic Sans MS', cursive, sans-serif",
                        fontWeight: "bold",
                        background: "linear-gradient(45deg, #FF6F91, #FF9671)",
                        boxShadow: "0 4px 10px #FF6F91",
                        "&:hover": {
                          background: "linear-gradient(45deg, #FF9671, #FF6F91)",
                          boxShadow: "0 6px 12px #FF9671",
                        },
                      }}
                    >
                      {isLoading ? "Signing up..." : "Sign up"}
                    </MKButton>
                  </MKBox>
                  <MKBox mt={3} mb={1} textAlign="center">
                    <MKTypography
                      variant="button"
                      color="text"
                      sx={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}
                    >
                      Already have an account?{" "}
                      <MKTypography
                        component={Link}
                        to="/pages/authentication/sign-in"
                        variant="button"
                        fontWeight="bold"
                        color="secondary"
                        sx={{
                          cursor: "pointer",
                          "&:hover": {
                            color: "#FF69B4",
                            textDecoration: "underline",
                          },
                        }}
                      >
                        Sign in
                      </MKTypography>
                    </MKTypography>
                  </MKBox>
                </MKBox>
              </MKBox>
            </Card>
          </Grid>
        </Grid>
      </MKBox>
    </>
  );
}

export default SignUp;
