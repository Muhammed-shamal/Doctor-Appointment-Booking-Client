import { useState } from 'react'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Alert,
  Stack,
} from '@mui/material'
import './App.css'

function App() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
  })
  const [status, setStatus] = useState({ message: '', type: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ message: '', type: '' })

    if (form.password !== form.confirmPassword) {
      setStatus({ message: 'Passwords do not match.', type: 'error' })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        setStatus({
          message: data?.message || 'Registration failed. Please try again.',
          type: 'error',
        })
      } else {
        setStatus({ message: data?.message || 'Registration successful!', type: 'success' })
        setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }))
      }
    } catch (error) {
      setStatus({ message: 'Unable to reach server. Please try again later.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Paper elevation={8} className="register-paper">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h4" gutterBottom>
            Create account
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3, maxWidth: 420 }}>
            Register as a patient to book appointments and manage your profile securely.
          </Typography>

          <Stack spacing={2} sx={{ width: '100%' }}>
            {status.message && (
              <Alert severity={status.type} onClose={() => setStatus({ message: '', type: '' })}>
                {status.message}
              </Alert>
            )}
          </Stack>

          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Full name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm password"
                  type="password"
                  id="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    name="role"
                    value={form.role}
                    label="Role"
                    onChange={handleChange}
                  >
                    <MenuItem value="patient">Patient</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Register'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default App
