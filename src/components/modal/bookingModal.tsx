import {
  Button,
  Dialog,
  Divider,
  Flex,
  Grid,
  Group,
  Modal,
  ModalBaseProps,
  Text,
  TextInput,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { IProduct } from "../../pages/user/home";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getUserDetailsById } from "../../utils/api/user";
import { DatePickerInput } from "@mantine/dates";
import { createBooking } from "../../utils/api/booking";
import { CheckCircle } from "@phosphor-icons/react";

interface IProps {
  modalProps?: Partial<ModalBaseProps>;
  opened: boolean;
  onClose: () => void;
  product: IProduct;
}

export interface IUser {
  _id: string;
  username: string;
  email: string;
  phone: string;
  isAdmin: string;
}
const BookingModal = (props: IProps) => {
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

  const id = useSelector((state: RootState) => state.auth.id);
  const [user, setUser] = useState<IUser>();
  const [emergency, setEmegency] = useState<string>("");
  const [date, setDate] = useState<[Date | null, Date | null]>([null, null]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [openError, setOpenError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [disable, setDisable] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  useEffect(() => {
    getUserDetailsById(id).then((res) => {
      console.log(res.data);
      setUser(res.data);
    });
  }, [id]);

  useEffect(() => {
    if (date[0] && date[1]) {
      const startDate = new Date(date[0]);
      const endDate = new Date(date[1]);
      const days = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      setTotalPrice(days * props.product.productPricePerDay);
    } else {
      setTotalPrice(0);
    }
  }, [date, props.product.productPricePerDay]);

  console.log("date", date[0]);

  useEffect(() => {
    if (!props.opened) {
      setStep(1);
      setEmegency("");
      setDate([null, null]);
    }
  }, [props.opened]);

  const handleSubmit = async () => {
    setDisable(true);
    try {
      if (props.product && emergency !== "" && date[0] && date[1]) {
        await createBooking(props.product._id, date[0], date[1], emergency);
        console.log("Booking successful");
        setStep(2);
        setTimeout(() => {
          props.onClose();
        }, 5000);
      }
    } catch (err: any) {
      setOpenError(true);
      setError(err.message);
      setTimeout(() => {
        setOpenError(false);
        setError("");
      }, 5000);
    } finally {
      setDisable(false);
    }
  };

  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
      {...props.modalProps}
      radius={"sm"}
      padding={"20px"}
      title="Booking Details"
      centered
      fullScreen={isMobile}
    >
      {step === 1 && (
        <>
          <Text fw={700} mb={"10px"}>
            User Details
          </Text>
          <Flex justify={"space-between"} align={"center"} mb={"5px"}>
            <Text fw={700}>Name</Text>
            <Text fw={400}>{user?.username}</Text>
          </Flex>
          <Flex justify={"space-between"} align={"center"} mb={"5px"}>
            <Text fw={700}>Email</Text>
            <Text fw={400}>{user?.email}</Text>
          </Flex>
          <Flex justify={"space-between"} align={"center"} mb={"5px"}>
            <Text fw={700}>Phone Number</Text>
            <Text fw={400}>{user?.phone}</Text>
          </Flex>
          <Flex justify={"space-between"} align={"center"} mb={"5px"}>
            <Text fw={700}>Emergency Contact</Text>
            <TextInput
              placeholder="Emergency Contact"
              value={emergency}
              onChange={(event) => setEmegency(event.currentTarget.value)}
            />
          </Flex>
          <Divider m={"24px 0"} />
          <Text fw={700} mb={"10px"}>
            Car Details
          </Text>
          <div>
            <Text fw={700}>Name</Text>
            <Text fw={400}>{props.product?.productName}</Text>
          </div>
          <div>
            <Text fw={700}>Car Type</Text>
            <Text fw={400}>{props.product?.productType}</Text>
          </div>
          <Divider m={"24px 0"} />
          <Text fw={700} mb={"10px"}>
            Booking Details
          </Text>

          <Text fw={700} mb={"10px"}>
            Booking Date
          </Text>
          <DatePickerInput
            clearable
            minDate={new Date()}
            type="range"
            w={"100%"}
            placeholder="Pick date"
            value={date}
            onChange={setDate}
            error={!date && "Date cannot be null"}
          />

          <Flex justify={"space-between"} align={"center"} m={"20px 0"}>
            <Text fw={700}>Total Price</Text>
            <Text fw={700} size="40px">
              ${totalPrice}
            </Text>
          </Flex>
          <Button
            w={"100%"}
            onClick={() => handleSubmit()}
            disabled={disable || !emergency || !date[0] || !date[1]}
          >
            Booking Now
          </Button>
          <Dialog
            opened={openError}
            withCloseButton
            onClose={() => setOpenError(false)}
            size="lg"
            radius="md"
          >
            <Text size="sm" mb="xs" fw={700} c={"red"}>
              Error
            </Text>
            <Group align="flex-end">
              <Text size="sm" fw={500}>
                {error}
              </Text>
            </Group>
          </Dialog>
        </>
      )}
      {step === 2 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "50px",
          }}
        >
          <CheckCircle
            size={"100px"}
            weight="fill"
            color="green"
            style={{ marginTop: "50px" }}
          />
          <Text style={{ textAlign: "center" }}>Booking Confirmed</Text>
          <Text style={{ textAlign: "center" }} mb={"50px"}>
            Please check your email or visit your booking history to view your
            bookings.
          </Text>
        </div>
      )}
    </Modal>
  );
};

export default BookingModal;
