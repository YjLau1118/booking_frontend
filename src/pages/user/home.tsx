import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "../../styles/pages/user/user.module.scss";
import {
  Button,
  Card,
  Flex,
  RangeSlider,
  Select,
  TextInput,
  Text,
  Stack,
} from "@mantine/core";
import { FolderDashed, MagnifyingGlass } from "@phosphor-icons/react";
import { getProductList } from "../../utils/api/product";
import ProductDetailsCard from "../../components/product/ProductDetailsCard";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface IYearObject {
  label: string;
  value: string;
}

export interface IProduct {
  productName: string;
  productBrand: string;
  productModel: string;
  productPlate: string;
  productImage: string[];
  productType: string;
  productSeat: number;
  productManufacturingYear: number;
  productSeries: string;
  productFuelType: string;
  productMode: string;
  productVariant: string;
  productPricePerDay: number;
  _id: string;
  __v: number;
}

const HomePage = () => {
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
  const [productList, setProductList] = useState<IProduct[]>([]);
  const [manufacturing, setManufacturing] = useState<string | null>(null);
  const [mode, setMode] = useState<string | null>(null);
  const [seat, setSeat] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([
    0, 1000,
  ]);
  const [tempManufacturing, setTempManufacturing] = useState<string | null>(
    null
  );
  const [tempMode, setTempMode] = useState<string | null>(null);
  const [tempSeat, setTempSeat] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchText, setSearchText] = useState("");
  const [tempSearchText, setTempSearchText] = useState("");
  const refreshToken = useSelector(
    (state: RootState) => state.auth.refreshToken
  );
  const observer = useRef<IntersectionObserver | null>(null);

  const generateYearsArray = (
    startYear: number,
    endYear: number
  ): IYearObject[] => {
    const yearsArray: IYearObject[] = [];
    for (let year = startYear; year >= endYear; year--) {
      yearsArray.push({ label: year.toString(), value: year.toString() });
    }
    return yearsArray;
  };

  const currentYear: number = new Date().getFullYear();
  const productManufacturing: IYearObject[] = generateYearsArray(
    currentYear,
    2000
  );

  const fetchProductList = async (newPage: number) => {
    if (!refreshToken) {
      console.log("No refresh token found, skipping API call");
      return;
    }

    setLoading(true);
    const filters = [];

    if (manufacturing !== null) {
      filters.push({
        filterId: "productManufacturingYear",
        filterValue: manufacturing,
      });
    }

    if (mode !== null) {
      filters.push({ filterId: "productMode", filterValue: mode });
    }

    if (seat !== null) {
      filters.push({ filterId: "productSeat", filterValue: seat });
    }

    const res = await getProductList(
      newPage,
      10,
      undefined,
      undefined,
      filters,
      "productName,productBrand",
      searchText,
      priceRange[0],
      priceRange[1]
    );

    if (newPage === 1) {
      setProductList(res.data);
    } else {
      setProductList((prevList) => [...prevList, ...res.data]);
    }

    setHasMore(res.data.length > 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchProductList(page);
  }, [page]);

  useEffect(() => {
    setPage(1);
    fetchProductList(1);
  }, [priceRange, manufacturing, mode, seat, searchText, refreshToken]);

  const handleSubmit = () => {
    setManufacturing(tempManufacturing);
    setMode(tempMode);
    setSeat(tempSeat);
    setPriceRange(tempPriceRange);
    setSearchText(tempSearchText);
  };

  const lastProductElementRef = useCallback(
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div className={styles.pageContainer}>
      {!isMobile ? (
        <Card
          shadow="sm"
          padding="sm"
          radius="md"
          w={"836px"}
          mb={30}
          withBorder
        >
          <Flex align="center" justify="space-between" mb={"20px"}>
            <Select
              w={"30%"}
              placeholder="Manufacturing Year"
              data={productManufacturing}
              value={tempManufacturing}
              onChange={(val) => setTempManufacturing(val)}
            />
            <Select
              w={"40%"}
              placeholder="Product Mode"
              data={[
                { label: "Manual", value: "Manual" },
                { label: "Automatic", value: "Automatic" },
              ]}
              value={tempMode}
              onChange={(val) => setTempMode(val)}
            />

            <Button w={"20%"} onClick={handleSubmit}>
              Submit
            </Button>
          </Flex>
          <Flex align="center" justify="flex-start" gap={30}>
            <div style={{ width: "50%" }}>
              <Text fw={700} size="12px" mb={"5px"}>
                Price Range (Per Day)
              </Text>
              <RangeSlider
                w={"100%"}
                minRange={100}
                min={0}
                max={10000}
                step={100}
                value={tempPriceRange}
                onChange={setTempPriceRange}
                defaultValue={[0, 1000]}
              />
            </div>
            <TextInput
              w={"50%"}
              placeholder="Search"
              value={tempSearchText}
              onChange={(event) => setTempSearchText(event.currentTarget.value)}
              leftSection={<MagnifyingGlass size={20} />}
            />
          </Flex>
        </Card>
      ) : (
        <Card shadow="sm" padding="sm" radius="md" mb={30} withBorder>
          <Flex align="center" justify="space-between" gap={10} mb={"20px"}>
            <Select
              w={"50%"}
              placeholder="Manufacturing Year"
              data={productManufacturing}
              value={tempManufacturing}
              onChange={(val) => setTempManufacturing(val)}
            />
            <Select
              w={"50%"}
              placeholder="Product Mode"
              data={[
                { label: "Manual", value: "Manual" },
                { label: "Automatic", value: "Automatic" },
              ]}
              value={tempMode}
              onChange={(val) => setTempMode(val)}
            />
          </Flex>
          <Flex align="center" justify="flex-start" gap={30}>
            <div style={{ width: "50%" }}>
              <Text fw={700} size="12px" mb={"5px"}>
                Price Range (Per Day)
              </Text>
              <RangeSlider
                w={"100%"}
                minRange={100}
                min={0}
                max={10000}
                step={100}
                value={tempPriceRange}
                onChange={setTempPriceRange}
                defaultValue={[0, 1000]}
              />
            </div>
            <TextInput
              w={"50%"}
              placeholder="Search"
              value={tempSearchText}
              onChange={(event) => setTempSearchText(event.currentTarget.value)}
              leftSection={<MagnifyingGlass size={20} />}
            />
          </Flex>
          <Button w={"100%"} mt={"20px"} onClick={handleSubmit}>
            Submit
          </Button>
        </Card>
      )}

      {productList.length > 0 &&
        productList.map((item: IProduct, index: number) => {
          if (index === productList.length - 1) {
            return (
              <div ref={lastProductElementRef} key={index}>
                <ProductDetailsCard {...item} />
              </div>
            );
          } else {
            return <ProductDetailsCard key={index} {...item} />;
          }
        })}
      {productList.length < 1 && (
        <Stack>
          <FolderDashed size={200} color="#A9A9A9" />
          <Text
            fw={700}
            size="18px"
            c="#A9A9A9"
            style={{ textAlign: "center" }}
          >
            Nothing here...
          </Text>
        </Stack>
      )}
      {loading && <div>Loading...</div>}
    </div>
  );
};

export default HomePage;
