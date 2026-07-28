import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

export default function Authentication() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [formState, setFormState] = React.useState(0);
    const [error, setError] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    const handleAuth = async () => {
      try {
          setError("");

          if (formState === 0) {
              const result = await handleLogin(username, password);

              setMessage(result);
              setOpen(true);
              navigate("/home");
          }

          if (formState === 1) {
              const result = await handleRegister(
                  name,
                  username,
                  password
              );

              setMessage(result);
              setOpen(true);

              setFormState(0);
              setName("");
              setUsername("");
              setPassword("");
          }
      } catch (err) {
          const errorMessage =
              err?.response?.data?.message ||
              err?.message ||
              "Something went wrong";

          setError(errorMessage);
      }
  };
    

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />

                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage:
                            'url(https://source.unsplash.com/random?wallpapers)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light'
                                ? t.palette.grey[50]
                                : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />

                <Grid
                    item
                    xs={12}
                    sm={8}
                    md={5}
                    component={Paper}
                    elevation={6}
                    square
                >
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>

                        <div>
                            <Button
                                variant={
                                    formState === 0
                                        ? 'contained'
                                        : 'outlined'
                                }
                                onClick={() => {
                                    setFormState(0);
                                    setError("");
                                }}
                                onclick={() => navigate("/dash")}
                            >
                                Sign In
                            </Button>

                            <Button
                                
                                variant={
                                    formState === 1
                                        ? 'contained'
                                        : 'outlined'
                                }
                                onClick={() => {
                                    setFormState(1);
                                    setError("");
                                    
                                    
                                }}
                                onclick={() => navigate("/dash")}
                                sx={{ ml: 1 }}
                            >
                                Sign Up
                            </Button>
                        </div>

                        <Box component="form" noValidate sx={{ mt: 1 }}>
                            {formState === 1 && (
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Full Name"
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                />
                            )}

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Username"
                                autoComplete="username"
                                value={username}
                                onChange={(e) =>
                                    setUsername(e.target.value)
                                }
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                            />

                            {error && (
                                <p style={{ color: 'red' }}>
                                    {error}
                                </p>
                            )}

                            <Button
    type="button"
    fullWidth
    variant="contained"
    sx={{ mt: 3, mb: 2 }}
    onClick={() => {
    console.log("Calling handleAuth");
    handleAuth();
}}
>
    {formState === 0 ? "Login" : "Register"}
</Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={() => setOpen(false)}
                message={message}
            />
        </ThemeProvider>
    );
}
