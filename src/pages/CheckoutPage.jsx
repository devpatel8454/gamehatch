// src/pages/CheckoutPage.jsx
import React, { useState } from "react";
import { TextField, Button, Checkbox, FormControlLabel, Radio, RadioGroup, FormControl, FormLabel } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";

// ✅ Validation schema
const CheckoutSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  company: Yup.string(),
  street: Yup.string().required("Street Address is required"),
  apartment: Yup.string(),
  city: Yup.string().required("City is required"),
  phone: Yup.string().required("Phone Number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

function CheckoutPage() {
  const dispatch = useDispatch();
  const { cartItems, totalQuantity, totalAmount } = useSelector((state) => state.cart);
  const [payment, setPayment] = useState("cod");

  const initialValues = {
    firstName: "",
    company: "",
    street: "",
    apartment: "",
    city: "",
    phone: "",
    email: "",
    saveInfo: true,
  };

  const handleSubmit = (values) => {
    console.log("Form submitted:", { ...values, payment });
    alert("Order placed successfully 🚀");
  };

  return (
    <div className="w-full p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left - Billing Details */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Billing Details</h2>

        <Formik initialValues={initialValues} validationSchema={CheckoutSchema} onSubmit={handleSubmit}>
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form className="flex flex-col gap-4">
              <TextField
                label="First Name *"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.firstName && Boolean(errors.firstName)}
                helperText={touched.firstName && errors.firstName}
                size="small"
              />
              <TextField
                label="Company Name"
                name="company"
                value={values.company}
                onChange={handleChange}
                onBlur={handleBlur}
                size="small"
              />
              <TextField
                label="Street Address *"
                name="street"
                value={values.street}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.street && Boolean(errors.street)}
                helperText={touched.street && errors.street}
                size="small"
              />
              <TextField
                label="Apartment, floor, etc. (optional)"
                name="apartment"
                value={values.apartment}
                onChange={handleChange}
                onBlur={handleBlur}
                size="small"
              />
              <TextField
                label="Town/City *"
                name="city"
                value={values.city}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.city && Boolean(errors.city)}
                helperText={touched.city && errors.city}
                size="small"
              />
              <TextField
                label="Phone Number *"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone && Boolean(errors.phone)}
                helperText={touched.phone && errors.phone}
                size="small"
              />
              <TextField
                label="Email Address *"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                size="small"
              />

              <FormControlLabel
                control={<Checkbox name="saveInfo" checked={values.saveInfo} onChange={handleChange} color="error" />}
                label="Save this information for faster check-out next time"
              />
            </Form>
          )}
        </Formik>
      </div>

      {/* Right - Order Summary */}
      <div className="border rounded-lg p-6">
        {/* Items */}
        {cartItems.map((item, index) => {
          return (
            <div key={index} className="flex justify-between mb-3">
              <div className="flex gap-2 items-center">
                <img src={item.image} alt="Gamepad" className="w-10 h-10" />
                <span>{item.name}</span>
              </div>
              <span>₹{(item.quantity * item.price).toFixed(2)}</span>
            </div>
          );
        })}

        {/* Totals */}
        <div className="flex justify-between border-t pt-2 mt-2 text-sm">
          <span>Subtotal:</span>
          <span>₹{(totalAmount).toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-b pb-2 mb-2 text-sm">
          <span>Shipping:</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between font-bold text-lg mb-4">
          <span>Total:</span>
          <span>₹{(totalAmount).toFixed(2)}</span>
        </div>

        {/* Payment Options */}
        <FormControl component="fieldset">
          <FormLabel component="legend">Payment Method</FormLabel>
          <RadioGroup value={payment} onChange={(e) => setPayment(e.target.value)}>
            <FormControlLabel value="bank" control={<Radio />} label="Bank" />
            <FormControlLabel value="cod" control={<Radio />} label="Cash on delivery" />
          </RadioGroup>
        </FormControl>

        {/* Place Order */}
        <Formik initialValues={initialValues} validationSchema={CheckoutSchema} onSubmit={handleSubmit}>
          {() => (
            <Form>
              <Button type="submit" fullWidth variant="contained" color="error" className="!mt-6">
                Place Order
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default CheckoutPage;
