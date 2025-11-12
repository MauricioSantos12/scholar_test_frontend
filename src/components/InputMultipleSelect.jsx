import { Stack, Text } from '@chakra-ui/react';
import React from 'react';
import Select from "react-select";

const InputMultipleSelect = ({ text, value = [], setValue, options = [] }) => {
  const parsedOptions = options.map((option) => ({ label: option.label || option.name, value: option.value || option.id }));
  return (
    <Stack direction="column" alignItems="flex-start" gap={4}>
      <Text color="dark_text" fontWeight="bold" fontSize="lg">
        {text}
      </Text>
      <Select
        isMulti
        options={parsedOptions}
        value={value}
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