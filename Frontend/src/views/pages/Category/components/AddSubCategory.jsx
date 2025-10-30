import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Image, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ComponentCard from '@/components/ComponentCard';

const AddSubCategory = () => {
  const navigate = useNavigate();

  const [subCategoryName, setSubCategoryName] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [subCategoryImage, setSubCategoryImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch all categories for the parent dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/categories`);
        setCategories(res.data.data || []); // <-- fix: use data array from API response
      } catch (err) {
        console.error(err);
        setMessage('Failed to load categories.');
        setVariant('danger');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSubCategoryImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setSubCategoryImage(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subCategoryName.trim() || !parentCategory) {
      setMessage('Sub-category name and parent category are required.');
      setVariant('danger');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('subCategoryName', subCategoryName);
      formData.append('parentCategory', parentCategory);
      if (subCategoryImage) formData.append('subCategoryImage', subCategoryImage);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/subcategories`,
        formData
      );

      setMessage(`Sub-category "${response.data.subCategoryName}" added successfully!`);
      setVariant('success');

      // Clear form
      setSubCategoryName('');
      setParentCategory('');
      setSubCategoryImage(null);
      setPreview(null);

      // Redirect back to sub-category list after 1 sec
      setTimeout(() => navigate('/admin/sub-category'), 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error adding sub-category.');
      setVariant('danger');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container fluid className="pt-4">
      <ComponentCard title="Add Sub Category" >
        {message && <Alert variant={variant}>{message}</Alert>}
        <Form onSubmit={handleSubmit} className='py-2'>
          <Form.Group className="mb-3" controlId="subCategoryName">
            <Form.Label>
              Sub-Category Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter sub-category name"
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="parentCategory">
            <Form.Label>
              Parent Category <span className="text-danger">*</span>
            </Form.Label>
            {loadingCategories ? (
              <div>
                <Spinner animation="border" size="sm" /> Loading categories...
              </div>
            ) : (
              <Form.Select
                value={parentCategory}
                onChange={(e) => setParentCategory(e.target.value)}
                required
              >
                <option value="">Select parent category</option>
                {Array.isArray(categories) &&
                  categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </option>
                  ))}
              </Form.Select>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="subCategoryImage">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleSubCategoryImageChange}
            />
          </Form.Group>

          {preview && (
            <div className="mb-3 text-start">
              <p>Image Preview:</p>
              <Image src={preview} alt="Preview" thumbnail width="200" />
            </div>
          )}

          <Button variant="primary" type="submit" disabled={isSubmitting || loadingCategories}>
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" /> Adding...
              </>
            ) : (
              'Add Sub-Category'
            )}
          </Button>
        </Form>
      </ComponentCard>
    </Container>
  );
};

export default AddSubCategory;
