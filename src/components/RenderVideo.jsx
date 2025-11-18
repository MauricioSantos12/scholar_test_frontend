import { Box, Stack } from '@chakra-ui/react'
import React from 'react'

const RenderVideo = ({ videoUrl }) => {
    const videoId = videoUrl.split('=')[1]
    const baseUrl = 'https://www.youtube.com/embed/'
    return (
        <Stack w='100%' h='100%'>
            <Box display={{ base: 'none', md: 'none', lg: 'block' }}>
                <iframe width="100%" height="500" src={baseUrl + videoId} aria-controls='true'> </iframe>
            </Box>
            <Box display={{ base: 'none', md: 'block', lg: 'none' }}>
                <iframe width="100%" height="300" src={baseUrl + videoId} aria-controls='true'> </iframe>
            </Box>
            <Box display={{ base: 'block', md: 'none', lg: 'none' }}>
                <iframe width="100%" height="300" src={baseUrl + videoId}> </iframe>
            </Box>
        </Stack>
    )
}

export default RenderVideo