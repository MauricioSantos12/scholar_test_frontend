import { Stack, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import UniIcon from "../utils/UniIcon.jsx";

const Card = ({ icon, title, value, bgColor, colorIcon }) => {
    const bgColorColorMode = useColorModeValue(bgColor, 'secondary.900');
    const colorDarkText = useColorModeValue('dark_text', 'secondary.100');

    return (
        <Stack w={'100%'} minW={{ base: '100%', md: '300px' }} maxW={{ base: '90%', md: '350px' }} p={4} bgColor={bgColorColorMode || bgColor} borderRadius={8} spacing={4} border={'1px solid'} borderColor={colorIcon} flexDir='row' justifyContent={'space-between'} alignItems='flex-start'>
            <Stack flexDir='column' alignItems={'flex-start'} justifyContent={'flex-start'}>
                <Text fontWeight={'bold'} color={colorDarkText}>{title}</Text>
                <Text color={colorDarkText} fontSize={'1.5rem'} fontWeight={'bold'}>{value}</Text>
            </Stack>
            <Stack flexDir='column' alignItems={'flex-start'} justifyContent={'flex-start'}>
                <UniIcon icon={icon} size={6} color={colorIcon} cursor={'pointer'} />

            </Stack>
        </Stack>
    )
}

export default Card