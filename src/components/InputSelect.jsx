import { Select, Stack, Text } from '@chakra-ui/react'
import React from 'react'

const InputSelect = ({ text, value, setValue, options }) => {
    if(!options) return null
    if(options.length === 0) return null
    return (
        <Stack dir='column' justifyContent={'center'} alignItems={'flex-start'} gap={4}>
            <Text color={'dark_text'} fontWeight={'bold'} fontSize={'lg'}>{text}</Text>
            <Select value={value} variant='outline' bgColor={'#F8FAFC'} fontSize={'md'} minH={12} onChange={(e) => setValue(e.target.value)}>
                <option value=''>Selecciona una opción	</option>
                {options.map((option) => (
                    <option key={option.value || option.id} value={option.value || option.id}>{option.label || option.name}</option>
                ))}
            </Select>
        </Stack>
    )
}

export default InputSelect