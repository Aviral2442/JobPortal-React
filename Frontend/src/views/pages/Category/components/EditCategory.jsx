import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Image, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ComponentCard from '@/components/ComponentCard';

const EditCategory = () => {
  const { id } = useParams(); // category ID from URL
  const navigate = useNavigate();

  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch category by ID
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/categories/${id}`
        );
        const data = response.data;
        setCategoryName(data.categoryName);
        if (data.categoryImage) {
          setPreview(`${import.meta.env.VITE_BASE_URL}${data.categoryImage}`);
        }
      } catch (error) {
        setMessage('Failed to fetch category.');
        setVariant('danger');
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  const handleCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setCategoryImage(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      setMessage('Category name is required.');
      setVariant('danger');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('categoryName', categoryName);
      if (categoryImage) formData.append('categoryImage', categoryImage);

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/categories/${id}`,
        formData
      );

      setMessage(`Category "${response.data.categoryName}" updated successfully!`);
      setVariant('success');

      setTimeout(() => navigate('/admin/category'), 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating category.');
      setVariant('danger');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container fluid className="pt-4 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container fluid className="pt-4">
      <ComponentCard title="Edit Category" isCollapsible defaultOpen={false}>
        {message && <Alert variant={variant}>{message}</Alert>}
        <Form onSubmit={handleSubmit} className='py-2'>
          <Form.Group className="mb-3" controlId="categoryName">
            <Form.Label>
              Category Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="categoryImage">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleCategoryImageChange}
            />
          </Form.Group>

          {preview && (
            <div className="mb-3 text-start">
              <p>Current / New Image:</p>
              <Image src={preview} alt="Preview" thumbnail width="200" />
            </div>
          )}

          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Category'}
          </Button>
        </Form>
      </ComponentCard>
    </Container>
  );
};

export default EditCategory;