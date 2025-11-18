import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Heading, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../components/Loading';
import UseFetch from '../utils/UseFetch';
import UniIcon from '../utils/UniIcon';
import ModalComponent from '../components/Modal/ModalComponent';
import DeleteModal from '../components/Modal/DeleteModal';
import InputText from '../components/InputText';
import 'draft-js/dist/Draft.css';


const ComponentId = () => {
    const { areaId, testId, componentId } = useParams();
    const { data: dataAreas, loading: loadingAreas, error: errorAreas, fetchData: fetchAreas } = UseFetch()
    const { data: dataTests, loading: loadingTests, error: errorTests, fetchData: fetchTests } = UseFetch()
    const { data: dataComponents, loading: loadingComponents, error: errorComponents, fetchData: fetchComponents } = UseFetch()
    const { data, loading, error, fetchData } = UseFetch()
    const [firstText, setFirstText] = useState('');
    const [secondText, setSecondText] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
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
            url: `/components/${componentId}/questions`,
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
        fetchComponents({
            url: '/components',
            method: 'GET',
        })
    }, [fetchData, fetchTests, fetchAreas, fetchComponents, refreshData])

    const cleanForm = () => {
        setFirstText('');
        setSecondText('');
        setRegisterSelected(null);
        setPosition('');
        setErroModal('');
        setImageUrl('');
        setVideoUrl('');
        setRefreshData(!refreshData);
    }

    const handleClose = () => {
        onCloseCreate();
        onCloseUpdate();
        onCloseDelete();
        cleanForm();
    }

    const validateInputs = () => {
        if (!firstText || !secondText || !position) {

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
                url: '/questions',
                method: 'POST',
                body: {
                    first_text: firstText,
                    second_text: secondText || ' ',
                    position: parseInt(position),
                    component_id: parseInt(componentId),
                    image_url: imageUrl,
                    video_url: videoUrl
                }
            });
            handleClose();
            cleanForm();
        } catch (error) {
            console.error('Error al crear área:', error);
        }
    }

    const onSelectItem = async (data) => {
        setFirstText(data.first_text);
        setSecondText(data.second_text);
        setImageUrl(data.image_url);
        setVideoUrl(data.video_url);
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
                url: `/questions/${registerSelected.id}`,
                method: 'PUT',
                body: {
                    first_text: firstText,
                    second_text: secondText || ' ',
                    position: parseInt(position),
                    component_id: parseInt(componentId),
                    image_url: imageUrl,
                    video_url: videoUrl
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
                url: `/questions/${registerSelected.id}`,
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

    if (loading || loadingTests || loadingAreas || loadingComponents) return <Loading />
    if (error || errorTests || errorAreas || errorComponents) return <Text color={'red.500'}>Error: {error || errorTests || errorAreas || errorComponents}</Text>
    return (
        <Stack dir='column' justifyContent={'flex-start'} alignItems={'flex-start'} gap={3} w={'100%'} h='100%'>
            {
                dataTests && dataTests.length > 0 && dataAreas && dataAreas.length > 0 && (
                    <Breadcrumb spacing='4px' fontSize={{ base: 'xs', md: 'md' }}  >
                        <BreadcrumbItem><BreadcrumbLink onClick={() => navigation(`/test/${testId}`)}>{dataTests.find(test => test.id === parseInt(testId))?.name} </BreadcrumbLink> </BreadcrumbItem>
                        <BreadcrumbItem><BreadcrumbLink onClick={() => navigation(`/test/${testId}/area/${areaId}`)}>{dataAreas.find(area => area.id === parseInt(areaId))?.name} </BreadcrumbLink> </BreadcrumbItem>
                        <BreadcrumbItem><BreadcrumbLink onClick={() => null}>{dataComponents.find(component => component.id === parseInt(componentId))?.name}</BreadcrumbLink></BreadcrumbItem>
                    </Breadcrumb>
                )
            }

            <Heading color={colorDarkText} fontSize={{ base: 'xl', md: '3xl' }}>Preguntas</Heading>
            <Text color={colorText} fontSize={{ base: '0.8rem', md: '0.9rem' }}>Listado de todas las preguntas creadas</Text>
            <Stack flexDir={'row'} justifyContent={{ base: 'flex-start', md: 'flex-end' }} alignItems={'center'} w={'100%'}>
                <Button variant={"solid"} size="sm" onClick={onOpenCreate} minHeight={10}> Agregar nueva pregunta</Button>
            </Stack>
            {
                (!orderedData || orderedData.length === 0) && (
                    <Text color={colorText} fontSize={{ base: '0.8rem', md: '0.9rem' }}>No se han creado preguntas</Text>
                )
            }
            {
                orderedData && orderedData.length > 0 && (
                    <TableContainer w={'100%'}>
                        <Table variant='simple' size={'lg'}>
                            <Thead>
                                <Tr>
                                    <Th textAlign={'center'}>Pregunta</Th>
                                    <Th textAlign={'center'}>Texto alternativo</Th>
                                    <Th textAlign={'center'}>Posición</Th>
                                    <Th textAlign={'center'}>Acciones</Th>

                                </Tr>
                            </Thead>
                            <Tbody>
                                {orderedData.map((dt, i) => {
                                    return (
                                        <Tr key={dt.id} bgColor={i % 2 === 0 ? bgColorActiveRowColorMode : bgColorRowColorMode}>
                                            <td style={{ textWrap: 'balance', textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: dt.first_text && dt.first_text.length > 100 ? `${dt.first_text.substring(0, 100)}...` : dt.first_text }} />
                                            <td style={{ textWrap: 'balance', textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: dt.second_text && dt.second_text.length > 100 ? `${dt.second_text.substring(0, 100)}...` : dt.second_text }} />
                                            <Td textAlign={'center'}>{dt.position}</Td>
                                            <Td textAlign={'center'}>
                                                <Stack flexDir={'row'} justifyContent={'center'} alignItems={'center'}>
                                                    <Button rightIcon={<UniIcon icon={'UilEye'} size={6} />} size={'sm'} variant='darkGray' minH={8} onClick={() => { navigation(`/test/${testId}/area/${areaId}/component/${componentId}/question/${dt.id}`) }}  >Configurar</Button>
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
            <style>
                {
                    `
                        .tox .tox-dialog {
                            z-index: 200000 !important;
                            }`
                }
            </style>
            <ModalComponent isOpen={isOpenCreate} onClose={handleClose} title={'Crear nueva pregunta'}>
                <Stack w='100%' gap={2}>
                    <Stack>
                        <InputText text={'Texto pregunta'} placeholder={'Texto pregunta'} type={'richtext'} value={firstText} setValue={setFirstText} />
                        <InputText text={'Texto alternativo'} placeholder={'Texto alternativo'} type={'richtext'} value={secondText} setValue={setSecondText} />
                        <InputText text={'Imagen URL'} placeholder={'https://...'} type={'text'} value={imageUrl} setValue={setImageUrl} />
                        <InputText text={'Video explicativo'} placeholder={'https://...'} type={'text'} value={videoUrl} setValue={setVideoUrl} />
                        <InputText text={'Posición en el componente'} placeholder={'Posición'} type={'number'} value={position} setValue={setPosition} />
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

            <ModalComponent isOpen={isOpenUpdate} onClose={handleClose} title={'Actualizar pregunta'}>
                <Stack w='100%' gap={2}>
                    <Stack>
                        <InputText text={'Texto pregunta'} placeholder={'Texto pregunta'} type={'richtext'} value={firstText} setValue={setFirstText} />
                        <InputText text={'Texto alternativo'} placeholder={'Texto alternativo'} type={'richtext'} value={secondText} setValue={setSecondText} />
                        <InputText text={'Imagen URL'} placeholder={'https://...'} type={'text'} value={imageUrl} setValue={setImageUrl} />
                        <InputText text={'Video explicativo'} placeholder={'https://...'} type={'text'} value={videoUrl} setValue={setVideoUrl} />
                        <InputText text={'Posición en el componente'} placeholder={'Posición'} type={'number'} value={position} setValue={setPosition} />
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

        </Stack >
    )
}

export default ComponentId