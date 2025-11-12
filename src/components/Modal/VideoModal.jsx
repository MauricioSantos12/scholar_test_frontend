import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack } from '@chakra-ui/react'
import React from 'react'

const VideoModal = ({ isOpen, onClose, videoUrl }) => {
    const videoId = videoUrl.split('=')[1]
    const baseUrl = 'https://www.youtube.com/embed/'
    return (
        <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{``}</ModalHeader>
                <ModalCloseButton />
                <ModalBody p={4} gap={4} display={'flex'} flexDir={'column'}>
                    <Box display={{ base: 'none', md: 'block' }}>
                        <iframe width="100%" height="520" src={baseUrl + videoId}> </iframe>
                    </Box>
                    <Box display={{ base: 'block', md: 'none' }}>
                        <iframe width="100%" height="300" src={baseUrl + videoId}> </iframe>
                    </Box>
                    <Stack flexDir={'row'} justifyContent={'center'} alignItems={'center'} w='100%'>
                        <Button variant={"gray"} size="sm" w={'100%'} onClick={onClose}> Cerrar</Button>
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default VideoModal
