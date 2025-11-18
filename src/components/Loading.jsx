import { Spinner, Stack } from '@chakra-ui/react'
import React from 'react'

const Loading = () => {
    return (
        <Stack w={'100%'} h={'calc(100vh - 150px)'} justifyContent={'center'} alignItems={'center'}>
            <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='xl'
            />
        </Stack>
    )
}

export default Loading