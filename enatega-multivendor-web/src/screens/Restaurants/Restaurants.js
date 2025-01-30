/* eslint-disable react-hooks/exhaustive-deps */
import { gql, useQuery } from "@apollo/client";
import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { restaurantList } from "../../apollo/server";
import FlashMessage from "../../components/FlashMessage";
import Footer from "../../components/Footer/Footer";
import { Header, LoginHeader } from "../../components/Header";
import { ClearCart } from "../../components/Modals";

import {
  RestaurantGrid,
  RestaurantRow,
  Subheader,
} from "../../components/RestaurantComponent";

import SearchContainer from "../../components/HomeScreen/SearchContainer/SearchContainer";
import { useLocationContext } from "../../context/Location";
import UserContext from "../../context/User";
import Analytics from "../../utils/analytics";
import useStyles from "./styles";
import DetailedOrderCard from "../../components/Orders/DetailedOrderCard/DetailedOrderCard";
import { ACTIVE_STATUS } from "../../utils/constantValues";

const RESTAURANTS = gql`
  ${restaurantList}
`;

function Restaurants() {
  const navigate = useNavigate();
  const { location } = useLocationContext();
  const [message, setMessage] = useState({});
  const [search, setSearch] = useState("");
  const { isLoggedIn } = useContext(UserContext);
  const [clearModal, setClearModal] = useState(false);
  const [navigateData, setNavigateData] = useState({});
  const classes = useStyles();
  const {
    orders,
    clearCart,
    restaurant: cartRestaurant,
  } = useContext(UserContext);


  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const activeOrders = orders.filter((o) =>
    ACTIVE_STATUS.includes(o.orderStatus)
  );
  const navigateClearCart = useCallback(async () => {
    await clearCart();
    navigate(`/restaurant/${navigateData.slug}`, { state: navigateData });
  }, [navigateData]);
  useEffect(async () => {
    await Analytics.track(Analytics.events.NAVIGATE_TO_RESTAURANTS);
  }, []);
  const checkCart = useCallback(
    (id, name, image, slug) => {
      if (cartRestaurant && id !== cartRestaurant) {
        setNavigateData({ id, name, image, slug });
        toggleClearCart();
        return false;
      }
      return true;
    },
    [cartRestaurant]
  );

  const toggleClearCart = useCallback(() => {
    setClearModal((prev) => !prev);
  }, []);

  const showMessage = useCallback((messageObj) => {
    setMessage(messageObj);
  }, []);
  const toggleSnackbar = useCallback(() => {
    setMessage({});
  }, []);

  const { data, loading, error } = useQuery(RESTAURANTS, {
    variables: {
      longitude: location?.longitude || null,
      latitude: location?.latitude || null,
      ip: null,
    },
    fetchPolicy: "network-only",
    skip: !location,
  });


  if (loading || error) {
    return (
      <Grid container>
        {isLoggedIn ? <Header /> : <LoginHeader showIcon />}
        <Subheader />

        <Box className={classes.spinnerContainer}>
          {loading ? (
            <CircularProgress color="primary" size={48} />
          ) : (
            <Typography>Unable to load data</Typography>
          )}
        </Box>
      </Grid>
    );
  }
  const { restaurants, sections } = data?.nearByRestaurants ?? {
    restaurants: [],
    sections: [],
  };
  const restaurantSections = sections.map((sec) => ({
    ...sec,
    restaurants: sec.restaurants
      .map((id) => restaurants.filter((res) => res._id === id))
      .flat(),
  }));


  console.log(data)
  const searchRestaurants = (searchText) => {
    const data = [];
    restaurants.forEach((restaurant) => {
      const regex = new RegExp(
        searchText.replace(/[\\[\]()+?.*]/g, (c) => "\\" + c),
        "i"
      );
      const result = restaurant.name.search(regex);
      if (result < 0) {
        const result = restaurant.categories.some((category) => {
          const result = category.title.search(regex);
          if (result < 0) {
            const result = category.foods.some((food) => {
              const result = food.title.search(regex);
              return result > -1;
            });
            return result;
          }
          return true;
        });
        if (!result) return;
      }
      data.push(restaurant);
    });
    return data;
  };
  return (
    <Grid container>
      <FlashMessage
        open={Boolean(message.type)}
        severity={message.type}
        alertMessage={message.message}
        handleClose={toggleSnackbar}
      />
      {isLoggedIn ? <Header /> : <LoginHeader showIcon />}
      <Subheader />
      <Box className={classes.searchWrapper}>
        <Grid container item>
          <SearchContainer
            loading={loading}
            isHome={false}
            search={search}
            setSearch={setSearch}
          />
        </Grid>
      </Box>
      {activeOrders.length > 0 ? (
        <Box
          style={{
            backgroundColor: theme.palette.button.lightest,
            padding: mobile ? "10px" : "80px 90px",
            width: "100%",
          }}
        >
          <Grid container spacing={2}>
            {activeOrders.map((item) => (
              <Grid key={item.id} item sm={12} xl={6} lg={6}>
                {mobile ? null : <DetailedOrderCard key={item._id} {...item} />}
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : null}

      <Box style={{ width: "100%", minHeight: "100vh" }}>
        <RestaurantGrid
          checkCart={checkCart}
          restaurants={search ? searchRestaurants(search) : restaurants}
          showMessage={showMessage}
          search={search}
        />
      </Box>

      {restaurantSections.length < 1 ? null : (
        <Box className={classes.topRestContainer}>
          <Box className={classes.topRestWrapper}>
            <Grid container item>
              <RestaurantRow
                checkCart={checkCart}
                restaurantSections={restaurantSections}
                showMessage={showMessage}
              />
            </Grid>
          </Box>
        </Box>
      )}

      <Box className={classes.footerContainer}>
        <Box className={classes.footerWrapper}>
          <Footer />
        </Box>
      </Box>
      <ClearCart
        isVisible={clearModal}
        toggleModal={toggleClearCart}
        action={navigateClearCart}
      />
    </Grid>
  );
}

export default Restaurants;
