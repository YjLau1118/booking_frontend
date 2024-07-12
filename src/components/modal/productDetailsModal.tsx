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
import React, { useEffect, useRef, useState } from "react";
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
import { getProductDetailsById } from "../../utils/api/product";
import { getImageById } from "../../utils/api/bucket";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";

interface IProps {
  modalProps?: Partial<ModalBaseProps>;
  opened: boolean;
  onClose: () => void;
  id: string;
  onProductDetail: () => void;
}

const ProductDetailsModal = (props: IProps) => {
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
  const [product, setProduct] = useState<IProduct | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const autoplay = useRef(Autoplay({ delay: 3000 }));
  useEffect(() => {
    props.onProductDetail();
    if (props.id) {
      getProductDetailsById(props.id).then((res) => {
        setProduct(res?.data);
      });
    }
  }, [props.id]);
  console.log(props.id);
  useEffect(() => {
    const fetchImages = async () => {
      if (product && product.productImage) {
        const imagePromises = product.productImage.map((imageId) =>
          getImageById(imageId)
        );
        const imageResults = await Promise.all(imagePromises);
        const imageData = imageResults.map((result) => result.data);
        setImages(imageData);
      }
    };

    fetchImages();
  }, [product]);
  console.log(product);
  const getImageSlides = () => {
    return images.map((item, index) => (
      <Carousel.Slide key={index}>
        <img src={item} alt="" width={"100%"} height={"250px"} />
      </Carousel.Slide>
    ));
  };

  const slides = getImageSlides();
  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
      {...props.modalProps}
      radius={"sm"}
      padding={"20px"}
      title="Car Details"
      size={500}
      centered
      fullScreen={isMobile}
    >
      <Carousel
        align={"center"}
        withIndicators
        slideGap="md"
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={autoplay.current.reset}
      >
        {slides}
      </Carousel>
      <Text fw={700} mb={"20px"}>
        {product?.productName}
      </Text>
      <Flex justify={"space-between"} align={"center"} mb={"5px"}>
        <Text fw={700}>Brand</Text>
        <Text fw={400}>{product?.productBrand}</Text>
      </Flex>
      <Flex justify={"space-between"} align={"center"} mb={"5px"}>
        <Text fw={700}>Model</Text>
        <Text fw={400}>{product?.productModel}</Text>
      </Flex>
      <Flex justify={"space-between"} align={"center"} mb={"5px"}>
        <Text fw={700}>Plate</Text>
        <Text fw={400}>{product?.productPlate}</Text>
      </Flex>
      <Flex justify={"space-between"} align={"center"} mb={"5px"}>
        <Text fw={700}>Variant</Text>
        <Text fw={400}>{product?.productVariant}</Text>
      </Flex>
      <Flex justify={"space-between"} align={"center"} mb={"5px"}>
        <Text fw={700}>Series</Text>
        <Text fw={400}>{product?.productSeries}</Text>
      </Flex>
      <Flex justify={"space-between"} align={"center"} mb={"5px"}>
        <Text fw={700}>Type</Text>
        <Text fw={400}>{product?.productType}</Text>
      </Flex>
      <Flex justify={"space-between"} align={"center"} mb={"5px"}>
        <Text fw={700}>Seat</Text>
        <Text fw={400}>{product?.productSeat}</Text>
      </Flex>
      <Flex justify={"space-between"} align={"center"} mb={"5px"}>
        <Text fw={700}>Manufacturing Year</Text>
        <Text fw={400}>{product?.productManufacturingYear}</Text>
      </Flex>
      <Flex justify={"space-between"} align={"center"} mb={"5px"}>
        <Text fw={700}>Mode</Text>
        <Text fw={400}>{product?.productMode}</Text>
      </Flex>
      <Flex justify={"space-between"} align={"center"} mb={"5px"}>
        <Text fw={700}>Fuel Type</Text>
        <Text fw={400}>{product?.productFuelType}</Text>
      </Flex>
      <Flex justify={"space-between"} align={"center"} mb={"5px"}>
        <Text fw={700}>Price Per Day</Text>
        <Text fw={400}>{product?.productPricePerDay}</Text>
      </Flex>
    </Modal>
  );
};

export default ProductDetailsModal;
