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
import { createBooking, getBookingById } from "../../utils/api/booking";
import { CheckCircle } from "@phosphor-icons/react";
import { IHistory } from "../../pages/user/history";
import { IUser } from "./bookingModal";
import { formatDateWithTime } from "../../utils/common";

interface IProps {
  modalProps?: Partial<ModalBaseProps>;
  opened: boolean;
  onClose: () => void;
  id: string;
}

const BookingDetailsModal = (props: IProps) => {
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
  const [bookingDetail, setBookingDetail] = useState<IHistory>();
  const [user, setUser] = useState<IUser>();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  useEffect(() => {
    getBookingById(props.id).then((res) => {
      console.log(res.data);
      setBookingDetail(res.data);
    });
  }, [props.id]);

  useEffect(() => {
    if (bookingDetail) {
      getUserDetailsById(bookingDetail?.user).then((res) => {
        console.log(res.data);
        setUser(res.data);
      });
    }
  }, [bookingDetail]);

  useEffect(() => {
    if (bookingDetail?.startDate && bookingDetail?.endDate) {
      const startDate = new Date(bookingDetail?.startDate);
      const endDate = new Date(bookingDetail?.endDate);
      const days = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      setTotalPrice(days * bookingDetail?.product?.productPricePerDay);
    } else {
      setTotalPrice(0);
    }
  }, [bookingDetail]);

  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
      {...props.modalProps}
      radius={"sm"}
      padding={"20px"}
      title="Booking Details"
      fullScreen={isMobile}
      centered
    >
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
        <Text fw={400}>{bookingDetail?.emergencyContact}</Text>
      </Flex>
      <Divider m={"24px 0"} />
      <Text fw={700} mb={"10px"}>
        Car Details
      </Text>
      <div>
        <Text fw={700}>Name</Text>
        <Text fw={400}>{bookingDetail?.product?.productName}</Text>
      </div>
      <div>
        <Text fw={700}>Car Type</Text>
        <Text fw={400}>{bookingDetail?.product?.productType}</Text>
      </div>
      <Divider m={"24px 0"} />
      <Text fw={700} mb={"10px"}>
        Booking Details
      </Text>

      <Text fw={700}>Booking Date</Text>
      <span style={{ display: "inline-flex" }}>
        <Text fw={500} fs={"xl"}>
          From&nbsp;
        </Text>
        <Text fw={700} fs={"xl"}>
          {formatDateWithTime(bookingDetail?.startDate!)}&nbsp;
        </Text>
        <Text fw={500} fs={"xl"}>
          To&nbsp;
        </Text>
        <Text fw={700} fs={"xl"}>
          {formatDateWithTime(bookingDetail?.endDate!)}&nbsp;
        </Text>
      </span>

      <Flex justify={"space-between"} align={"center"} m={"20px 0"}>
        <Text fw={700}>Total Price</Text>
        <Text fw={700} size="40px">
          ${totalPrice}
        </Text>
      </Flex>
    </Modal>
  );
};

export default BookingDetailsModal;
