import { Button, Heading, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import UniIcon from '../utils/UniIcon.jsx';
import UseFetch from '../utils/UseFetch';
import InputText from '../components/InputText';
import Loading from '../components/Loading';
import DeleteModal from '../components/Modal/DeleteModal';
import ModalComponent from '../components/Modal/ModalComponent.jsx';
import InputSelect from '../components/InputSelect.jsx';

const Recommendations = () => {
    const { data, loading, error, fetchData } = UseFetch()
    const { data: dataAreas, loading: loadingAreas, error: errorAreas, fetchData: fetchDataAreas } = UseFetch()
    const [text, setText] = useState('');
    const [minScore, setMinScore] = useState('');
    const [maxScore, setMaxScore] = useState('');
    const [areaSelected, setAreaSelected] = useState(null);
    const [registerSelected, setRegisterSelected] = useState(null);
    const [refreshData, setRefreshData] = useState(false);

    const { isOpen: isOpenCreate, onOpen: onOpenCreate, onClose: onCloseCreate } = useDisclosure()
    const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()

    useEffect(() => {
        fetchData({
            url: '/recommendations',
            method: 'GET',
        });
        fetchDataAreas({
            url: '/areas',
            method: 'GET',
        });

    }, [fetchData, fetchDataAreas, refreshData]);

    const cleanForm = () => {
        setMinScore('');
        setMaxScore('');
        setAreaSelected(null);
        setText('');
        setRegisterSelected(null);
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
                url: '/recommendations',
                method: 'POST',
                body: {
                    text,
                    area_id: parseInt(areaSelected),
                    min_score: parseInt(minScore),
                    max_score: parseInt(maxScore),
                }
            });
            handleClose();
            cleanForm();
        } catch (error) {
            console.error('Error al crear el usuario:', error);
        }
    }

    const onSelectItem = (data) => {
        setText(data.text);
        setMinScore(data.min_score);
        setMaxScore(data.max_score);
        setAreaSelected(data.area_id);
        setRegisterSelected(data);
    }

    const onOpenUpdateData = () => {
        onOpenUpdate();
    }

    const handleUpdate = async () => {
        try {
            await fetchData({
                url: `/recommendations/${registerSelected.id}`,
                method: 'PUT',
                body: {
                    text,
                    area_id: parseInt(areaSelected),
                    min_score: parseInt(minScore),
                    max_score: parseInt(maxScore),
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
                url: `/recommendations/${registerSelected.id}`,
                method: 'DELETE',
            });
            handleClose();
            cleanForm();
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
        }
    }

    if (loading || loadingAreas) return <Loading />;
    if (error || errorAreas) return <Text color={'red.500'}>Error: {error || errorAreas}</Text>;


    return (
        <Stack dir='column' justifyContent={'flex-start'} alignItems={'flex-start'} gap={3} w={'100%'} h='100%'>
            <Heading color={'dark_text'} fontSize={{ base: 'xl', md: '3xl' }}>Observaciones por área</Heading>
            <Text color={'text'} fontSize={{ base: '0.8rem', md: '0.9rem' }}>Listado de todos las observaciones</Text>
            <Stack flexDir={'row'} justifyContent={{ base: 'flex-start', md: 'flex-end' }} alignItems={'center'} w={'100%'}>
                <Button variant={"solid"} size="sm" onClick={onOpenCreate} minHeight={10}> Agregar nueva observación</Button>
            </Stack>
            {
                (!data || data.length === 0) && (
                    <Text color={'text'} fontSize={{ base: '0.8rem', md: '0.9rem' }}>No se han creado observaciones</Text>
                )
            }
            {
                data && data.length > 0 && (
                    <TableContainer w={'100%'}>
                        <Table variant='simple' size={'lg'}>
                            <Thead>
                                <Tr>
                                    <Th textAlign={'center'}>Área</Th>
                                    <Th textAlign={'center'}>Mínimo</Th>
                                    <Th textAlign={'center'}>Máximo</Th>
                                    <Th textAlign={'center'}>Texto</Th>

                                </Tr>
                            </Thead>
                            <Tbody>
                                {data.map((data, i) => (
                                    <Tr key={data._id} bgColor={i % 2 === 0 ? '#F8FAFC' : 'white'}>
                                        <Td textAlign={'center'}>{dataAreas && dataAreas.find((area) => area.id === data.area_id) && dataAreas.find((area) => area.id === data.area_id).name}</Td>
                                        <Td textAlign={'center'}>{data.min_score}</Td>
                                        <Td textAlign={'center'}>{data.max_score}</Td>
                                        <td style={{ textWrap: 'balance', textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: data.text && data.text.length > 150 ? data.text.substring(0, 200) + '...' : data.text }} />
                                        <Td textAlign={'center'}>
                                            <Stack flexDir={'row'} justifyContent={'center'} alignItems={'center'}>
                                                <UniIcon icon={'UilEdit'} size={4} onClick={() => { onSelectItem(data); onOpenUpdateData() }} cursor={'pointer'} _hover={{ color: 'primary.500', transition: 'all 0.2s ease-in-out' }} />
                                                <UniIcon icon={'UilTrash'} size={4} onClick={() => { onSelectItem(data); onOpenDeleteData() }} cursor={'pointer'} _hover={{ color: 'red.500', transition: 'all 0.2s ease-in-out' }} />
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
                        <InputText text={'Text de la observación'} placeholder={'Observación'} type={'richtext'} value={text} setValue={setText} />
                        <InputText text={'Valor mínimo'} placeholder={'Valor mínimo'} type={'number'} value={minScore} setValue={setMinScore} />
                        <InputText text={'Valor máximo'} placeholder={'Valor máximo'} type={'number'} value={maxScore} setValue={setMaxScore} />
                        <InputSelect text={'Area'} placeholder={'Area'} value={areaSelected} setValue={setAreaSelected} options={dataAreas} />
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
                        <InputText text={'Text de la observación'} placeholder={'Observación'} type={'richtext'} value={text} setValue={setText} />
                        <InputText text={'Valor mínimo'} placeholder={'Valor mínimo'} type={'number'} value={minScore} setValue={setMinScore} />
                        <InputText text={'Valor máximo'} placeholder={'Valor máximo'} type={'number'} value={maxScore} setValue={setMaxScore} />
                        <InputSelect text={'Area'} placeholder={'Area'} value={areaSelected} setValue={setAreaSelected} options={dataAreas} />
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

export default Recommendations