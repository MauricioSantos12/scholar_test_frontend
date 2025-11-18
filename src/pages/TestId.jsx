import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Heading, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../components/Loading';
import UseFetch from '../utils/UseFetch';
import UniIcon from '../utils/UniIcon';
import ModalComponent from '../components/Modal/ModalComponent';
import DeleteModal from '../components/Modal/DeleteModal';
import InputText from '../components/InputText';

const TestId = () => {
    const { id } = useParams();
    const { data: dataTests, loading: loadingTests, error: errorTests, fetchData: fetchTests } = UseFetch()
    const { data, loading, error, fetchData } = UseFetch()
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [registerSelected, setRegisterSelected] = useState(null);
    const [weight, setWeight] = useState('');
    const [position, setPosition] = useState('');
    const [refreshData, setRefreshData] = useState(false);
    const navigation = useNavigate();
    const { isOpen: isOpenCreate, onOpen: onOpenCreate, onClose: onCloseCreate } = useDisclosure()
    const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const [errorModal, setErroModal] = useState('');

    useEffect(() => {
        fetchData({
            url: `/tests/${id}/areas`,
            method: 'GET',
        })
        fetchTests({
            url: '/tests',
            method: 'GET',
        })
    }, [fetchData, refreshData])

    const cleanForm = () => {
        setName('');
        setDescription('');
        setRegisterSelected(null);
        setWeight('');
        setPosition('');
        setErroModal('');
        setRefreshData(!refreshData);
    }

    const handleClose = () => {
        onCloseCreate();
        onCloseUpdate();
        onCloseDelete();
        cleanForm();
    }

    const validateInputs = () => {
        if (!name || !description || !position) {

            setErroModal('Todos los campos son obligatorios');
            return false

        }
        return true
    }

    const handleSave = async () => {
        const isValid = validateInputs();
        if (!isValid) {
            return;
        }
        try {
            const areaCreated = await fetchData({
                url: '/areas',
                method: 'POST',
                body: {
                    name,
                    description,
                    weight: parseInt(weight),
                    position: parseInt(position),
                }
            });
            if (areaCreated) {
                await fetchData({
                    url: `/testareas/tests/${id}/areas`,
                    method: 'POST',
                    body: {
                        area_id: areaCreated.id,
                        test_id: id,
                        weight: parseInt(weight),
                        position: parseInt(position),
                    }
                });
            }
            handleClose();
            cleanForm();
        } catch (error) {
            console.error('Error al crear área:', error);
        }
    }

    const onSelectItem = async (data) => {
        setName(data.name);
        setDescription(data.description);
        setWeight(data.weight);
        setPosition(data.position);
        setRegisterSelected(data);
    }


    const onOpenUpdateData = () => {
        onOpenUpdate();
    }

    const handleUpdate = async () => {
        const isValid = validateInputs();
        if (!isValid) {
            return;
        }
        try {
            await fetchData({
                url: `/areas/${registerSelected.id}`,
                method: 'PUT',
                body: {
                    name,
                    description,
                    weight: parseInt(weight),
                    position: parseInt(position),
                }
            });
        } catch (error) {
            console.error('Error al actualizar el test:', error);
        } finally {
            handleClose();
            cleanForm();
        }
    }


    const onOpenDeleteData = () => {
        onOpenDelete();
    }

    const handleDelete = async () => {
        try {
            await fetchData({
                url: `/areas/${registerSelected.id}`,
                method: 'DELETE',
            });
            handleClose();
            cleanForm();
        } catch (error) {
            console.error('Error al eliminar el test:', error);
        }
    }

    const orderedData = data && data.length > 0 ? data.sort((a, b) => a.position - b.position) : data;

    const colorDarkText = useColorModeValue('dark_text', 'secondary.100');
    const colorText = useColorModeValue('text', 'secondary.200');
    const bgColorActiveRowColorMode = useColorModeValue('#F8FAFC', 'secondary.700');
    const bgColorRowColorMode = useColorModeValue('white', 'secondary.800');

    if (loading || loadingTests) return <Loading />
    if (error || errorTests) return <Text color={'red.500'}>Error: {error || errorTests}</Text>

    return (
        <Stack dir='column' justifyContent={'flex-start'} alignItems={'flex-start'} gap={3} w={'100%'} h='100%'>
            {
                dataTests && dataTests.length > 0 && (
                    <Breadcrumb spacing='4px' fontSize={{ base: 'xs', md: 'md' }} separator={<UniIcon icon='UilChevronRight' color='gray.500' />}>
                        <BreadcrumbItem><BreadcrumbLink onClick={() => navigation('/tests')}>{dataTests.find(test => test.id === parseInt(id))?.name} </BreadcrumbLink> </BreadcrumbItem>
                        <BreadcrumbItem></BreadcrumbItem>
                    </Breadcrumb>
                )
            }

            <Heading color={colorDarkText} fontSize={{ base: 'xl', md: '3xl' }}>Áreas</Heading>
            <Text color={colorText} fontSize={{ base: '0.8rem', md: '0.9rem' }}>Listado de todas las áreas creadas</Text>
            <Stack flexDir={'row'} justifyContent={{ base: 'flex-start', md: 'flex-end' }} alignItems={'center'} w={'100%'}>
                <Button variant={"solid"} size="sm" onClick={onOpenCreate} minHeight={10}> Agregar nueva área</Button>
            </Stack>
            {
                (!orderedData || orderedData.length === 0) && (
                    <Text color={colorText} fontSize={{ base: '0.8rem', md: '0.9rem' }}>No se han creado áreas</Text>
                )
            }
            {
                orderedData && orderedData.length > 0 && (
                    <TableContainer w={'100%'}>
                        <Table variant='simple' size={'lg'}>
                            <Thead>
                                <Tr>
                                    <Th textAlign={'center'}>Nombre</Th>
                                    <Th textAlign={'center'}>Descripcion</Th>
                                    <Th textAlign={'center'}>Peso</Th>
                                    <Th textAlign={'center'}>Posición</Th>
                                    <Th textAlign={'center'}>Acciones</Th>

                                </Tr>
                            </Thead>
                            <Tbody>
                                {data.map((dt, i) => {
                                    return (
                                        <Tr key={dt.id} bgColor={i % 2 === 0 ? bgColorActiveRowColorMode : bgColorRowColorMode}>
                                            <Td textAlign={'center'}>{dt.name}</Td>
                                            <Td textAlign={'center'}>{dt.description && dt.description.length > 50 ? dt.description.substring(0, 50) + '...' : dt.description}</Td>
                                            <Td textAlign={'center'}>{dt.weight}</Td>
                                            <Td textAlign={'center'}>{dt.position}</Td>
                                            <Td textAlign={'center'}>
                                                <Stack flexDir={'row'} justifyContent={'center'} alignItems={'center'}>
                                                    <Button rightIcon={<UniIcon icon={'UilEye'} size={6} />} size={'sm'} variant='darkGray' minH={8} onClick={() => { navigation(`/test/${id}/area/${dt.id}`) }}  > Configurar</Button>
                                                    <Button rightIcon={<UniIcon icon={'UilPen'} size={6} />} size={'sm'} variant='green' minH={8} onClick={() => { onSelectItem(dt); onOpenUpdateData() }}> Editar </Button>
                                                    <Button rightIcon={<UniIcon icon={'UilTrash'} size={6} />} size={'sm'} variant='red' minH={8} onClick={() => { onSelectItem(dt); onOpenDeleteData() }}  > Eliminar</Button>
                                                </Stack>
                                            </Td>
                                        </Tr>
                                    )
                                })}
                            </Tbody>
                        </Table>
                    </TableContainer>
                )
            }
            <ModalComponent isOpen={isOpenCreate} onClose={handleClose} title={'Crear nueva área'}>
                <Stack w='100%' gap={2}>
                    <Stack>
                        <InputText text={'Nombre'} placeholder={'Nombre del área'} type={'text'} value={name} setValue={setName} />
                        <InputText text={'Descripcion'} placeholder={'Descripcion del área'} type={'text'} value={description} setValue={setDescription} />
                        <InputText text={'Peso en el test'} placeholder={'Peso en el test'} type={'number'} value={weight} setValue={setWeight} />
                        <InputText text={'Posición en el test'} placeholder={'Posición'} type={'number'} value={position} setValue={setPosition} />
                        {
                            errorModal && (
                                <Text color={'red.500'}>{errorModal}</Text>
                            )
                        }
                        <Stack flexDir={'row'} justifyContent={'flex-end'} alignItems={'center'} w='100%'>
                            <Button variant={"gray"} size="sm" onClick={handleClose}> Cancelar</Button>
                            <Button variant={"solid"} size="sm" onClick={handleSave}> Crear</Button>
                        </Stack>
                    </Stack>
                </Stack>
            </ModalComponent>

            <ModalComponent isOpen={isOpenUpdate} onClose={handleClose} title={'Actualizar área'}>
                <Stack w='100%' gap={2}>
                    <Stack>
                        <InputText text={'Nombre'} placeholder={'Nombre del área'} type={'text'} value={name} setValue={setName} />
                        <InputText text={'Descripcion'} placeholder={'Descripcion del área'} type={'text'} value={description} setValue={setDescription} />
                        <InputText text={'Peso en el test'} placeholder={'Peso en el test'} type={'number'} value={weight} setValue={setWeight} />
                        <InputText text={'Posición en el test'} placeholder={'Posición'} type={'number'} value={position} setValue={setPosition} />
                        {
                            errorModal && (
                                <Text color={'red.500'}>{errorModal}</Text>
                            )
                        }
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

export default TestId