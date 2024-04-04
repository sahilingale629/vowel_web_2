import React from "react";
import Hero from "../Components/Hero/Hero";
import Popular from "../Components/Popular/Popular";
import Offers from "../Components/Offers/Offers";
import NewCollections from "../Components/NewCollections/NewCollections";
import NewsLetter from "../Components/NewsLetter/NewsLetter";

const Shop = () => {
  return (
    <div>
      <Hero />
      <Popular />
      <div style={{ visibility: "hidden", display: "block" }}>
        <Offers />
      </div>
      <NewCollections />
      <NewsLetter />
    </div>
  );
};
export default Shop;
