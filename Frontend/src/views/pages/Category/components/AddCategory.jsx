import React, { useState } from 'react';
import { Form, Button, Alert, Container, Image } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ComponentCard from '@/components/ComponentCard';

const AddCategory = () => {
  const navigate = useNavigate();

  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/categories`,
        formData
      );

      setMessage(`Category "${response.data.categoryName}" added successfully!`);
      setVariant('success');

      // Clear form
      setCategoryName('');
      setCategoryImage(null);
      setPreview(null);

      // Redirect back to category list after 1 second
      setTimeout(() => navigate('/admin/category'), 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error adding category.');
      setVariant('danger');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container fluid className="pt-4">
      <ComponentCard title="Add Category" isCollapsible defaultOpen={false}>
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
              <p>Image Preview:</p>
              <Image src={preview} alt="Preview" thumbnail width="200" />
            </div>
          )}
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            Add Category
          </Button>
        </Form>
      </ComponentCard>
    </Container>
  );
};

export default AddCategory;