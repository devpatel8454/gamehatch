import Backdrop from "@mui/material/Backdrop";
import { CircularProgress } from "@mui/material";

const Loader = ({ open }) => (
  <Backdrop
    sx={(theme) => ({
      background: "#fff",
      zIndex: theme.zIndex.drawer + 1,
    })}
    open={open}
  >
    <CircularProgress />
  </Backdrop>
);

export default Loader;
