import React, { useEffect, useState } from "react";
import styles from "../../styles/pages/auth/auth.module.scss";
import {
  Button,
  Dialog,
  Divider,
  Group,
  PasswordInput,
  PinInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { forgetPassword, resetPassword, verifyPin } from "../../utils/api/auth";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const handleWindowSizeChange = () => {
    setWidth(typeof window !== "undefined" ? window.innerWidth : 0);
  };

  useEffect(() => {
    if (width <= 835) {
      setIsMobile(true);
    } else setIsMobile(false);
  }, [width]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleWindowSizeChange);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleWindowSizeChange);
      }
    };
  }, [width]);
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);

  const [openErrorStep1, setOpenErrorStep1] = useState<boolean>(false);
  const [errorStep1, setErrorStep1] = useState<string>("");
  const [disableStep1, setDisableStep1] = useState<boolean>(false);
  const [openErrorStep2, setOpenErrorStep2] = useState<boolean>(false);
  const [errorStep2, setErrorStep2] = useState<string>("");
  const [disableStep2, setDisableStep2] = useState<boolean>(false);
  const [openErrorStep3, setOpenErrorStep3] = useState<boolean>(false);
  const [errorStep3, setErrorStep3] = useState<string>("");
  const [disableStep3, setDisableStep3] = useState<boolean>(false);

  const forgetForm = useForm({
    initialValues: {
      email: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const verifyForm = useForm({
    initialValues: {
      pin: "",
    },

    validate: {
      pin: isNotEmpty("Verify Pin cannot be null"),
    },
  });

  const resetForm = useForm({
    initialValues: {
      password: "",
      confirmpwd: "",
    },

    validate: {
      password: isNotEmpty("Invalid Password"),
    },
  });
  const previousStep = () => {
    setStep(step - 1);
  };

  const nextStep = () => {
    setStep(step + 1);
  };
  const handleForgetPassword = () => {
    setDisableStep1(true);
    if (forgetForm.values.email) {
      forgetPassword(forgetForm.values.email)
        .then((res) => {
          console.log(res);
          nextStep();
          setDisableStep1(false);
        })
        .catch((err: any) => {
          setOpenErrorStep1(true);
          setDisableStep1(false);
          setErrorStep1(err.message);
          setTimeout(() => {
            setOpenErrorStep1(false);
            setErrorStep1("");
          }, 5000);
        });
    }
  };

  const handleVerifyPin = () => {
    setDisableStep2(true);
    if (verifyForm.values.pin) {
      verifyPin(forgetForm.values.email, verifyForm.values.pin)
        .then((res) => {
          console.log(res);
          nextStep();
        })
        .catch((err: any) => {
          setOpenErrorStep2(true);
          setDisableStep2(false);
          setErrorStep2(err.message);
          setTimeout(() => {
            setOpenErrorStep2(false);
            setErrorStep2("");
          }, 5000);
        });
    }
  };

  const handleResetPassword = () => {
    setDisableStep3(true);
    if (resetForm.values.password && resetForm.values.confirmpwd) {
      resetPassword(forgetForm.values.email, resetForm.values.password)
        .then((res) => {
          console.log(res);
          navigate("/login");
        })
        .catch((err: any) => {
          setOpenErrorStep3(true);
          setDisableStep3(false);
          setErrorStep3(err.message);
          setTimeout(() => {
            setOpenErrorStep3(false);
            setErrorStep3("");
          }, 5000);
        });
    }
  };
  console.log(verifyForm.errors.pin);

  const validatePassword = (a: string, b: string) => {
    return !(a === b);
  };
  return (
    <>
      {step === 1 && (
        <form onSubmit={forgetForm.onSubmit(() => handleForgetPassword())}>
          <div className={styles.container}>
            <Text className={styles.mainTitle} style={{ marginBottom: "3rem" }}>
              Car Booking Systems
            </Text>
            <Text className={styles.subTitle} style={{ marginBottom: "5rem" }}>
              Reset Password
            </Text>
            <TextInput
              style={{ marginBottom: "5rem" }}
              description="Please enter your email address to receive a verification pin."
              placeholder="Email"
              styles={{
                input: { padding: "1.5rem 1rem", borderRadius: "10px" },
              }}
              w={!isMobile ? "40%" : "90%"}
              {...forgetForm.getInputProps("email")}
            />
            <Button
              variant="outline"
              onClick={() => navigate("/login")}
              w={!isMobile ? "40%" : "90%"}
              size="lg"
              style={{ marginBottom: "1rem" }}
              styles={{ root: { borderRadius: "10px" } }}
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={
                Object.keys(forgetForm.errors).length !== 0 || disableStep1
              }
              w={!isMobile ? "40%" : "90%"}
              size="lg"
              style={{ marginBottom: "1rem" }}
              styles={{ root: { borderRadius: "10px" } }}
            >
              Next
            </Button>
          </div>
          <Dialog
            opened={openErrorStep1}
            withCloseButton
            onClose={() => setOpenErrorStep1(false)}
            size="lg"
            radius="md"
          >
            <Text size="sm" mb="xs" fw={700} c={"red"}>
              {errorStep1}
            </Text>
            <Group align="flex-end">
              <Text size="sm" fw={500}>
                Please check your email.
              </Text>
            </Group>
          </Dialog>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={verifyForm.onSubmit(() => handleVerifyPin())}>
          <div className={styles.container}>
            <Text className={styles.mainTitle} style={{ marginBottom: "3rem" }}>
              Car Booking Systems
            </Text>
            <Text className={styles.subTitle} style={{ marginBottom: "5rem" }}>
              Verify Pin
            </Text>
            <Stack gap={0} p={0} mb={"5rem"}>
              <PinInput
                length={6}
                size={!isMobile ? "xl" : "md"}
                type={"number"}
                {...verifyForm.getInputProps("pin")}
              />
              {verifyForm.errors.pin && (
                <p style={{ textAlign: "center", color: "red" }}>
                  Verify Pin cannot be null
                </p>
              )}
            </Stack>

            <Button
              variant="outline"
              onClick={() => previousStep()}
              w={!isMobile ? "40%" : "90%"}
              size="lg"
              style={{ marginBottom: "1rem" }}
              styles={{ root: { borderRadius: "10px" } }}
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={
                Object.keys(verifyForm.errors).length !== 0 || disableStep2
              }
              w={!isMobile ? "40%" : "90%"}
              size="lg"
              style={{ marginBottom: "1rem" }}
              styles={{ root: { borderRadius: "10px" } }}
            >
              Next
            </Button>
          </div>
          <Dialog
            opened={openErrorStep2}
            withCloseButton
            onClose={() => setOpenErrorStep2(false)}
            size="lg"
            radius="md"
          >
            <Text size="sm" mb="xs" fw={700} c={"red"}>
              {errorStep2}
            </Text>
            <Group align="flex-end">
              <Text size="sm" fw={500}>
                Make sure enter the correct pin number
              </Text>
            </Group>
          </Dialog>
        </form>
      )}
      {step === 3 && (
        <form onSubmit={resetForm.onSubmit(() => handleResetPassword())}>
          <div className={styles.container}>
            <Text className={styles.mainTitle} style={{ marginBottom: "3rem" }}>
              Car Booking Systems
            </Text>
            <Text className={styles.subTitle} style={{ marginBottom: "5rem" }}>
              Reset Password
            </Text>
            <PasswordInput
              style={{ marginBottom: "2rem" }}
              placeholder="Password"
              styles={{
                input: { padding: "1.5rem 1rem", borderRadius: "10px" },
              }}
              w={!isMobile ? "40%" : "90%"}
              {...resetForm.getInputProps("password")}
            />
            <PasswordInput
              style={{ marginBottom: "5rem" }}
              placeholder="Confirm Password"
              styles={{
                input: { padding: "1.5rem 1rem", borderRadius: "10px" },
              }}
              w={!isMobile ? "40%" : "90%"}
              onChange={(e) => {
                resetForm.setFieldValue("confirmpwd", e.currentTarget.value);
              }}
              error={
                resetForm.values.confirmpwd !== resetForm.values.password &&
                "Passwords do not match"
              }
            />
            <Button
              variant="outline"
              onClick={() => navigate("/login")}
              w={!isMobile ? "40%" : "90%"}
              size="lg"
              style={{ marginBottom: "1rem" }}
              styles={{ root: { borderRadius: "10px" } }}
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={
                disableStep3 ||
                !resetForm.isValid("password") ||
                resetForm.values.password.length <= 0 ||
                validatePassword(
                  resetForm.values.password,
                  resetForm.values.confirmpwd
                )
              }
              w={!isMobile ? "40%" : "90%"}
              size="lg"
              style={{ marginBottom: "1rem" }}
              styles={{ root: { borderRadius: "10px" } }}
            >
              Next
            </Button>
          </div>
          <Dialog
            opened={openErrorStep3}
            withCloseButton
            onClose={() => setOpenErrorStep2(false)}
            size="lg"
            radius="md"
          >
            <Text size="sm" mb="xs" fw={700} c={"red"}>
              {errorStep3}
            </Text>
            <Group align="flex-end">
              <Text size="sm" fw={500}>
                Make sure the password is matched
              </Text>
            </Group>
          </Dialog>
        </form>
      )}
    </>
  );
};

export default ForgetPassword;
