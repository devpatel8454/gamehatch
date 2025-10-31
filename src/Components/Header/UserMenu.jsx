import * as React from "react";
import { useNavigate } from "react-router";
import { Box, Card, Divider, IconButton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import { jwtDecode } from "jwt-decode";
import { PiUserCircleThin } from "react-icons/pi";
import { useAuth } from "../../Context/Authcontext";
import { IoIosLogOut } from "react-icons/io";

export const UserMenu = () => {
  const { token, role, userName } = useAuth();
  const decoded = jwtDecode(token);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    logout();
    navigate("/login");
    setAnchorEl(null);
  };

  return (
    <>
      {/* <Box className="flex items-center text-center"> */}
        <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
          <Avatar
            sx={{ width: 20, height: 20 }}
            className="!bg-blue-600 !hover:bg-blue-100"
          >
            {decoded?.[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
            ]
              ?.slice(0, 1)
              ?.toUpperCase()}
          </Avatar>
        </IconButton>
      {/* </Box> */}

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              border: "1px solid lightgray",
              borderRadius: "8px",
              boxShadow: `
              0px 5px 5px -3px rgba(145, 158, 171, 0.2),
              0px 8px 10px 1px rgba(145, 158, 171, 0.14),
              0px 3px 14px 2px rgba(145, 158, 171, 0.12)
            `,
              mt: 1.2,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          sx={{
            minWidth: "200px",
            padding: "5px 15px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <div className="flex gap-2  ">
            <div className="mt-1">
              <PiUserCircleThin size={30} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold">{userName}</span>
              {role && (
                <span className="text-gray-500 text-sm">
                  {role === "S"
                    ? "Super"
                    : role === "A"
                    ? "Agent"
                    : role === "M"
                    ? "Manager"
                    : role === "R"
                    ? "Report Only"
                    : ""}
                </span>
              )}
            </div>
          </div>
        </MenuItem>

        <Divider
          sx={{
            borderBottom: "0.2px dashed #D3D3D3",
          }}
        />

        <MenuItem
          sx={{
            minWidth: "200px",
            padding: "5px 20px",
          }}
          onClick={handleLogout}
        >
          <ListItemIcon>
            <IoIosLogOut size={25} fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};
