import React, { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLazyGetQuery } from "../Redux/Slice/Api";
import { propertyType } from "../tagTypes";
import { CardMedia, Rating, Button, IconButton, Divider, CircularProgress } from "@mui/material";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, decreaseQuantity, increaseQuantity } from "../Redux/Slice/Cart/cartSlice";

function SingleProduct() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { cartItems, totalQuantity, totalAmount } = useSelector((state) => state.cart);

  const navigate = useNavigate();

  const [
    getSingleProductDetail,
    {
      data: { data: singleProductDetail } = {},
      isLoading: isSingleProductDetailLoading,
      isFetching: isSingleProductDetailFetching,
    },
  ] = useLazyGetQuery();

  const handleGetSingleProductDetail = useCallback(async () => {
    try {
      await getSingleProductDetail({
        endpoint: `fakestoreapi.com/products/${id}`,
        tags: [propertyType.GET_SINGLE_PRODUCT_DETAIL],
      });
    } catch (error) { }
  }, [getSingleProductDetail, id]);

  const handleAddToCart = () => {
    dispatch(
      addToCart({ id: singleProductDetail?.id, name: singleProductDetail?.title, price: singleProductDetail?.price, quantity: 1, image: singleProductDetail?.image })
    );
    navigate("/cart");
  };

  useEffect(() => {
    handleGetSingleProductDetail();
  }, [handleGetSingleProductDetail]);

  if (!singleProductDetail) return <div className="flex justify-center items-center p-5 min-h-screen"> <CircularProgress /></div>;


  return (
    <div className="p-24 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="flex gap-4">
        <div className="flex flex-col gap-4 w-40">
          {[1, 2, 3, 4].map((thumb, i) => (
            <CardMedia
              key={i}
              component="img"
              image={singleProductDetail?.image}
              alt={singleProductDetail?.title}
              className="h-40 w-40 object-contain bg-gray-100 rounded cursor-pointer"
            />
          ))}
        </div>

        <div className="flex-1 flex items-center justify-center bg-gray-100 rounded">
          <CardMedia
            component="img"
            image={singleProductDetail?.image}
            alt={singleProductDetail?.title}
            className="h-[400px] object-contain"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">{singleProductDetail?.title}</h2>

        <div className="flex items-center gap-2">
          <Rating value={singleProductDetail?.rating?.rate || 0} precision={0.5} readOnly />
          <span className="text-gray-500 text-sm">({singleProductDetail?.rating?.count} Reviews)</span>
          <span className="text-green-600 text-sm font-medium">In Stock</span>
        </div>

        <p className="text-2xl font-bold">₹{(singleProductDetail?.price * 83).toFixed(2)}</p>

        <p className="text-gray-600">{singleProductDetail?.description}</p>

        <Divider />

        <div className="flex items-center gap-2">
          <span className="font-medium">Colours:</span>
          <button className="h-6 w-6 rounded-full bg-black border"></button>
          <button className="h-6 w-6 rounded-full bg-red-500 border"></button>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">Size:</span>
          {["XS", "S", "M", "L", "XL"].map((size) => (
            <button
              key={size}
              className={`px-3 py-1 border rounded hover:bg-black hover:text-white ${size === "M" ? "bg-black text-white" : ""}`}
            >
              {size}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-2">
          {cartItems?.map((e) => e.id).includes(singleProductDetail?.id) ? (
            <div className="flex items-center border rounded">
              <IconButton onClick={() => dispatch(decreaseQuantity({ id: singleProductDetail?.id }))}>
                <IoMdRemove />
              </IconButton>
              <span className="px-4">{cartItems?.find((e) => e.id === singleProductDetail?.id)?.quantity || 1}</span>
              <IconButton onClick={() => dispatch(increaseQuantity({ id: singleProductDetail?.id }))}>
                <IoMdAdd />
              </IconButton>
            </div>
          ) : (
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleAddToCart()}
              className="rounded-xl !bg-red-400 hover:bg-blue-700 normal-case !w-fit"
            >
              Add to Cart
            </Button>
          )}
        </div>

        {/* Delivery Info */}
        <div className="border rounded p-4 mt-4 space-y-3 text-sm">
          <div>
            <p className="font-medium">🚚 Free Delivery</p>
            <p className="text-gray-500">Enter your postal code for Delivery Availability</p>
          </div>
          <Divider />
          <div>
            <p className="font-medium">↩️ Return Delivery</p>
            <p className="text-gray-500">Free 30 Days Delivery Returns. Details</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
