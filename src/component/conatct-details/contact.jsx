import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Details from "./display-details";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../Redux/contactSlice";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Contact = () => {
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.data);
  const status = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    dispatch(fetchUsers())
      .then((unwrapResult) => {
        setUsers(unwrapResult?.payload);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [dispatch]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingUser(null);
  };

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    contact: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    contact: "",
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    const errors = validateFields({ ...formData, [name]: value });
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errors[name] || "",
    }));
  };

  const validateFields = () => {
    const errors = {};
    if (!formData.name) {
      errors.name = "Please enter a name";
    }
    if (!formData.email) {
      errors.email = "Please enter an email";
    } else if (!formData.email.match(/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/)) {
      errors.email = "Please enter a valid email";
    }
    if (!formData.contact) {
      errors.contact = "Please enter a contact number";
    } else if (!formData.contact.match(/^[0-9]+$/)) {
      errors.contact = "Please enter a valid contact number";
    }
    return errors;
  };
  const onSubmit = () => {
    const errors = validateFields();
    if (Object.keys(errors).length === 0) {
      if (editingUser) {
        dispatch(updateUser({ userId: editingUser.id, userData: formData }))
          .then(() => {
            handleClose();
            showSnackbar("User updated successfully", "success");
            setFormData({
              id: "",
              name: "",
              email: "",
              contact: "",
            });
            dispatch(fetchUsers())
              .then((unwrapResult) => {
                setUsers(unwrapResult?.payload);
              })
              .catch((error) => {
                showSnackbar("Error updating user", "error");
              });
          })
          .catch((error) => {
            showSnackbar("Error updating user", "error");
          });
      } else {
        dispatch(createUser(formData))
          .then(() => {
            handleClose();
            showSnackbar("User created successfully", "success");
            setFormData({
              id: "",
              name: "",
              email: "",
              contact: "",
            });
            dispatch(fetchUsers())
              .then((unwrapResult) => {
                setUsers(unwrapResult?.payload);
              })
              .catch((error) => {
                showSnackbar("Error creating user", "error");
              });
          })
          .catch((error) => {
            showSnackbar("Error creating user", "error");
            console.error("Error creating user:", error);
          });
      }
    } else {
      console.error("Validation errors:", errors);
    }
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmed) {
      setIsLoading(true);
      dispatch(deleteUser(id))
        .then(() => {
          showSnackbar("User deleted successfully", "success");
          dispatch(fetchUsers())
            .then((unwrapResult) => {
              setUsers(unwrapResult?.payload);
            })
            .catch((error) => {
              showSnackbar("Error deleting user", "error");
            });
        })
        .catch((error) => {
          showSnackbar("Error deleting user", "error");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleEdit = (id) => {
    const userToEdit = users.find((user) => user.id === id);
    setEditingUser(userToEdit);
    setFormData(userToEdit);
    setOpen(true);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        {editingUser ? "Edit User" : "Add details"}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {editingUser
              ? "Edit the user details below:"
              : "To add a new user, please enter the details below:"}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Enter Name"
            name="name"
            type="text"
            fullWidth
            variant="standard"
            value={formData.name ? formData.name : ""}
            onChange={(e) => handleInputChange(e)}
            error={!!formErrors.name}
          />
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Enter Email"
            type="email"
            name="email"
            fullWidth
            variant="standard"
            value={formData.email ? formData.email : ""}
            onChange={(e) => handleInputChange(e)}
            error={!!formErrors.email}
          />
          <TextField
            autoFocus
            margin="dense"
            id="contactNo"
            label="Enter Contact"
            type="text"
            fullWidth
            name="contact"
            variant="standard"
            value={formData.contact ? formData.contact : ""}
            onChange={(e) => handleInputChange(e)}
            error={!!formErrors.contact}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="term"
                checked={formData.term}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    term: e.target.checked,
                  }))
                }
              />
            }
            label="I agree to the terms and conditions"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={onSubmit}>
            {editingUser ? "Save Changes" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
      <Details
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={isLoading}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Contact;
