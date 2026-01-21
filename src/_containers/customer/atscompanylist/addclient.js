import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Label,
  FormGroup,
  FormFeedback,
} from "reactstrap";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  SNACKBAR_TYPES,
  SNACKBAR_POSITION,
  GENERAL_MESSAGES,
} from "_constants/snackbarMessages";
import { showSnackbar } from "_store/snackbar.slice";



const AddClient = ({ isOpen, onClose, url, onSuccess }) => {
  const [form, setForm] = useState({
    atscompanyid: "",
    atstype: "",
    companyname: "",
    email: "",
    phonenumber: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // validation
  const validate = () => {
    let newErrors = {};

    if (!form.companyname || form.companyname.trim() === "") {
      newErrors.companyname = "Company name is required";
    }
    if (!form.email || form.email.trim() === "") {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = "Invalid email format";
      }
    }
    if (form.phonenumber && form.phonenumber.trim() !== "") 
    { const phoneRegex = /^[0-9]/; 
      if (!phoneRegex.test(form.phonenumber)) { 
        newErrors.phonenumber = "Phone number must be 10 digits"; 
      } 
    }
    return newErrors;
  };
  const initialFormState = {
    atscompanyid: "",
    atstype: "",
    companyname: "",
    email: "",
    phonenumber: "",
  };
  const resetForm = () => {
    setForm(initialFormState);
    setErrors({});
  };
  const handleClose = () => {
    onClose();
    resetForm();
  };

  const handleSubmit = async () => {
    let url = `${process.env.REACT_APP_NEW_API_URL}`;
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const token = localStorage.getItem("token") || "";
      const userDetails = JSON.parse(localStorage.getItem("userDetails")) || {};
      const companyId = userDetails?.CompanyId;

      const body = {
        atscompanyid: form.atscompanyid,
        atstype: form.atstype,
        companyname: form.companyname,
        email: form.email,
        phonenumber: form.phonenumber,
        companyid: companyId,
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${url}/V2/ATSCompany`,
        body,
        config
      );
      if (response.data?.statusCode === 200) {
        onSuccess();
      }
      handleClose();
      if (response.data?.statusCode === 200) {
        dispatch(
          showSnackbar({
            message: response.data.message,
            type: SNACKBAR_TYPES.SUCCESS,
            position: SNACKBAR_POSITION.TOP_CENTER,
            autoClose: true,
            autoCloseDelay: 3000,
            maxWidth: 500,
          })
        );
      } else {
        dispatch(
          showSnackbar({
            message: "Something went wrong",
            type: SNACKBAR_TYPES.ERROR,
            position: SNACKBAR_POSITION.TOP_CENTER,
            autoClose: true,
            autoCloseDelay: 3000,
            maxWidth: 500,
          })
        );
      }
    } catch (err) {
      dispatch(
        showSnackbar({
          message: "Something went wrong",
          type: SNACKBAR_TYPES.ERROR,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 3000,
          maxWidth: 500,
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={handleClose}>
      <ModalHeader toggle={handleClose}>Add Client</ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label>ATS Type</Label>
          <Input
            type="select"
            name="atstype"
            value={form.atstype}
            onChange={handleChange}
          >
            <option value="">-- Select ATS Type --</option>
            <option value="Bullhorn">Bullhorn</option>
          </Input>
        </FormGroup>

        <FormGroup>
          <Label>Company Name<span className="text-danger">*</span></Label>
          <Input
            name="companyname"
            value={form.companyname}
            onChange={handleChange}
            invalid={!!errors.companyname}
          />
          <FormFeedback>{errors.companyname}</FormFeedback>
        </FormGroup>

        <FormGroup>
          <Label>Email<span className="text-danger">*</span></Label>
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            invalid={!!errors.email}
          />
          <FormFeedback>{errors.email}</FormFeedback>
        </FormGroup>

        <FormGroup>
          <Label>Phone Number</Label>
          <Input
            name="phonenumber"
            value={form.phonenumber}
            onChange={handleChange}
            invalid={!!errors.phonenumber}
          />
          <FormFeedback>{errors.phonenumber}</FormFeedback>
        </FormGroup>
      </ModalBody>

      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddClient;
