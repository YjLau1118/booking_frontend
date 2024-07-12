import { Badge, Button, Card, Flex, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { IProduct } from "../../pages/user/home";
import { getImageById } from "../../utils/api/bucket";
import {
  Calendar,
  GasPump,
  SteeringWheel,
  Armchair,
  Pen,
  Ambulance,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { IHistory } from "../../pages/user/history";
import { formatDateWithTime } from "../../utils/common";
import BookingDetailsModal from "../modal/bookingDetailsModal";

const BookingHistoryCard = (props: IHistory) => {
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

  const [image, setImage] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    getImageById(props.product.productImage[0]).then((res) => {
      setImage(res.data);
    });
  }, [props]);

  return (
    <div>
      {!isMobile ? (
        <Card
          shadow="sm"
          padding="sm"
          radius="md"
          w={"836px"}
          withBorder
          mb={20}
        >
          <Flex justify={"space-between"} align={"flex-end"}>
            <Flex gap={30} align={"center"}>
              <img
                src={image}
                alt=""
                width={200}
                height={150}
                style={{ borderRadius: "10px" }}
              />
              <div
                style={{ display: "flex", flexDirection: "column", gap: "5px" }}
              >
                <Flex gap={20} align={"center"}>
                  <Badge>{props.product.productBrand}</Badge>
                  <Text fw={700} fs={"xl"}>
                    {props.product.productName}
                  </Text>
                </Flex>
                <Flex gap={20} align={"center"}>
                  <Pen size={20} />
                  <Text fw={700} fs={"xl"}>
                    {formatDateWithTime(props.createdAt)}
                  </Text>
                </Flex>
                <Flex gap={20} align={"center"}>
                  <Calendar size={20} />
                  <span style={{ display: "inline-flex" }}>
                    <Text fw={500} fs={"xl"}>
                      From&nbsp;
                    </Text>
                    <Text fw={700} fs={"xl"}>
                      {formatDateWithTime(props.startDate)}&nbsp;
                    </Text>
                    <Text fw={500} fs={"xl"}>
                      To&nbsp;
                    </Text>
                    <Text fw={700} fs={"xl"}>
                      {formatDateWithTime(props.endDate)}&nbsp;
                    </Text>
                  </span>
                </Flex>
                <Flex gap={20} align={"center"}>
                  <Ambulance size={20} />
                  <Text fw={700} fs={"xl"}>
                    {props.emergencyContact}
                  </Text>
                </Flex>
              </div>
            </Flex>
            <div>
              <Button w={"100%"} onClick={() => setOpen(true)}>
                Booking Details
              </Button>
            </div>
          </Flex>
        </Card>
      ) : (
        <Card shadow="sm" padding="sm" radius="md" withBorder mb={20}>
          <img
            src={image}
            alt=""
            width={"100%"}
            style={{ borderRadius: "10px" }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <Text fw={700} fs={"xl"} mt={"10px"}>
              {props.product.productName}
            </Text>

            <Flex gap={20} align={"center"}>
              <Pen size={20} />
              <Text fw={700} fs={"xl"}>
                {formatDateWithTime(props.createdAt)}
              </Text>
            </Flex>
            <Flex gap={20} align={"center"}>
              <Calendar size={20} />
              <span style={{ display: "inline-flex" }}>
                <Text fw={500} fs={"xl"}>
                  From&nbsp;
                </Text>
                <Text fw={700} fs={"xl"}>
                  {formatDateWithTime(props.startDate)}&nbsp;
                </Text>
                <Text fw={500} fs={"xl"}>
                  To&nbsp;
                </Text>
                <Text fw={700} fs={"xl"}>
                  {formatDateWithTime(props.endDate)}&nbsp;
                </Text>
              </span>
            </Flex>
            <Flex gap={20} align={"center"}>
              <Ambulance size={20} />
              <Text fw={700} fs={"xl"}>
                {props.emergencyContact}
              </Text>
            </Flex>
          </div>

          {/* <Flex mt={"20px"} justify={"space-between"} align={"center"}>
            <Text fw={600} style={{ fontSize: "30px" }}>
              ${props.productPricePerDay} / Day
            </Text>
            <Button w={"50%"} onClick={() => navigate(`/details/${props._id}`)}>
              Details
            </Button>
          </Flex> */}
        </Card>
        // <Card shadow="sm" padding="sm" radius="md" withBorder mb={20}>
        //   <img
        //     src={image}
        //     alt=""
        //     width={"100%"}
        //     height={150}
        //     style={{ borderRadius: "10px" }}
        //   />
        //   <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        //     <Flex gap={20} align={"center"}>
        //       <Badge w={"20%"}>{props.product.productBrand}</Badge>
        //       <Text fw={700} fs={"xl"}>
        //         {props.product.productName}
        //       </Text>
        //     </Flex>
        //     <Flex gap={20} align={"center"}>
        //       <Pen size={20} />
        //       <Text fw={700} fs={"xl"}>
        //         {formatDateWithTime(props.createdAt)}
        //       </Text>
        //     </Flex>
        //     <Flex gap={20} align={"center"}>
        //       <Calendar size={20} />
        //       <span style={{ display: "inline-flex" }}>
        //         <Text fw={500} fs={"xl"}>
        //           From&nbsp;
        //         </Text>
        //         <Text fw={700} fs={"xl"}>
        //           {formatDateWithTime(props.startDate)}&nbsp;
        //         </Text>
        //         <Text fw={500} fs={"xl"}>
        //           To&nbsp;
        //         </Text>
        //         <Text fw={700} fs={"xl"}>
        //           {formatDateWithTime(props.endDate)}&nbsp;
        //         </Text>
        //       </span>
        //     </Flex>
        //     <Flex gap={20} align={"center"}>
        //       <Ambulance size={20} />
        //       <Text fw={700} fs={"xl"}>
        //         {props.emergencyContact}
        //       </Text>
        //     </Flex>
        //   </div>

        //   <div>
        //     <Button w={"100%"} onClick={() => setOpen(true)}>
        //       Booking Details
        //     </Button>
        //   </div>
        // </Card>
      )}

      <BookingDetailsModal
        opened={open}
        onClose={() => setOpen(false)}
        id={props._id}
      ></BookingDetailsModal>
    </div>
  );
};

export default BookingHistoryCard;
