import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';

/**
 *
 */
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 420,
          mx: 2,
          borderRadius: 3,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography
            variant="h5"
            sx={{ fontSize: { xs: '1.4rem', sm: '1.6rem' } }}
            textAlign="center"
            fontWeight="bold"
            gutterBottom
          >
            Welcome Back
          </Typography>

          <Typography variant="body2" textAlign="center" color="text.secondary" mb={3}>
            Please sign in to your account
          </Typography>

          <TextField
            fullWidth
            label="Email"
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{
              mt: 3,
              py: 1.2,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
            }}
          >
            Login
          </Button>

          <Typography variant="body2" textAlign="center" mt={2} sx={{ cursor: 'pointer' }}>
            Forgot password?
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
