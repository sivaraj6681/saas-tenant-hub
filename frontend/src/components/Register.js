import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { register } from '../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'viewer' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/login'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
      <Card bg="dark" text="white" style={{ width: '25rem' }} className="p-4 shadow">
        <h2 className="text-center mb-4">Register</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="bg-dark text-white border-secondary"
            >
              <option value="viewer">viewer</option>
              <option value="owner">owner</option>
            </Form.Select>
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Register
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Register;
