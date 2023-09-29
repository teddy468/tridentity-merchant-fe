import { Combobox, ComboboxInput, ComboboxList, ComboboxOption, ComboboxPopover } from "@reach/combobox";
import { Form, message } from "antd";
import { useEffect, useRef, useState } from "react";
import usePlacesAutocomplete, { Suggestion, getGeocode, getLatLng } from "use-places-autocomplete";
import stylesInput from "../../commons/components/CustomInput/CustomInput.module.scss";
import styles from "./map.module.scss";
import { isValidAddress } from "../../commons/utils/functions/validation";

type Props = {
  setSelected: (latLng: StoreAddress["coordinate"] | null) => void;
  selected: StoreAddress["coordinate"] | null;
  defaultAddress?: string;
  validateAddress: () => void;
  setLocation?: (data: Suggestion | null) => void;
};

const PlacesAutoComplete = ({ setSelected, selected, defaultAddress, validateAddress, setLocation }: Props) => {
  const [defaultValue] = useState(defaultAddress);
  const [defaultSelected] = useState(selected);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { componentRestrictions: { country: "sg" } },
    defaultValue,
  });
  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = getLatLng(results[0]);
      setSelected({ lat: lat.toString(), lng: lng.toString() });
      setLocation?.(data.find(item => item.description === address) || null);

      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => validateAddress(), 100);
    } catch (error) {
      console.log(error);
      if (error === "OVER_QUERY_LIMIT") {
        setValue(defaultValue || "", false);
        setSelected(value === defaultValue ? defaultSelected : null);
        setLocation?.(null);
        message.error("Google map API limited");
      }
    }
  };
  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);
  return (
    <Form.Item
      name="address"
      className={`${stylesInput.group} ${stylesInput.label}`}
      label="Address"
      rules={[{ required: true, message: "Required" }, { validator: isValidAddress(selected) }]}
      labelCol={{ span: 24 }}
    >
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={e => {
            setSelected(null);
            setValue(e.target.value);
          }}
          className={`${stylesInput.customInput} ${styles.label} ${styles.address}`}
          placeholder="Address line"
        />
        {status === "OK" && (
          <ComboboxPopover>
            <ComboboxList className={`${styles.comboboxList}`}>
              {data.map(({ place_id, description }) => (
                <ComboboxOption className={`${styles.comboboxOption}`} key={place_id} value={description} />
              ))}
              {!data.length ? "No options" : ""}
            </ComboboxList>
          </ComboboxPopover>
        )}
      </Combobox>
    </Form.Item>
  );
};

export default PlacesAutoComplete;
