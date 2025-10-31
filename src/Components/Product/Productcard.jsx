import { Card, CardContent, CardMedia, Typography, Rating, Button, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart, decreaseQuantity, increaseQuantity } from "../../Redux/Slice/Cart/cartSlice";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { FaStar, FaComment } from "react-icons/fa";

function Productcard({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const handleAddToCart = () => {
    dispatch(addToCart({ id: product?.id, name: product?.title, price: product?.price, quantity: 1, image:product?.image }));
    navigate("/cart");
  };

  const handleReview = () => {
    // Navigate to product detail page with review focus
    navigate(`/product/${product.id}#reviews`);
  };

  return (
    <Card className="w-80 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 flex flex-col">
      <CardMedia component="img" image={product.image} alt={product.title} className="h-[250px] object-cover p-4" />

      <CardContent className="flex flex-col gap-2 flex-grow">
        <Typography variant="h6" component="div" className="font-semibold line-clamp-2">
          {product.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" className="line-clamp-2">
          {product?.description}
        </Typography>

        <Typography variant="h6" className="text-gray-900 font-bold mt-2">
          ₹{(product?.price * 83).toFixed(2)}
        </Typography>

        <div className="flex items-center gap-2">
          <Rating value={product.rating.rate} precision={0.1} readOnly size="small" />
          <Typography variant="body2" className="text-gray-600">
            ({product.rating.count})
          </Typography>
        </div>
      </CardContent>

      <div className="p-3 flex gap-2 flex-col">
        {/* Add to Cart / Quantity Controls */}
        <div className="flex gap-2">
          {cartItems?.map((e) => e.id).includes(product.id) ? (
            <div className="flex items-center border rounded w-full">
              <IconButton onClick={() => dispatch(decreaseQuantity({ id: product?.id }))}>
                <IoMdRemove />
              </IconButton>
              <span className="px-4 flex-1 text-center">{cartItems?.find((e) => e.id === product?.id)?.quantity || 1}</span>
              <IconButton onClick={() => dispatch(increaseQuantity({ id: product?.id }))}>
                <IoMdAdd />
              </IconButton>
            </div>
          ) : (
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleAddToCart()}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 normal-case"
              startIcon={<FaStar />}
            >
              Add to Cart
            </Button>
          )}
        </div>

        {/* Action Buttons Row */}
        <div className="flex gap-2">
          <Button
            fullWidth
            variant="outlined"
            className="rounded-xl normal-case border-blue-600 text-blue-600 hover:bg-blue-50"
            onClick={() => navigate(`/product/${product.id}`)}
            startIcon={<FaStar />}
          >
            Details
          </Button>

          <Button
            fullWidth
            variant="outlined"
            className="rounded-xl normal-case border-green-600 text-green-600 hover:bg-green-50"
            onClick={handleReview}
            startIcon={<FaComment />}
          >
            Review
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default Productcard;
