import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { login } from '../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { token } = await login(email, password);
      localStorage.setItem('token', token);
      navigate('/dashboard'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
      <Card bg="dark" text="white" style={{ width: '25rem' }} className="p-4 shadow">
        <h2 className="text-center mb-4">Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Login
          </Button>
        </Form>

        
        <p className="mt-3 text-center">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </Card>
    </Container>
  );
};

export default Login;

