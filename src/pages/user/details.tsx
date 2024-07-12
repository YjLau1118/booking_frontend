import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/pages/user/user.module.scss";
import { Carousel } from "@mantine/carousel";
import { useNavigate, useParams } from "react-router-dom";
import { IProduct } from "./home";
import { getProductDetailsById } from "../../utils/api/product";
import { getImageById } from "../../utils/api/bucket";
import Autoplay from "embla-carousel-autoplay";
import { Button, Card, Flex, Grid, Text } from "@mantine/core";
import {
  Armchair,
  Calendar,
  CarProfile,
  CarSimple,
  CurrencyDollar,
  GasPump,
  Gear,
  Key,
  Rewind,
  SteeringWheel,
  Usb,
} from "@phosphor-icons/react";
import BookingModal from "../../components/modal/bookingModal";

const Details = () => {
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
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const autoplay = useRef(Autoplay({ delay: 3000 }));
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    if (id) {
      getProductDetailsById(id).then((res) => {
        setProduct(res?.data);
      });
    }
  }, [id]);

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
  console.log(images);

  const getImageSlides = () => {
    return images.map((item, index) => (
      <>
        {!isMobile ? (
          <Carousel.Slide key={index}>
            <img src={item} alt="" width={"836px"} height={"500px"} />
          </Carousel.Slide>
        ) : (
          <Carousel.Slide key={index}>
            <img src={item} alt="" width={"100%"} height={"250px"} />
          </Carousel.Slide>
        )}
      </>
    ));
  };

  const slides = getImageSlides();

  return (
    <div className={styles.pageContainer}>
      {!isMobile ? (
        <div style={{ width: "836px" }}>
          <Rewind size={"25px"} onClick={() => navigate("/")} />
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
          {product && (
            <>
              <Text m={"20px 0"} fw={700} size="30px">
                {product.productName}
              </Text>
              <Flex gap={30} align={"center"} mb={"20px"}>
                <Flex gap={10} align={"center"}>
                  <Calendar size={20} />
                  <Text fw={500} fs={"xl"}>
                    {product.productManufacturingYear}
                  </Text>
                </Flex>
                <Flex gap={10} align={"center"}>
                  <SteeringWheel size={20} />
                  <Text fw={500} fs={"xl"}>
                    {product.productMode}
                  </Text>
                </Flex>
                <Flex gap={10} align={"center"}>
                  <CarProfile size={20} />
                  <Text fw={500} fs={"xl"}>
                    {product.productType}
                  </Text>
                </Flex>
                <Flex gap={10} align={"center"}>
                  <Armchair size={20} />
                  <Text fw={500} fs={"xl"}>
                    {product.productSeat} Seats
                  </Text>
                </Flex>
              </Flex>
              <Card
                shadow="sm"
                padding="sm"
                radius="md"
                w={"836px"}
                withBorder
                mb={20}
              >
                <Text fw={500} size="25px">
                  Car Specifications
                </Text>
                <Grid mt={"40px"} gutter={"5rem"}>
                  <Grid.Col span={5}>
                    <Flex
                      gap={10}
                      align={"center"}
                      justify={"space-between"}
                      mb={"30px"}
                    >
                      <Flex gap={10} align={"center"}>
                        <Key size={20} color="#A9A9A9" />
                        <Text fw={300} size="18px" c={"#A9A9A9"}>
                          Brand
                        </Text>
                      </Flex>
                      <Text fw={500} size="18px">
                        {product.productBrand}
                      </Text>
                    </Flex>
                    <Flex
                      gap={10}
                      align={"center"}
                      justify={"space-between"}
                      mb={"30px"}
                    >
                      <Flex gap={10} align={"center"}>
                        <CarSimple size={20} color="#A9A9A9" />
                        <Text fw={300} size="18px" c={"#A9A9A9"}>
                          Model
                        </Text>
                      </Flex>
                      <Text fw={500} size="18px">
                        {product.productModel}
                      </Text>
                    </Flex>
                    <Flex
                      gap={10}
                      align={"center"}
                      justify={"space-between"}
                      mb={"30px"}
                    >
                      <Flex gap={10} align={"center"}>
                        <Calendar size={20} color="#A9A9A9" />
                        <Text fw={300} size="18px" c={"#A9A9A9"}>
                          Year
                        </Text>
                      </Flex>
                      <Text fw={500} size="18px">
                        {product.productManufacturingYear}
                      </Text>
                    </Flex>
                    <Flex
                      gap={10}
                      align={"center"}
                      justify={"space-between"}
                      mb={"30px"}
                    >
                      <Flex gap={10} align={"center"}>
                        <Gear size={20} color="#A9A9A9" />
                        <Text fw={300} size="18px" c={"#A9A9A9"}>
                          Variant
                        </Text>
                      </Flex>
                      <Text fw={500} size="18px">
                        {product.productVariant || "-"}
                      </Text>
                    </Flex>
                  </Grid.Col>

                  <Grid.Col span={5}>
                    <Flex
                      gap={10}
                      align={"center"}
                      justify={"space-between"}
                      mb={"30px"}
                    >
                      <Flex gap={10} align={"center"}>
                        <Usb size={20} color="#A9A9A9" />
                        <Text fw={300} size="18px" c={"#A9A9A9"}>
                          Series
                        </Text>
                      </Flex>
                      <Text fw={500} size="18px">
                        {product.productSeries || "-"}
                      </Text>
                    </Flex>
                    <Flex
                      gap={10}
                      align={"center"}
                      justify={"space-between"}
                      mb={"30px"}
                    >
                      <Flex gap={10} align={"center"}>
                        <CarProfile size={20} color="#A9A9A9" />
                        <Text fw={300} size="18px" c={"#A9A9A9"}>
                          Type
                        </Text>
                      </Flex>
                      <Text fw={500} size="18px">
                        {product.productType || "-"}
                      </Text>
                    </Flex>
                    <Flex
                      gap={10}
                      align={"center"}
                      justify={"space-between"}
                      mb={"30px"}
                    >
                      <Flex gap={10} align={"center"}>
                        <Armchair size={20} color="#A9A9A9" />
                        <Text fw={300} size="18px" c={"#A9A9A9"}>
                          Seats
                        </Text>
                      </Flex>
                      <Text fw={500} size="18px">
                        {product.productSeat}
                      </Text>
                    </Flex>
                    <Flex gap={10} align={"center"} justify={"space-between"}>
                      <Flex gap={10} align={"center"}>
                        <GasPump size={20} color="#A9A9A9" />
                        <Text fw={300} size="18px" c={"#A9A9A9"}>
                          Fuel Type
                        </Text>
                      </Flex>
                      <Text fw={500} size="18px">
                        {product.productFuelType || "-"}
                      </Text>
                    </Flex>
                  </Grid.Col>
                </Grid>
              </Card>
              <Flex justify={"space-between"} align={"center"} m={"50px 0"}>
                <Flex gap={50} align={"center"} justify={"space-between"}>
                  <Flex gap={10} align={"center"}>
                    <CurrencyDollar size={20} color="#A9A9A9" />
                    <Text fw={300} size="18px" c={"#A9A9A9"}>
                      Price per day
                    </Text>
                  </Flex>
                  <Text fw={500} size="30px">
                    $ {product.productPricePerDay} / Day
                  </Text>
                </Flex>
                <Button w={"30%"} size="lg" onClick={() => setOpen(true)}>
                  Booking
                </Button>
              </Flex>
            </>
          )}
        </div>
      ) : (
        <div>
          <Rewind size={"25px"} onClick={() => navigate("/")} />
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
          {product && (
            <>
              <Text m={"20px 0"} fw={700} size="30px">
                {product.productName}
              </Text>
              <Flex justify={"space-between"} align={"center"} mb={"20px"}>
                <Flex gap={10} align={"center"}>
                  <Calendar size={20} />
                  <Text fw={500} fs={"xl"}>
                    {product.productManufacturingYear}
                  </Text>
                </Flex>
                <Flex gap={10} align={"center"}>
                  <SteeringWheel size={20} />
                  <Text fw={500} fs={"xl"}>
                    {product.productMode}
                  </Text>
                </Flex>
                <Flex gap={10} align={"center"}>
                  <CarProfile size={20} />
                  <Text fw={500} fs={"xl"}>
                    {product.productType}
                  </Text>
                </Flex>
                <Flex gap={10} align={"center"}>
                  <Armchair size={20} />
                  <Text fw={500} fs={"xl"}>
                    {product.productSeat}
                  </Text>
                </Flex>
              </Flex>
              <Card shadow="sm" padding="lg" radius="md" withBorder mb={20}>
                <Text fw={500} size="25px" mb={"20px"}>
                  Car Specifications
                </Text>
                <Flex
                  gap={10}
                  align={"center"}
                  justify={"space-between"}
                  mb={"30px"}
                >
                  <Flex gap={10} align={"center"}>
                    <Key size={20} color="#A9A9A9" />
                    <Text fw={300} size="18px" c={"#A9A9A9"}>
                      Brand
                    </Text>
                  </Flex>
                  <Text fw={500} size="18px">
                    {product.productBrand}
                  </Text>
                </Flex>
                <Flex
                  gap={10}
                  align={"center"}
                  justify={"space-between"}
                  mb={"30px"}
                >
                  <Flex gap={10} align={"center"}>
                    <CarSimple size={20} color="#A9A9A9" />
                    <Text fw={300} size="18px" c={"#A9A9A9"}>
                      Model
                    </Text>
                  </Flex>
                  <Text fw={500} size="18px">
                    {product.productModel}
                  </Text>
                </Flex>
                <Flex
                  gap={10}
                  align={"center"}
                  justify={"space-between"}
                  mb={"30px"}
                >
                  <Flex gap={10} align={"center"}>
                    <Calendar size={20} color="#A9A9A9" />
                    <Text fw={300} size="18px" c={"#A9A9A9"}>
                      Year
                    </Text>
                  </Flex>
                  <Text fw={500} size="18px">
                    {product.productManufacturingYear}
                  </Text>
                </Flex>
                <Flex
                  gap={10}
                  align={"center"}
                  justify={"space-between"}
                  mb={"30px"}
                >
                  <Flex gap={10} align={"center"}>
                    <Gear size={20} color="#A9A9A9" />
                    <Text fw={300} size="18px" c={"#A9A9A9"}>
                      Variant
                    </Text>
                  </Flex>
                  <Text fw={500} size="18px">
                    {product.productVariant || "-"}
                  </Text>
                </Flex>

                <Flex
                  gap={10}
                  align={"center"}
                  justify={"space-between"}
                  mb={"30px"}
                >
                  <Flex gap={10} align={"center"}>
                    <Usb size={20} color="#A9A9A9" />
                    <Text fw={300} size="18px" c={"#A9A9A9"}>
                      Series
                    </Text>
                  </Flex>
                  <Text fw={500} size="18px">
                    {product.productSeries || "-"}
                  </Text>
                </Flex>
                <Flex
                  gap={10}
                  align={"center"}
                  justify={"space-between"}
                  mb={"30px"}
                >
                  <Flex gap={10} align={"center"}>
                    <CarProfile size={20} color="#A9A9A9" />
                    <Text fw={300} size="18px" c={"#A9A9A9"}>
                      Type
                    </Text>
                  </Flex>
                  <Text fw={500} size="18px">
                    {product.productType || "-"}
                  </Text>
                </Flex>
                <Flex
                  gap={10}
                  align={"center"}
                  justify={"space-between"}
                  mb={"30px"}
                >
                  <Flex gap={10} align={"center"}>
                    <Armchair size={20} color="#A9A9A9" />
                    <Text fw={300} size="18px" c={"#A9A9A9"}>
                      Seats
                    </Text>
                  </Flex>
                  <Text fw={500} size="18px">
                    {product.productSeat}
                  </Text>
                </Flex>
                <Flex gap={10} align={"center"} justify={"space-between"}>
                  <Flex gap={10} align={"center"}>
                    <GasPump size={20} color="#A9A9A9" />
                    <Text fw={300} size="18px" c={"#A9A9A9"}>
                      Fuel Type
                    </Text>
                  </Flex>
                  <Text fw={500} size="18px">
                    {product.productFuelType || "-"}
                  </Text>
                </Flex>
              </Card>
              <Flex justify={"space-between"} align={"center"} m={"50px 0"}>
                <Flex gap={10} align={"center"}>
                  <CurrencyDollar size={20} color="#A9A9A9" />
                  <Text fw={300} size="18px" c={"#A9A9A9"}>
                    Price per day
                  </Text>
                </Flex>
                <Text fw={500} size="30px">
                  $ {product.productPricePerDay} / Day
                </Text>
              </Flex>
              <Button w={"100%"} size="lg" onClick={() => setOpen(true)}>
                Booking
              </Button>
            </>
          )}
        </div>
      )}

      {product && (
        <BookingModal
          opened={open}
          onClose={() => setOpen(false)}
          product={product}
        />
      )}
    </div>
  );
};

export default Details;
