import React, { useEffect, useState } from "react";
import { IHistory } from "../../pages/user/history";
import { Button, Card, Stack, Table, Text } from "@mantine/core";
import { getUserDetailsById } from "../../utils/api/user";
import { IUser } from "../modal/bookingModal";
import { formatDateWithTime } from "../../utils/common";
import BookingDetailsModal from "../modal/bookingDetailsModal";

interface IBookingList {
  bookings: IHistory[];
}

const BookingTable = (props: IBookingList) => {
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

  const [users, setUsers] = useState<{ [key: string]: IUser }>({});
  const [open, setOpen] = useState<boolean>(false);
  const [bookingId, setBookingId] = useState("");
  useEffect(() => {
    const fetchUserDetails = async () => {
      const userPromises = props.bookings.map((booking) =>
        getUserDetailsById(booking.user)
      );
      const userResponses = await Promise.all(userPromises);
      const usersData = userResponses.reduce((acc, res, index) => {
        acc[props.bookings[index].user] = res.data;
        return acc;
      }, {} as { [key: string]: IUser });
      setUsers(usersData);
    };

    fetchUserDetails();
  }, [props.bookings]);

  const handleOpenModal = (id: string) => {
    setBookingId(id);
    setOpen(true);
  };

  const rows = props.bookings.map((booking, index) => (
    <Table.Tr key={booking._id}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{booking._id}</Table.Td>
      <Table.Td>{users[booking.user]?.username}</Table.Td>
      <Table.Td>
        {booking?.product?.productName || "Product Name Unavailable"}
      </Table.Td>
      <Table.Td>{formatDateWithTime(booking.createdAt)}</Table.Td>
      <Table.Td>
        <Button onClick={() => handleOpenModal(booking._id)}>Details</Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      {!isMobile ? (
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>No</Table.Th>
              <Table.Th>Booking Id</Table.Th>
              <Table.Th>Username</Table.Th>
              <Table.Th>Product Name</Table.Th>
              <Table.Th>Created At</Table.Th>
              <Table.Th>Details</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      ) : (
        <>
          {props.bookings.map((booking, index) => (
            <Card
              shadow="sm"
              padding="sm"
              radius="md"
              withBorder
              mb={20}
              key={booking._id}
            >
              <Stack gap={10}>
                <div>
                  <Text fw={700}>Booking Id</Text>
                  <Text fw={400}>{booking._id}</Text>
                </div>
                <div>
                  <Text fw={700}>Username</Text>
                  <Text fw={400}>{users[booking.user]?.username}</Text>
                </div>
                <div>
                  <Text fw={700}>Product Name</Text>
                  <Text fw={400}>
                    {booking?.product?.productName ||
                      "Product Name Unavailable"}
                  </Text>
                </div>
                <div>
                  <Text fw={700}>Created At</Text>
                  <Text fw={400}>{formatDateWithTime(booking.createdAt)}</Text>
                </div>
                <div>
                  <Button
                    onClick={() => handleOpenModal(booking._id)}
                    w={"100%"}
                  >
                    Details
                  </Button>
                </div>
              </Stack>
            </Card>
          ))}
        </>
      )}

      <BookingDetailsModal
        opened={open}
        onClose={() => setOpen(false)}
        id={bookingId}
      />
    </>
  );
};

export default BookingTable;
