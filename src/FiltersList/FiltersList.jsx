import FilterDropdown from "../components/FilterDropdown/FilterDropdown";
import s from "./FiltersList.module.css";

export default function FiltersList() {
  const onOptionChangeHandler = (event) => {
    console.log("User Selected Value - ", event.target.value);
  };

  return (
    <div className={s.filterslist}>
      <FilterDropdown
        options={["Apple", "Samsung", "Xiaomi", "Huawei", "LG", "OnePlus"]}
        title="Manufacturer"
        onSelectOption={onOptionChangeHandler}
      />
      <FilterDropdown
        options={['Up to 5.4"', '5.5" - 5.9"', '6.0" - 6.4"', '6.5" and above']}
        title="Display"
        onSelectOption={onOptionChangeHandler}
      />
      <FilterDropdown
        options={["Up to 150€", "150 - 400€", "400 - 850€", "850€ and above"]}
        title="Price"
        onSelectOption={onOptionChangeHandler}
      />
      <FilterDropdown
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
