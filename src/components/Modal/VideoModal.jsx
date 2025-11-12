import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack } from '@chakra-ui/react'
import React from 'react'
import RenderVideo from '../RenderVideo'

const VideoModal = ({ isOpen, onClose, videoUrl }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{``}</ModalHeader>
                <ModalCloseButton />
                <ModalBody p={4} gap={4} display={'flex'} flexDir={'column'}>
                    <RenderVideo videoUrl={videoUrl} />
                    <Stack flexDir={'row'} justifyContent={'center'} alignItems={'center'} w='100%'>
                        <Button variant={"gray"} size="sm" w={'100%'} onClick={onClose}> Cerrar</Button>
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default VideoModal
