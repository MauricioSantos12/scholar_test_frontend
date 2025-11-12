import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Heading, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../components/Loading';
import UseFetch from '../utils/UseFetch';
import UniIcon from '../utils/UniIcon';
import ModalComponent from '../components/Modal/ModalComponent';
import DeleteModal from '../components/Modal/DeleteModal';
import InputText from '../components/InputText';

const AreaId = () => {
    const { areaId, testId } = useParams();
    const { data: dataTests, loading: loadingTests, error: errorTests, fetchData: fetchTests } = UseFetch()
    const { data: dataAreas, loading: loadingAreas, error: errorAreas, fetchData: fetchAreas } = UseFetch()
    const { data, loading, error, fetchData } = UseFetch()
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [registerSelected, setRegisterSelected] = useState(null);
    const [position, setPosition] = useState('');
    const [refreshData, setRefreshData] = useState(false);
    const [errorModal, setErroModal] = useState('');
    const navigation = useNavigate();
    const { isOpen: isOpenCreate, onOpen: onOpenCreate, onClose: onCloseCreate } = useDisclosure()
    const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()

    useEffect(() => {
        fetchData({
            url: `/areas/${areaId}/components`,
            method: 'GET',
        })
        fetchAreas({
            url: '/areas',
            method: 'GET',
        })
        fetchTests({
            url: '/tests',
            method: 'GET',
        })
    }, [fetchData, fetchTests, fetchAreas, refreshData])

    const cleanForm = () => {
        setName('');
        setDescription('');
        setRegisterSelected(null);
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
            await fetchData({
                url: '/components',
                method: 'POST',
                body: {
                    name,
                    description,
                    position: parseInt(position),
                    area_id: parseInt(areaId),
                }
            });
            handleClose();
            cleanForm();
        } catch (error) {
            console.error('Error al crear área:', error);
        }
    }

    const onSelectItem = async (data) => {
        setName(data.name);
        setDescription(data.description);
        setPosition(parseInt(data.position));
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
                url: `/components/${registerSelected.id}`,
                method: 'PUT',
                body: {
                    name,
                    description,
                    position: parseInt(position),
                    area_id: parseInt(areaId),
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
                url: `/components/${registerSelected.id}`,
                method: 'DELETE',
            });
            handleClose();
            cleanForm();
        } catch (error) {
            console.error('Error al eliminar el test:', error);
        }
    }
    const orderedData = data && data.length > 0 ? data.sort((a, b) => a.position - b.position) : data;

    if (loading || loadingTests || loadingAreas) return <Loading />
    if (error || errorTests || errorAreas) return <Text color={'red.500'}>Error: {error || errorTests || errorAreas}</Text>

    return (
        <Stack dir='column' justifyContent={'flex-start'} alignItems={'flex-start'} gap={3} w={'100%'} h='100%'>
            {
                dataTests && dataTests.length > 0 && dataAreas && dataAreas.length > 0 && (
                    <Breadcrumb spacing='8px' separator={<UniIcon size={4} icon='UilAngleRightB' color='gray.500' />}>
                        <BreadcrumbItem><BreadcrumbLink onClick={() => navigation(`/test/${testId}`)}>{dataTests.find(test => test.id === parseInt(testId))?.name} </BreadcrumbLink> </BreadcrumbItem>
                        <BreadcrumbItem><BreadcrumbLink onClick={() => null}>{dataAreas.find(area => area.id === parseInt(areaId))?.name} </BreadcrumbLink> </BreadcrumbItem>
                    </Breadcrumb>
                )
            }

            <Heading color={'dark_text'} fontSize={{ base: '1.5rem', md: '2rem' }}>Componentes</Heading>
            <Text color={'text'} fontSize={{ base: '0.8rem', md: '1.2rem' }}>Listado de todas las componentes creadas</Text>
            <Stack flexDir={'row'} justifyContent={'flex-end'} alignItems={'center'} w={'100%'}>
                <Button variant={"solid"} size="sm" onClick={onOpenCreate} minHeight={10}> Agregar nueva competencia</Button>
            </Stack>
            {
                (!orderedData || orderedData.length === 0) && (
                    <Text color={'text'} fontSize={{ base: '0.8rem', md: '1.2rem' }}>No se han creado componentes</Text>
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
                                    <Th textAlign={'center'}>Posición</Th>
                                    <Th textAlign={'center'}>Acciones</Th>

                                </Tr>
                            </Thead>
                            <Tbody>
                                {orderedData.map((dt, i) => {
                                    return (
                                        <Tr key={dt.id} bgColor={i % 2 === 0 ? '#F8FAFC' : 'white'}>
                                            <Td textAlign={'center'}>{dt.name}</Td>
                                            <Td textAlign={'center'}>{dt.description && dt.description.length > 50 ? dt.description.substring(0, 50) + '...' : dt.description}</Td>
                                            <Td textAlign={'center'}>{dt.position}</Td>
                                            <Td textAlign={'center'}>
                                                <Stack flexDir={'row'} justifyContent={'center'} alignItems={'center'}>
                                                    <Button rightIcon={<UniIcon icon={'UilPen'} size={6} />} size={'sm'} variant='green' minH={8} onClick={() => { onSelectItem(dt); onOpenUpdateData() }}> Editar </Button>
                                                    <Button rightIcon={<UniIcon icon={'UilTrash'} size={6} />} size={'sm'} variant='red' minH={8} onClick={() => { onSelectItem(dt); onOpenDeleteData() }}  > Eliminar</Button>
                                                    <Button rightIcon={<UniIcon icon={'UilEye'} size={6} />} size={'sm'} variant='darkGray' minH={8} onClick={() => { navigation(`/test/${testId}/area/${areaId}/component/${dt.id}`) }}  > Ver preguntas</Button>
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
            <ModalComponent isOpen={isOpenCreate} onClose={handleClose} title={'Crear nuevo componente'}>
                <Stack w='100%' gap={2}>
                    <Stack>
                        <InputText text={'Nombre'} placeholder={'Nombre del componente'} type={'text'} value={name} setValue={setName} />
                        <InputText text={'Descripcion'} placeholder={'Descripcion del componente'} type={'text'} value={description} setValue={setDescription} />
                        <InputText text={'Posición en el área'} placeholder={'Posición'} type={'number'} value={position} setValue={setPosition} />
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

            <ModalComponent isOpen={isOpenUpdate} onClose={handleClose} title={'Actualizar componente'}>
                <Stack w='100%' gap={2}>
                    <Stack>
                        <InputText text={'Nombre'} placeholder={'Nombre del componente'} type={'text'} value={name} setValue={setName} />
                        <InputText text={'Descripcion'} placeholder={'Descripcion del componente'} type={'text'} value={description} setValue={setDescription} />
                        <InputText text={'Posición en el área'} placeholder={'Posición'} type={'number'} value={position} setValue={setPosition} />
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

export default AreaId