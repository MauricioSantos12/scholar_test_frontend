import { Button, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import UniIcon from '../../utils/UniIcon'

const FinishTimeModal = ({ isOpen, onClose, onClick }) => {
    const handleOnClose = () => {
        onClose()
        onClick()
    }

    const colorDarkText = useColorModeValue('dark_text', 'secondary.100');

    return (
        <Modal isOpen={isOpen} onClose={handleOnClose} size={'lg'}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>¡Se acabó el tiempo!</ModalHeader>
                <ModalCloseButton />
                <ModalBody p={4}>
                    <Stack w='100%' gap={2} justifyContent={'center'} alignItems={'center'}>
                        <UniIcon icon={'UilAnnoyedAlt'} color='blue.400' size={{ base: '3rem', md: '6rem' }} bgColor={'blue.100'} borderRadius={'50%'} p={4} />
                        <Heading fontSize={'lg'} color={colorDarkText} textAlign={'center'} fontWeight={'bold'}>Tu tiempo para completar este test ha finalizado.</Heading>
                        <Text fontSize={'sm'} textAlign={'center'}>Tus respuestas se han guardado automáticamente y el test se cerrará en breve.</Text>
                        <Text fontSize={'sm'} textAlign={'center'}>Gracias por tu participación.</Text>
                    </Stack>
                </ModalBody>
                <ModalFooter>
                    <Button variant='outline' w='100%' onClick={handleOnClose}>
                        Cerrar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default FinishTimeModal