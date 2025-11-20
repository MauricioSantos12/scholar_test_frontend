import { Button, Heading, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react';
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
    const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()
    const colorDarkText = useColorModeValue('dark_text', 'secondary.100');
    const colorText = useColorModeValue('text', 'secondary.200');
    const bgColorActiveRowColorMode = useColorModeValue('#F8FAFC', 'secondary.700');
    const bgColorRowColorMode = useColorModeValue('white', 'secondary.800');
    const showToast = useToast();

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
        onCloseUpdate();
        cleanForm();
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
            showToast({
                title: "Edicion Exitosa",
                description: "El contenido ha sido editado con exito",
                status: "success",
                duration: 4000,
                isClosable: true,
                position: "bottom-right"
            })
            handleClose();
            cleanForm();
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
        }
    }

    if (loading) return <Loading />;
    if (error) return <Text color={'red.500'}>Error: {error}</Text>;


    return (
        <Stack dir='column' justifyContent={'flex-start'} alignItems={'flex-start'} gap={3} w={'100%'} h='100%'>
            <Heading color={colorDarkText} fontSize={{ base: 'xl', md: '3xl' }}>Tipos</Heading>
            <Text color={colorText} fontSize={{ base: '0.8rem', md: '0.9rem' }}>Listado de todos los tipos de test del sistema</Text>
            <Stack flexDir={'row'} justifyContent={{ base: 'flex-start', md: 'flex-end' }} alignItems={'center'} w={'100%'}>
            </Stack>
            {
                (!data || data.length === 0) && (
                    <Text color={colorText} fontSize={{ base: '0.8rem', md: '0.9rem' }}>No se han creado tipos</Text>
                )
            }
            {
                data && data.length > 0 && (
                    <TableContainer w={'100%'}>
                        <Table variant='simple' size={'lg'} color={colorDarkText}>
                            <Thead>
                                <Tr>
                                    <Th textAlign={'center'}>Nombre</Th>
                                    <Th textAlign={'center'}>Descripción</Th>
                                    <Th textAlign={'center'}>Acciones</Th>

                                </Tr>
                            </Thead>
                            <Tbody color={colorDarkText}>
                                {data.map((data, i) => (
                                    <Tr key={data.id} bgColor={i % 2 === 0 ? bgColorActiveRowColorMode : bgColorRowColorMode}>
                                        <Td textAlign={'center'}>{data.name}</Td>
                                        <Td textAlign={'center'}>{data.description}</Td>
                                        <Td textAlign={'center'}>
                                            <Stack flexDir={'row'} justifyContent={'center'} alignItems={'center'}>
                                                <UniIcon icon={'UilEdit'} size={4} onClick={() => { onSelectItem(data); onOpenUpdateData() }} cursor={'pointer'} _hover={{ color: 'primary.500', transition: 'all 0.2s ease-in-out' }} />
                                            </Stack>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                )
            }
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
        </Stack>
    )
}

export default TestTypes