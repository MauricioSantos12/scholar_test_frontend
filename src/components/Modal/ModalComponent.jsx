import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import React from 'react'

const ModalComponent = ({isOpen, onClose, children, title}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody p={4}>
              {children}
            </ModalBody>
          </ModalContent>
        </Modal>
  )
}

export default ModalComponent