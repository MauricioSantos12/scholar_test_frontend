import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Heading, Stack, Switch, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../components/Loading';
import UseFetch from '../utils/UseFetch';
import UniIcon from '../utils/UniIcon';
import ModalComponent from '../components/Modal/ModalComponent';
import DeleteModal from '../components/Modal/DeleteModal';
import InputText from '../components/InputText';

const QuestionId = () => {
    const { areaId, testId, componentId, questionId } = useParams();
    const { data: dataAreas, loading: loadingAreas, error: errorAreas, fetchData: fetchAreas } = UseFetch()
    const { data: dataTests, loading: loadingTests, error: errorTests, fetchData: fetchTests } = UseFetch()
    const { data: dataComponents, loading: loadingComponents, error: errorComponents, fetchData: fetchComponents } = UseFetch()
    const { loading: loadingQuestions, error: errorQuestions, fetchData: fetchQuestions } = UseFetch()
    const { data, loading, error, fetchData } = UseFetch()
    const [text, setText] = useState('');
    const [value, setValue] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);
    const [position, setPosition] = useState('');
    const [explanation, setExplanation] = useState(null);
    const [registerSelected, setRegisterSelected] = useState(null);
    const [refreshData, setRefreshData] = useState(false);
    const [errorModal, setErroModal] = useState('');
    const { isOpen: isOpenCreate, onOpen: onOpenCreate, onClose: onCloseCreate } = useDisclosure()
    const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const navigation = useNavigate();

    useEffect(() => {
        fetchData({
            url: `/questions/${questionId}/answers`,
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
        fetchQuestions({
            url: '/questions',
            method: 'GET',
        })
    }, [fetchData, fetchTests, fetchAreas, fetchComponents, fetchQuestions, refreshData])

    const cleanForm = () => {
        setText('');
        setValue('');
        setIsCorrect(false);
        setPosition('');
        setErroModal('');
        setVideoUrl('');
        setExplanation(null);
        setRegisterSelected(null);
        setRefreshData(!refreshData);
    }

    const handleClose = () => {
        onCloseCreate();
        onCloseUpdate();
        onCloseDelete();
        cleanForm();
    }

    const validateInputs = () => {
        if (!text || !value || !position) {
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
                url: '/answers',
                method: 'POST',
                body: {
                    text,
                    value: parseInt(value),
                    position: parseInt(position),
                    is_correct: isCorrect == 1 ? true : false,
                    video_url: videoUrl || '',
                    question_id: parseInt(questionId),
                    explanation: explanation || ''
                }
            });
            handleClose();
            cleanForm();
        } catch (error) {
            console.error('Error al crear área:', error);
        }
    }

    const onSelectItem = async (data) => {
        setText(data.text);
        setValue(data.value);
        setPosition(parseInt(data.position));
        setIsCorrect(data.is_correct);
        setVideoUrl(data.video_url);
        setExplanation(data.explanation);
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
                url: `/answers/${registerSelected.id}`,
                method: 'PUT',
                body: {
                    text,
                    value: parseInt(value),
                    position: parseInt(position),
                    is_correct: isCorrect == 1 ? true : false,
                    video_url: videoUrl || '',
                    explanation: explanation || ''
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
                url: `/answers/${registerSelected.id}`,
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

    if (loading || loadingTests || loadingAreas || loadingComponents || loadingQuestions) return <Loading />
    if (error || errorTests || errorAreas || errorComponents || errorQuestions) return <Text color={'red.500'}>Error: {error || errorTests || errorAreas || errorComponents || errorQuestions}</Text>

    return (
        <Stack dir='column' justifyContent={'flex-start'} alignItems={'flex-start'} gap={3} w={'100%'} h='100%'>
            {
                dataTests && dataTests.length > 0 && dataAreas && dataAreas.length > 0 && (
                    <Breadcrumb spacing='4px' fontSize={{ base: 'xs', md: 'md' }} >
                        <BreadcrumbItem><BreadcrumbLink onClick={() => navigation(`/test/${testId}`)}>{dataTests.find(test => test.id === parseInt(testId))?.name} </BreadcrumbLink> </BreadcrumbItem>
                        <BreadcrumbItem><BreadcrumbLink onClick={() => navigation(`/test/${testId}/area/${areaId}`)}>{dataAreas.find(area => area.id === parseInt(areaId))?.name} </BreadcrumbLink> </BreadcrumbItem>
                        <BreadcrumbItem><BreadcrumbLink onClick={() => navigation(`/test/${testId}/area/${areaId}/component/${componentId}`)}>{dataComponents.find(component => component.id === parseInt(componentId))?.name}</BreadcrumbLink></BreadcrumbItem>
                        <BreadcrumbItem><BreadcrumbLink>{`Pregunta #${questionId}`}</BreadcrumbLink></BreadcrumbItem>
                    </Breadcrumb>
                )
            }

            <Heading color={colorDarkText} fontSize={{ base: 'xl', md: '3xl' }}>Respuestas</Heading>
            <Text color={colorText} fontSize={{ base: '0.8rem', md: '0.9rem' }}>Listado de todas las respuestas creadas</Text>
            <Stack flexDir={'row'} justifyContent={{ base: 'flex-start', md: 'flex-end' }} alignItems={'center'} w={'100%'}>
                <Button variant={"solid"} size="sm" onClick={onOpenCreate} minHeight={10}> Agregar nueva respuesta</Button>
            </Stack>
            {
                (!orderedData || orderedData.length === 0) && (
                    <Text color={colorText} fontSize={{ base: '0.8rem', md: '0.9rem' }}>No se han creado respuestas</Text>
                )
            }
            {
                orderedData && orderedData.length > 0 && (
                    <TableContainer w={'100%'}>
                        <Table variant='simple' size={'lg'}>
                            <Thead>
                                <Tr>
                                    <Th textAlign={'center'}>Texto</Th>
                                    <Th textAlign={'center'}>Valor</Th>
                                    <Th textAlign={'center'}>Es correcta</Th>
                                    <Th textAlign={'center'}>Posicion</Th>
                                    <Th textAlign={'center'}>Acciones</Th>

                                </Tr>
                            </Thead>
                            <Tbody>
                                {orderedData.map((dt, i) => {
                                    return (
                                        <Tr key={dt.id} bgColor={i % 2 === 0 ? bgColorActiveRowColorMode : bgColorRowColorMode}>
                                            <td style={{ textWrap: 'balance', textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: dt.text }} />
                                            <Td textAlign={'center'}>{dt.value}</Td>
                                            <Td textAlign={'center'}>{dt.is_correct == 1 ? 'Si' : 'No'}</Td>
                                            <Td textAlign={'center'}>{dt.position}</Td>
                                            <Td textAlign={'center'}>
                                                <Stack flexDir={'row'} justifyContent={'center'} alignItems={'center'}>
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
            <ModalComponent isOpen={isOpenCreate} onClose={handleClose} title={'Crear nueva pregunta'}>
                <Stack w='100%' gap={2}>
                    <Stack>
                        <InputText text={`Texto`} placeholder={`Texto`} type={'richtext'} value={text} setValue={setText} />
                        <InputText text={`Valor`} placeholder={`Valor`} type={'number'} value={value} setValue={setValue} />
                        <InputText text='Video' placeholder='Video' type='text' value={videoUrl} setValue={setVideoUrl} />
                        <Stack flexDir={'row'} justifyContent={'flex-start'} alignItems={'center'}>
                            <Switch onChange={(e) => setIsCorrect(e.target.checked)} isChecked={isCorrect} />
                            <Text fontWeight={'bold'}>Correcta</Text>
                        </Stack>
                        <InputText text={'Posición en la pregunta'} placeholder={'Posición'} type={'number'} value={position} setValue={setPosition} />
                        <InputText text='Explicación' placeholder='Explicación' type='text' value={explanation} setValue={setExplanation} />

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
                        <InputText text={`Texto`} placeholder={`Texto`} type={'richtext'} value={text} setValue={setText} />
                        <InputText text={`Valor`} placeholder={`Valor`} type={'number'} value={value} setValue={setValue} />
                        <InputText text='Video' placeholder='Video' type='text' value={videoUrl} setValue={setVideoUrl} />
                        <Stack flexDir={'row'} justifyContent={'flex-start'} alignItems={'center'}>
                            <Switch onChange={(e) => setIsCorrect(e.target.checked)} isChecked={isCorrect} />
                            <Text fontWeight={'bold'}>Correcta</Text>
                        </Stack>
                        <InputText text={'Posición en la pregunta'} placeholder={'Posición'} type={'number'} value={position} setValue={setPosition} />
                        <InputText text='Explicación' placeholder='Explicación' type='text' value={explanation} setValue={setExplanation} />
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

export default QuestionId