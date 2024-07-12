import React, { useEffect, useState } from "react";
import styles from "../../styles/pages/user/user.module.scss";
import { IProduct } from "./home";
import { getBookingList } from "../../utils/api/booking";
import BookingHistoryCard from "../../components/product/BookingHistoryCard";
import { Stack, Text } from "@mantine/core";
import { FolderDashed } from "@phosphor-icons/react";

export interface IHistory {
  _id: string;
  user: string;
  product: IProduct;
  startDate: Date;
  endDate: Date;
  emergencyContact: string;
  createdAt: Date;
}
const BookingHistory = () => {
  const [booking, setBooking] = useState<IHistory[]>([]);
  useEffect(() => {
    getBookingList().then((res) => {
      setBooking(res.data);
    });
  }, []);
  return (
    <div className={styles.pageContainer}>
      {booking.length > 0 &&
        booking.map((item, index) => (
          <BookingHistoryCard key={index} {...item} />
        ))}
      {booking.length < 1 && (
        <Stack>
          <FolderDashed size={200} color="#A9A9A9" />
          <Text
            fw={700}
            size="18px"
            c="#A9A9A9"
            style={{ textAlign: "center" }}
          >
            No booking yet...
          </Text>
        </Stack>
      )}
    </div>
  );
};

export default BookingHistory;
