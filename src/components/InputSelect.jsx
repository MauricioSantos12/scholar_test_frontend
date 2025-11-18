import { Select, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'

const InputSelect = ({ text, value, setValue, options }) => {

    const colorDarkText = useColorModeValue('dark_text', 'secondary.100');
    const bgColor = useColorModeValue('secondary.100', 'secondary.900');

    if (!options) return null
    if (options.length === 0) return null

    return (
        <Stack dir='column' justifyContent={'center'} alignItems={'flex-start'} gap={4}>
            <Text color={colorDarkText} fontWeight={'bold'} fontSize={'lg'}>{text}</Text>
            <Select value={value} variant='outline' bgColor={bgColor} fontSize={'md'} minH={12} onChange={(e) => setValue(e.target.value)}>
                <option value=''>Selecciona una opción	</option>
                {options.map((option) => (
                    <option key={option.value || option.id} value={option.value || option.id}>{option.label || option.name}</option>
                ))}
            </Select>
        </Stack>
    )
}

export default InputSelect