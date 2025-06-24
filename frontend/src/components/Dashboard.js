// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Button, Card, Modal, Form, Row, Col, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import axios from 'axios';
import { Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const [clients, setClients] = useState([]);
  const [editingClientId, setEditingClientId] = useState(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', notes: '', status: 'Active', subscriptionPlan: 'Free'
  });
  const [userRole, setUserRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({
    name: '', category: '', price: '', description: ''
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const getRoleFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || '';
    } catch {
      return '';
    }
  };

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/clients', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(res.data);
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  const fetchProductsForClient = async (clientId) => {
    setLoadingProducts(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/products/client/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    setUserRole(getRoleFromToken());
    fetchClients();
  }, []);

  const handleClientSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (editingClientId) {
        await axios.put(`http://localhost:5000/api/clients/${editingClientId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`http://localhost:5000/api/clients`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setFormData({ name: '', email: '', phone: '', notes: '', status: 'Active', subscriptionPlan: 'Free' });
      setEditingClientId(null);
      setShowClientModal(false);
      fetchClients();
    } catch (err) {
      console.error('Error saving client:', err);
    }
  };

  const handleEditClient = (client) => {
    setFormData(client);
    setEditingClientId(client._id);
    setShowClientModal(true);
  };

  const handleDeleteClient = async (clientId) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/clients/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchClients();
    } catch (err) {
      console.error('Error deleting client:', err);
    }
  };

  const handleOpenProductModal = (client) => {
    setSelectedClient(client);
    fetchProductsForClient(client._id);
    setShowProductModal(true);
    setEditingProductId(null);
    setProductForm({ name: '', category: '', price: '', description: '' });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (editingProductId) {
        await axios.put(`http://localhost:5000/api/products/${editingProductId}`, productForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`http://localhost:5000/api/products/${selectedClient._id}`, productForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchProductsForClient(selectedClient._id);
      setProductForm({ name: '', category: '', price: '', description: '' });
      setEditingProductId(null);
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product._id);
    setProductForm(product);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProductsForClient(selectedClient._id);
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-4 bg-dark text-white min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-info">SaaS Tenant Hub</h2>
        {userRole === 'owner' && (
          <Button variant="info" onClick={() => {
            setFormData({ name: '', email: '', phone: '', notes: '', status: 'Active', subscriptionPlan: 'Free' });
            setEditingClientId(null);
            setShowClientModal(true);
          }}>
            + Add Client
          </Button>
        )}
      </div>

      <Form.Control
        type="text"
        placeholder="Search clients..."
        className="mb-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Row>
        {filteredClients.map((client) => (
          <Col md={4} key={client._id} className="mb-4">
            <Card className="bg-secondary text-white shadow-lg rounded-4">
              <Card.Body>
                <Card.Title className="fs-4 fw-bold">{client.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-light">{client.email}</Card.Subtitle>
                <p>Phone: {client.phone}</p>
                <p>Notes: {client.notes}</p>
                <p className="mb-1">Plan: <strong>{client.subscriptionPlan}</strong></p>
                <p className="text-muted">Created: {format(new Date(client.createdAt), 'PPP')}</p>
                <span className={`badge ${client.status === 'Inactive' ? 'bg-danger' : 'bg-success'} px-3 py-1`}>{client.status}</span>
                <div className="mt-3 d-flex gap-2">
                  <Button size="sm" variant="primary" onClick={() => handleOpenProductModal(client)}>
                    Manage Products
                  </Button>
                  {userRole === 'owner' && (
                    <>
                      <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                        <Button size="sm" variant="warning" onClick={() => handleEditClient(client)}><Pencil size={16} /></Button>
                      </OverlayTrigger>
                      <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                        <Button size="sm" variant="danger" onClick={() => handleDeleteClient(client._id)}><Trash2 size={16} /></Button>
                      </OverlayTrigger>
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showClientModal} onHide={() => setShowClientModal(false)} centered>
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>{editingClientId ? 'Edit Client' : 'Add Client'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <Form onSubmit={handleClientSubmit}>
            {['name', 'email', 'phone', 'notes'].map((field) => (
              <Form.Group className="mb-3" key={field}>
                <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                <Form.Control
                  type="text"
                  value={formData[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                />
              </Form.Group>
            ))}
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subscription Plan</Form.Label>
              <Form.Select
                value={formData.subscriptionPlan}
                onChange={(e) => setFormData({ ...formData, subscriptionPlan: e.target.value })}
              >
                <option value="Free">Free</option>
                <option value="Pro">Pro</option>
                <option value="Enterprise">Enterprise</option>
              </Form.Select>
            </Form.Group>
            <Button variant="info" type="submit" className="w-100">
              {editingClientId ? 'Update Client' : 'Add Client'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showProductModal} onHide={() => setShowProductModal(false)} centered size="lg">
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>Products for {selectedClient?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          {loadingProducts ? (
            <div className="text-center py-5"><Spinner animation="border" variant="info" /></div>
          ) : (
            <>
              <Form onSubmit={handleProductSubmit} className="mb-4">
                <Row>
                  <Col><Form.Control placeholder="Name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} /></Col>
                  <Col><Form.Control placeholder="Category" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} /></Col>
                  <Col><Form.Control placeholder="Price" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} /></Col>
                  <Col><Form.Control placeholder="Description" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} /></Col>
                  <Col><Button type="submit" variant="success">{editingProductId ? 'Update' : 'Add'} Product</Button></Col>
                </Row>
              </Form>
              {products.map((product) => (
                <Card key={product._id} className="mb-2 bg-light text-dark">
                  <Card.Body>
                    <Card.Title>{product.name} <small className="text-muted">({product.category})</small></Card.Title>
                    <Card.Text>{product.description}</Card.Text>
                    <div>₹{product.price}</div>
                    <div className="mt-2">
                      <Button size="sm" variant="warning" onClick={() => handleEditProduct(product)}><Pencil size={16} /></Button>{' '}
                      <Button size="sm" variant="danger" onClick={() => handleDeleteProduct(product._id)}><Trash2 size={16} /></Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Dashboard;
