// src/components/ClientManagement.js
import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Form, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClientId, setEditingClientId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', notes: '', status: 'Active',
  });

  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({ name: '', description: '', category: '', price: '' });
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
  const userRole = getRoleFromToken();

  const fetchClients = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/clients', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(res.data);
    } catch (err) {
      console.error('Fetch clients failed:', err);
    }
  };

  const handleAddOrUpdateClient = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (editingClientId) {
        await axios.put(`http://localhost:5000/api/clients/${editingClientId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('http://localhost:5000/api/clients', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchClients();
      setShowModal(false);
      setEditingClientId(null);
      setFormData({ name: '', email: '', phone: '', notes: '', status: 'Active' });
    } catch (err) {
      console.error('Error saving client:', err);
    }
  };

  const handleEditClient = (client) => {
    setEditingClientId(client._id);
    setFormData(client);
    setShowModal(true);
  };

  const handleDeleteClient = async (clientId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/clients/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchClients();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleManageProducts = async (client) => {
    setSelectedClient(client);
    setLoadingProducts(true);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`http://localhost:5000/api/products/client/${client._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
      setShowProductModal(true);
    } catch (err) {
      console.error('Fetch products failed:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleAddOrUpdateProduct = async () => {
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
      handleManageProducts(selectedClient); // refresh
      setProductForm({ name: '', description: '', category: '', price: '' });
      setEditingProductId(null);
    } catch (err) {
      console.error('Save product failed:', err);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product._id);
    setProductForm(product);
  };

  const handleDeleteProduct = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      handleManageProducts(selectedClient); // refresh
    } catch (err) {
      console.error('Delete product failed:', err);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => { fetchClients(); }, []);

  return (
    <div className="p-4 bg-dark text-white min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-info">Client Management</h3>
        {userRole === 'owner' && (
          <Button variant="info" onClick={() => {
            setFormData({ name: '', email: '', phone: '', notes: '', status: 'Active' });
            setEditingClientId(null);
            setShowModal(true);
          }}>+ Add Client</Button>
        )}
      </div>

      <Form.Control
        type="text"
        className="mb-4"
        placeholder="Search client..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Row>
        {filteredClients.map((client) => (
          <Col key={client._id} md={4} className="mb-4">
            <Card className="bg-secondary text-white shadow">
              <Card.Body>
                <Card.Title>{client.name}</Card.Title>
                <Card.Subtitle className="text-muted">{client.email}</Card.Subtitle>
                <p className="mt-2 mb-1">Phone: {client.phone}</p>
                <p className="mb-1">Status: <span className={`badge ${client.status === 'Inactive' ? 'bg-danger' : 'bg-success'}`}>{client.status}</span></p>
                <p className="mb-3">Notes: {client.notes}</p>

                <div className="d-flex justify-content-between">
                  <Button size="sm" variant="primary" onClick={() => handleManageProducts(client)}>Manage Products</Button>
                  {userRole === 'owner' && (
                    <>
                      <Button size="sm" variant="warning" onClick={() => handleEditClient(client)}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => handleDeleteClient(client._id)}>Delete</Button>
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Add/Edit Client Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>{editingClientId ? "Edit Client" : "Add Client"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <Form onSubmit={handleAddOrUpdateClient}>
            <Form.Group className="mb-2"><Form.Label>Name</Form.Label>
              <Form.Control value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-2"><Form.Label>Email</Form.Label>
              <Form.Control type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-2"><Form.Label>Phone</Form.Label>
              <Form.Control value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2"><Form.Label>Notes</Form.Label>
              <Form.Control as="textarea" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3"><Form.Label>Status</Form.Label>
              <Form.Select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
            <Button type="submit" className="w-100" variant="info">
              {editingClientId ? "Update Client" : "Add Client"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Product Modal */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)} centered size="lg">
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>Products for {selectedClient?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          {loadingProducts ? (
            <div className="text-center"><Spinner animation="border" variant="info" /></div>
          ) : (
            <>
              <Form className="mb-3">
                <Row>
                  <Col><Form.Control placeholder="Name" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} /></Col>
                  <Col><Form.Control placeholder="Category" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} /></Col>
                  <Col><Form.Control placeholder="Price" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} /></Col>
                </Row>
                <Form.Control className="mt-2" placeholder="Description" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} />
                <Button className="mt-3 w-100" variant="success" onClick={handleAddOrUpdateProduct}>
                  {editingProductId ? 'Update Product' : 'Add Product'}
                </Button>
              </Form>

              {products.length === 0 ? (
                <p className="text-muted">No products found.</p>
              ) : (
                products.map(p => (
                  <Card key={p._id} className="mb-3 bg-secondary text-white">
                    <Card.Body>
                      <Card.Title>{p.name} - ₹{p.price}</Card.Title>
                      <Card.Subtitle className="mb-2 text-info">{p.category}</Card.Subtitle>
                      <Card.Text>{p.description}</Card.Text>
                      <div className="d-flex justify-content-end gap-2">
                        <Button size="sm" variant="warning" onClick={() => handleEditProduct(p)}>Edit</Button>
                        <Button size="sm" variant="danger" onClick={() => handleDeleteProduct(p._id)}>Delete</Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))
              )}
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ClientManagement;
