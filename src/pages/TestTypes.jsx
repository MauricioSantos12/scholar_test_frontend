import { Button, Heading, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import UniIcon from '../utils/UniIcon.jsx';
import UseFetch from '../utils/UseFetch.js';
import InputText from '../components/InputText.jsx';
import Loading from '../components/Loading.jsx';
import DeleteModal from '../components/Modal/DeleteModal.jsx';
import ModalComponent from '../components/Modal/ModalComponent.jsx';

const TestTypes = () => {
    const { data, loading, error, fetchData } = UseFetch()
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [registerSelected, setRegisterSelected] = useState(null);
    const [refreshData, setRefreshData] = useState(false);
    const { isOpen: isOpenCreate, onOpen: onOpenCreate, onClose: onCloseCreate } = useDisclosure()
    const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()

    useEffect(() => {
        fetchData({
            url: '/testtypes',
            method: 'GET',
        });

    }, [fetchData, refreshData]);

    const cleanForm = () => {
        setName('');
        setDescription('');
        setRefreshData(!refreshData);
    }

    const handleClose = () => {
        onCloseCreate();
        onCloseUpdate();
        onCloseDelete();
        cleanForm();
    }

    const handleSave = async () => {
        try {
            await fetchData({
                url: '/testtypes',
                method: 'POST',
                body: {
                    name,
                    description
                }
            });
            handleClose();
            cleanForm();
        } catch (error) {
            console.error('Error al crear el usuario:', error);
        }
    }

    const onSelectItem = (data) => {
        setName(data.name);
        setDescription(data.description);
        setRegisterSelected(data);
    }

    const onOpenUpdateData = () => {
        onOpenUpdate();
    }

    const handleUpdate = async () => {
        try {
            await fetchData({
                url: `/testtypes/${registerSelected.id}`,
                method: 'PUT',
                body: {
                    name,
                    description
                }
            });
            handleClose();
            cleanForm();
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
        }
    }

    const onOpenDeleteData = () => {
        onOpenDelete();
    }

    const handleDelete = async () => {
        try {
            await fetchData({
                url: `/testtypes/${registerSelected.id}`,
                method: 'DELETE',
            });
            handleClose();
            cleanForm();
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
        }
    }

    if (loading) return <Loading />;
    if (error) return <Text color={'red.500'}>Error: {error}</Text>;


    return (
        <Stack dir='column' justifyContent={'flex-start'} alignItems={'flex-start'} gap={3} w={'100%'} h='100%'>
            <Heading color={'dark_text'} fontSize={{ base: '1.5rem', md: '2rem' }}>Tipos</Heading>
            <Text color={'text'} fontSize={{ base: '0.8rem', md: '1.2rem' }}>Listado de todos los tipos de test del sistema</Text>
            <Stack flexDir={'row'} justifyContent={'flex-end'} alignItems={'center'} w={'100%'}>
                <Button variant={"solid"} size="sm" onClick={onOpenCreate} minHeight={10}> Agregar nuevo tipo</Button>
            </Stack>
            {
                (!data || data.length === 0) && (
                    <Text color={'text'} fontSize={{ base: '0.8rem', md: '1.2rem' }}>No se han creado tipos</Text>
                )
            }
            {
                data && data.length > 0 && (
                    <TableContainer w={'100%'}>
                        <Table variant='simple' size={'lg'}>
                            <Thead>
                                <Tr>
                                    <Th textAlign={'center'}>Nombre</Th>
                                    <Th textAlign={'center'}>Descripción</Th>
                                    <Th textAlign={'center'}>Acciones</Th>

                                </Tr>
                            </Thead>
                            <Tbody>
                                {data.map((data, i) => (
                                    <Tr key={data._id} bgColor={i % 2 === 0 ? '#F8FAFC' : 'white'}>
                                        <Td textAlign={'center'}>{data.name}</Td>
                                        <Td textAlign={'center'}>{data.description}</Td>
                                        <Td textAlign={'center'}>
                                            <Stack flexDir={'row'} justifyContent={'center'} alignItems={'center'}>
                                                <UniIcon icon={'UilEdit'} size={4} onClick={() => { onSelectItem(data); onOpenUpdateData() }} cursor={'pointer'} _hover={{ color: 'primary.500', transition: 'all 0.2s ease-in-out' }} />
                                                {/* <UniIcon icon={'UilTrash'} size={4} onClick={() => { onSelectItem(data); onOpenDeleteData() }} cursor={'pointer'} _hover={{ color: 'red.500', transition: 'all 0.2s ease-in-out' }} /> */}
                                            </Stack>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                )
            }
            <ModalComponent isOpen={isOpenCreate} onClose={handleClose} title={'Crear nuevo test'}>
                <Stack w='100%' gap={2}>
                    <Stack>
                        <InputText text={'Nombre'} placeholder={'Nombre'} type={'text'} value={name} setValue={setName} />
                        <InputText text={'Descripción'} placeholder={'Descripción'} type={'text'} value={description} setValue={setDescription} />
                        <Stack flexDir={'row'} justifyContent={'flex-end'} alignItems={'center'} w='100%'>
                            <Button variant={"gray"} size="sm" onClick={handleClose}> Cancelar</Button>
                            <Button variant={"solid"} size="sm" onClick={handleSave}> Crear</Button>
                        </Stack>
                    </Stack>
                </Stack>
            </ModalComponent>

            <ModalComponent isOpen={isOpenUpdate} onClose={handleClose} title={'Actualizar nuevo test'}>
                <Stack w='100%' gap={2}>
                    <Stack>
                        <InputText text={'Nombre'} placeholder={'Nombre'} type={'text'} value={name} setValue={setName} />
                        <InputText text={'Descripción'} placeholder={'Descripción'} type={'text'} value={description} setValue={setDescription} />
                        <Stack flexDir={'row'} justifyContent={'flex-end'} alignItems={'center'} w='100%'>
                            <Button variant={"gray"} size="sm" onClick={handleClose}> Cancelar</Button>
                            <Button variant={"solid"} size="sm" onClick={handleUpdate}> Actualizar</Button>
                        </Stack>
                    </Stack>
                </Stack>
            </ModalComponent>
            <DeleteModal isOpen={isOpenDelete} onClose={handleClose} item={registerSelected?.name || ''} onClick={handleDelete} />

        </Stack>
    )
}

export default TestTypes