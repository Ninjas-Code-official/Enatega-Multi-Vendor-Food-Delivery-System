import React, { useState, useContext } from "react";
import { LoginHeader } from "../../components/Header";
import NewFooter from "../../components/Footer/newFooter/NewFooter";
import FormCard from "../../components/FormCard/FormCard";
import DoubleTextFieldRow from "../../components/DoubleTextField/DoubleTextField";
import SingleTextField from "../../components/Textfield/TextField";
import PhoneTextField from "../../components/PhoneTextField/PhoneTextField";
import SubmitButton from "../../components/SubmitButton/SubmitButton";
import { sendEmail } from "../../utils/emailService";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import HerosectionLoginPages from "../../components/HeroSectionLoginPage/HeroSectionLoginPage";
import PlaceholderComponent from "../../components/Placeholder/Placeholder";
import TermsAndConditions from "../../components/Terms&Condition/Terms&Condition";
import vendorImage from "../../assets/images/vendor-img.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import UserContext from "../../context/User";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const BecomeAVendor = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useContext(UserContext);

  const { planData } = location.state || {};

  const [formData, setFormData] = useState({
    storeName: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    city: "",
    postalAddress: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
    plan: planData?.name || "",
  });

  const [alert, setAlert] = useState({
    open: false,
    severity: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { password, confirmPassword, email } = formData;

    if (!formData.termsAccepted) {
      setAlert({
        open: true,
        severity: "error",
        message: "termsRequired",
      });
      return;
    }

    if (!formData.phoneNumber) {
      setAlert({
        open: true,
        severity: "error",
        message: "mobileErr1",
      });
      return;
    }

    const phoneRegex = /^\+?[0-9]{7,15}$/; // Adjust based on desired format
    if (!phoneRegex.test(formData.phoneNumber)) {
      setAlert({
        open: true,
        severity: "error",
        message: "enterValidPhone", // Replace with translation key if applicable
      });
      return;
    }

    if (password !== confirmPassword) {
      setAlert({
        open: true,
        severity: "error",
        message: "passNotMatch",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAlert({
        open: true,
        severity: "error",
        message: `${t("enterValidEmail")}`,
      });
      return;
    }

    setLoading(true);

    const templateParams = {
      ...formData,
      role: "Vendor Registration",
      isRider: false,
    };
    sendEmail("template_eogfh2k", templateParams)
      .then((response) => {
        console.log("Email sent successfully!", response.status, response.text);
        setAlert({
          open: true,
          severity: "success",
          message: "formSubmission",
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
          termsAccepted: false,
        });
        navigate("/EmailConfirmation");
      })
      .catch((error) => {
        console.error("Failed to send email:", error);
        setAlert({
          open: true,
          severity: "error",
          message: "notFormSubmission",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert({ ...alert, open: false });
  };

  const formComponent = (
    <FormCard heading="getStartedToday">
      <form onSubmit={handleSubmit}>
        <DoubleTextFieldRow
          placeholder1={t("firstName")}
          name1="firstName"
          value1={formData.firstName}
          placeholder2={t("lastName")}
          name2="lastName"
          value2={formData.lastName}
          onChange={handleChange}
          required
        />
        <SingleTextField
          placeholder={t("emailAddress")}
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <PhoneTextField
          placeholder={t("phoneNumber")}
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
        <SingleTextField
          placeholder={t("password")}
          name="password"
          value={formData.password}
          onChange={handleChange}
          isPassword={true}
          required
        />
        <SingleTextField
          placeholder={t("confirmPassword")}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          isPassword={true}
          required
        />
        <TermsAndConditions
          name="termsAccepted"
          checked={formData.termsAccepted} // Pass checkbox state
          required
          onChange={handleChange}
        />
        <SubmitButton label={t("submit")} type="submit" loading={loading} />
      </form>
    </FormCard>
  );

  return (
    <div>
      {isLoggedIn ? <Header /> : <LoginHeader showIcon />}
      <HerosectionLoginPages
        headingText="vendorHeading"
        descriptionText="vendorDescription"
      />
      <PlaceholderComponent
        imageSrc={vendorImage}
        formComponent={formComponent}
      />
      <NewFooter />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert severity={alert.severity} sx={{ width: "100%" }}>
          {t(alert.message)}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default BecomeAVendor;
