import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
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
import { useUser } from "context/UserContext";
import { jwtDecode } from "jwt-decode";

function SignInBasic() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleTogglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:3001/signin", {
        email,
        password,
      });

      if (response.data.success) {
        const token = response.data.token;
        localStorage.setItem("token", token);

        const decodedToken = jwtDecode(token);

        const userData = {
          role: decodedToken.role,
          email: decodedToken.email,
          username: decodedToken.username,
        };

        setUser(userData);

        console.log("User data set:", userData);

        if (decodedToken.role === "Admin") {
          window.location.href = `http://localhost:3006/dashboard?token=${token}`;
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(response.data.message || "Sign-in failed.");
      }
    } catch (err) {
      setError(err.response.data.message || "An error occurred during sign in. Please try again.");
      console.error("Sign-in error:", err.response ? err.response.data : err.message);
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
              rgba("#FFC1CC", 0.8), // same pink gradient start as signup
              rgba("#FFECB3", 0.8) // same yellow gradient end as signup
            )}, url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "brightness(0.9)", // same as signup
        }}
      />
      <MKBox
        px={1}
        width="100%"
        height="100vh"
        mx="auto"
        position="relative"
        zIndex={2}
        display="flex" // center vertically/horizontally like signup
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
          <Grid item xs={12} sm={12} md={12}>
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
                  background: "linear-gradient(45deg, #FF6F91, #FF9671)", // same warm gradient header
                  color: "white",
                  fontFamily: "'Comic Sans MS', cursive, sans-serif",
                  fontWeight: "bold",
                  fontSize: "1.8rem",
                  letterSpacing: "2px",
                  borderRadius: "20px 20px 0 0",
                }}
              >
                Sign in
              </MKBox>
              <MKBox pt={4} pb={3} px={4}>
                <MKBox component="form" role="form" onSubmit={handleSubmit}>
                  <MKBox mb={2}>
                    <MKInput
                      type="email"
                      label="Email"
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
                      label="Password"
                      fullWidth
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
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
                  <MKBox display="flex" alignItems="center" ml={-1}>
                    <Switch checked={rememberMe} onChange={handleSetRememberMe} />
                    <MKTypography
                      variant="button"
                      fontWeight="regular"
                      color="text"
                      onClick={handleSetRememberMe}
                      sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                    >
                      &nbsp;&nbsp;Remember me
                    </MKTypography>
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
                      {isLoading ? "Signing in..." : "Sign in"}
                    </MKButton>
                  </MKBox>
                  <MKBox mt={3} mb={1} textAlign="center">
                    <MKTypography
                      variant="button"
                      color="text"
                      sx={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}
                    >
                      Don&apos;t have an account?{" "}
                      <MKTypography
                        component={Link}
                        to="/pages/authentication/sign-up"
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
                        Sign up
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

export default SignInBasic;
