import React, { Component } from "react";
import FilterDropDown from "./Components/FilterDropDown/FilterDropDown";

function App() {
  const onOptionChangeHandler = (event) => {
    console.log("User Selected Value - ", event.target.value);
  };
  return (
    <div className="App">
      <FilterDropDown
        options={["Apple", "Samsung", "Xiaomi", "Huawei", "LG", "OnePlus"]}
        title="Manufacturer"
        onSelectOption={onOptionChangeHandler}
      />
      <FilterDropDown
        options={['Up to 5.4"', '5.5" - 5.9"', '6.0" - 6.4"', '6.5" and above']}
        title="Display"
        onSelectOption={onOptionChangeHandler}
      />
      <FilterDropDown
        options={["Up to 150€", "150 - 400€", "400 - 850€", "850€ and above"]}
        title="Price"
        onSelectOption={onOptionChangeHandler}
      />
      <FilterDropDown
        options={[
          "At least 64GB",
          "At least 128GB",
          "At least 256GB",
          "At least 512GB",
        ]}
        title="Storage"
        onSelectOption={onOptionChangeHandler}
      />
    </div>
  );
}

export default App;
