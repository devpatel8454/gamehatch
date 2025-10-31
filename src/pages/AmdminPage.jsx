import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { propertyType } from '../tagTypes';
import { useLazyGetQuery, usePostMutation, useDeleteMutation, usePutMutation } from '../Redux/Slice/Api';

const ProductSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  price: Yup.number()
    .required("Price is required")
    .min(0, "Price cannot be negative")
    .max(999999.99, "Price cannot exceed $999,999.99"),
  description: Yup.string().required("Description is required"),
  category: Yup.string().required("Category is required"),
  image: Yup.string().url("Must be a valid URL").required("Image is required"),
});

export default function AdminPage() {
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Mock data for testing UI - replace with real API when backend is ready
  const [products] = useState([
    {
      id: 1,
      title: "Gaming Mouse",
      price: 59.99,
      category: "Accessories",
      image: "https://via.placeholder.com/150",
      description: "High-precision gaming mouse"
    },
    {
      id: 2,
      title: "Mechanical Keyboard",
      price: 129.99,
      category: "Accessories",
      image: "https://via.placeholder.com/150",
      description: "RGB mechanical keyboard"
    },
    {
      id: 3,
      title: "Gaming Headset",
      price: 89.99,
      category: "Audio",
      image: "https://via.placeholder.com/150",
      description: "Surround sound gaming headset"
    }
  ]);

  // Helper function to extract products from API response
  const extractProductsFromResponse = (response) => {
    if (!response) return [];

    // Try different possible response structures
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (Array.isArray(response.payload)) {
      return response.payload;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (response.data?.products && Array.isArray(response.data.products)) {
      return response.data.products;
    } else if (Array.isArray(response)) {
      return response;
    }

    return [];
  };

  // Get API products with fallback to mock data
  const apiProducts = extractProductsFromResponse(apiResponse);
  const [addProduct] = usePostMutation();
  const [deleteProduct] = useDeleteMutation();
  const [updateProduct] = usePutMutation();

  const handleGetProducts = useCallback(async () => {
    try {
      const response = await getProducts({
        endpoint: `products`,
        tags: [propertyType.GET_PRODUCTS],
      });

      // Debug: Log the API response structure
      console.log('API Response:', response);
      console.log('Full API response data:', response?.data);
      console.log('Response payload:', response?.payload);

      // Extract products from various possible response structures
      let extractedProducts = [];

      if (Array.isArray(response?.data)) {
        extractedProducts = response.data;
      } else if (Array.isArray(response?.payload)) {
        extractedProducts = response.payload;
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        extractedProducts = response.data.data;
      } else if (response?.data?.products && Array.isArray(response.data.products)) {
        extractedProducts = response.data.products;
      }

      console.log('Extracted products:', extractedProducts);
      if (extractedProducts.length > 0) {
        console.log('Sample product:', extractedProducts[0]);
        console.log('Sample price field:', extractedProducts[0]?.price);
      }

      console.log('Products loaded successfully');
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }, [getProducts]);

  useEffect(() => {
    handleGetProducts();
  }, [handleGetProducts]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (editingProduct) {
        // Update existing product
        await updateProduct({
          endpoint: `products/${editingProduct.id}`,
          body: values,
          tags: [propertyType.GET_PRODUCTS],
        }).unwrap();

        // Update local state
        const updatedProducts = products.map(p =>
          p.id === editingProduct.id ? { ...p, ...values } : p
        );
        setProducts(updatedProducts);

        console.log('Product updated successfully:', editingProduct.id);
      } else {
        // Add new product
        const response = await addProduct({
          endpoint: 'products',
          body: values,
          tags: [propertyType.GET_PRODUCTS],
        }).unwrap();

        // Add to local state (assuming backend returns the created product with id)
        if (response && response.id) {
          setProducts([...products, response]);
        }

        console.log('Product added successfully');
      }

      resetForm();
      setEditingProduct(null);
      setOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct({
        endpoint: `products/${id}`,
        tags: [propertyType.GET_PRODUCTS],
      }).unwrap();

      // Remove from local state
      setProducts(products.filter(p => p.id !== id));
      console.log('Product deleted successfully:', id);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setOpen(true);
  };

  return (
    <div className="p-6">
      <div
        className="flex justify-between"
      >
        <h1 className="text-xl font-bold mb-4">Products</h1>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Add Product
        </Button>
      </div>

      <TableContainer component={Paper} className="mt-4 shadow-lg">
        <Table>
          <TableHead className="bg-gray-200">
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isProductsLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              (apiProducts.length > 0 ? apiProducts : products)?.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.title}</TableCell>
                  <TableCell>
                    {(() => {
                      const price = p.price || p.cost || p.amount || p.value || p.pricing || 0;
                      const numPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
                      return `$${numPrice.toFixed(2)}`;
                    })()}
                  </TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>
                    <img src={p.image} alt={p.title} className="w-12 h-12" />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="small" variant="outlined" onClick={() => handleEdit(p)}>
                        Edit
                      </Button>
                      <Button size="small" color="error" variant="outlined" onClick={() => handleDelete(p.id)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              title: editingProduct?.title || "",
              price: editingProduct?.price ? parseFloat(editingProduct.price) : "",
              description: editingProduct?.description || "",
              category: editingProduct?.category || "",
              image: editingProduct?.image || "",
            }}
            validationSchema={ProductSchema}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="flex flex-col gap-4 mt-2">
                <Field
                  as={TextField}
                  name="title"
                  label="Title"
                  fullWidth
                  error={touched.title && Boolean(errors.title)}
                  helperText={touched.title && errors.title}
                />
                <Field
                  as={TextField}
                  name="price"
                  type="number"
                  label="Price ($)"
                  fullWidth
                  inputProps={{
                    min: "0",
                    max: "999999.99",
                    step: "0.01"
                  }}
                  placeholder="0.00"
                  error={touched.price && Boolean(errors.price)}
                  helperText={touched.price && errors.price}
                />
                <Field
                  as={TextField}
                  name="description"
                  label="Description"
                  fullWidth
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
                <Field
                  as={TextField}
                  name="category"
                  label="Category"
                  fullWidth
                  error={touched.category && Boolean(errors.category)}
                  helperText={touched.category && errors.category}
                />
                <Field
                  as={TextField}
                  name="image"
                  label="Image URL"
                  fullWidth
                  error={touched.image && Boolean(errors.image)}
                  helperText={touched.image && errors.image}
                />
                <DialogActions>
                  <Button onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" variant="contained">
                    {editingProduct ? "Update" : "Add"}
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
}
