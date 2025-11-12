import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack } from '@chakra-ui/react'
import React from 'react'

const DeleteModal = ({ isOpen, onClose, item, onClick }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{`¿Estas seguro de eliminar ${item}?`}</ModalHeader>
                <ModalCloseButton />
                <ModalBody p={4}>
                    <Stack flexDir={'row'} justifyContent={'flex-end'} alignItems={'center'} w='100%'>
                        <Button variant={"gray"} size="sm" onClick={onClose}> Cancelar</Button>
                        <Button variant={"solid"} size="sm" onClick={onClick}> Eliminar</Button>
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default DeleteModal