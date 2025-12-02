import { Button, TextField, IconButton } from "@mui/material";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { decreaseQuantity, increaseQuantity, removeFromCart } from "../Redux/Slice/Cart/cartSlice";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const dispatch = useDispatch();
  const { cartItems, totalQuantity, totalAmount } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const subtotal = cartItems?.reduce((acc, item) => acc + item.price * item.quantity, 0);
  return (
    <div className="w-full p-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <a onClick={() => navigate("/home")}>Home /</a>  <span className="text-black">Cart</span>
      </div>

      <div className="overflow-hidden border rounded-lg">
        <div className="grid grid-cols-4 font-semibold text-gray-600 p-4 bg-gray-50">
          <div>Product</div>
          <div>Price</div>
          <div>Quantity</div>
          <div>Subtotal</div>
        </div>

        {cartItems?.map((item) => (
          <div key={item.id} className="grid grid-cols-4 items-center p-4 border-t">
            <div className="flex items-center gap-3">
              <IconButton color="error" size="small" onClick={() => dispatch(removeFromCart({ id: item.id }))}>
                <MdDeleteOutline />
              </IconButton>
              <img src={item.image} alt={item.name} className="w-12 h-12" />
              <span>{item.name}</span>
            </div>

            <div>₹{(item.price).toFixed(2)}</div>

            <div className="flex w-fit items-center border rounded">
              <IconButton onClick={() => dispatch(decreaseQuantity({ id: item.id }))}>
                <IoMdRemove />
              </IconButton>
              <span className="px-4">{cartItems?.find((e) => e.id === item?.id)?.quantity || 1}</span>
              <IconButton onClick={() => dispatch(increaseQuantity({ id: item.id }))}>
                <IoMdAdd />
              </IconButton>
            </div>

            <div>₹{(item.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button onClick={() => navigate("/home")} variant="outlined">Return To Shop</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="flex gap-2 h-fit">
          <TextField size="small" placeholder="Coupon Code" />
          <Button variant="contained" color="error">
            Apply Coupon
          </Button>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Cart Total</h3>
          <div className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>₹{(subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between font-bold text-lg mb-4">
            <span>Total:</span>
            <span>₹{(totalAmount).toFixed(2)}</span>
          </div>
          <Button onClick={() => navigate("/checkout")} fullWidth variant="contained" color="error" className="!mt-2">
            Proceed to checkout
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
