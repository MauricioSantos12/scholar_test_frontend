import { Stack, Text } from '@chakra-ui/react';
import React from 'react';
import Select from "react-select";

const InputMultipleSelect = ({ text, setValue, value, options = [] }) => {
  if (!options || options.length === 0) return null
  const parsedOptions = options.map((option) => ({ label: option.label || option.name, value: option.value || option.area_id || option.id }));
  const parsedValue = value.map((item) => ({ label: item.label || item.name, value: item.value || item.area_id || item.id }));

  return (
    <Stack direction="column" alignItems="flex-start" gap={4}>
      <Text color="dark_text" fontWeight="bold" fontSize="lg">
        {text}
      </Text>
      <Select
        isMulti
        options={parsedOptions}
        defaultValue={parsedValue || []}
        onChange={setValue}
        placeholder="Selecciona una o varias opciones"
        styles={{
          container: (base) => ({
            ...base,
            width: "100%",
            backgroundColor: "#F8FAFC",
          }),
          input: (base) => ({
            ...base,
            backgroundColor: "#F8FAFC",
            minHeight: 12,
            fontSize: "18px",
          }),
        }}
      />
    </Stack>
  );
};

export default InputMultipleSelect;