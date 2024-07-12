import { Badge, Button, Card, Flex, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { IProduct } from "../../pages/user/home";
import { getImageById } from "../../utils/api/bucket";
import {
  Calendar,
  GasPump,
  SteeringWheel,
  Armchair,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
const ProductDetailsCard = (props: IProduct) => {
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
  const navigate = useNavigate();
  useEffect(() => {
    getImageById(props.productImage[0]).then((res) => {
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
                  <Badge>{props.productBrand}</Badge>
                  <Text fw={700} fs={"xl"}>
                    {props.productName}
                  </Text>
                </Flex>
                <Flex gap={20} align={"center"}>
                  <Calendar size={20} />
                  <Text fw={500} fs={"xl"}>
                    {props.productManufacturingYear}
                  </Text>
                </Flex>
                <Flex gap={20} align={"center"}>
                  <GasPump size={20} />
                  <Text fw={500} fs={"xl"}>
                    {props.productType}
                  </Text>
                </Flex>
                <Flex gap={20} align={"center"}>
                  <SteeringWheel size={20} />
                  <Text fw={500} fs={"xl"}>
                    {props.productMode}
                  </Text>
                </Flex>
                <Flex gap={20} align={"center"}>
                  <Armchair size={20} />
                  <Text fw={500} fs={"xl"}>
                    {props.productSeat} Seats
                  </Text>
                </Flex>
              </div>
            </Flex>
            <div>
              <Text fw={600} style={{ fontSize: "18px" }}>
                ${props.productPricePerDay} / Day
              </Text>
              <Button
                w={"100%"}
                onClick={() => navigate(`/details/${props._id}`)}
              >
                Details
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
              {props.productName}
            </Text>

            <Flex gap={20} align={"center"}>
              <Calendar size={20} />
              <Text fw={500} fs={"xl"}>
                {props.productManufacturingYear}
              </Text>
            </Flex>
            <Flex gap={20} align={"center"}>
              <GasPump size={20} />
              <Text fw={500} fs={"xl"}>
                {props.productType}
              </Text>
            </Flex>
            <Flex gap={20} align={"center"}>
              <SteeringWheel size={20} />
              <Text fw={500} fs={"xl"}>
                {props.productMode}
              </Text>
            </Flex>
            <Flex gap={20} align={"center"}>
              <Armchair size={20} />
              <Text fw={500} fs={"xl"}>
                {props.productSeat} Seats
              </Text>
            </Flex>
          </div>
          <Flex mt={"20px"} justify={"space-between"} align={"center"}>
            <Text fw={600} style={{ fontSize: "30px" }}>
              ${props.productPricePerDay} / Day
            </Text>
            <Button w={"50%"} onClick={() => navigate(`/details/${props._id}`)}>
              Details
            </Button>
          </Flex>
        </Card>
      )}
    </div>
  );
};

export default ProductDetailsCard;
