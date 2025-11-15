import { Button, Heading, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import UseFetch from '../utils/UseFetch';
import Loading from '../components/Loading.jsx';
import ModalComponent from '../components/Modal/ModalComponent.jsx';
import DeleteModal from '../components/Modal/DeleteModal.jsx';
import { useNavigate } from 'react-router-dom';
import InputText from '../components/InputText.jsx';
import UniIcon from '../utils/UniIcon.jsx';
import InputSelect from '../components/InputSelect.jsx';

const Tests = () => {

  const { data, loading: loadingTests, error: errorTests, fetchData } = UseFetch()
  const { data: dataTypeTests, loading: loadingTypeTests, error: errorTypeTests, fetchData: fetchTypeTests } = UseFetch()
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [typeTest, setTypeTest] = useState('');
  const [maxTimeMinutes, setMaxTimeMinutes] = useState('');
  const [registerSelected, setRegisterSelected] = useState(null);
  const [refreshData, setRefreshData] = useState(false);
  const navigation = useNavigate();
  const { isOpen: isOpenCreate, onOpen: onOpenCreate, onClose: onCloseCreate } = useDisclosure()
  const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
  const [errorModal, setErroModal] = useState('');

  useEffect(() => {

    fetchData({
      url: '/tests',
      method: 'GET',
    })
    fetchTypeTests({
      url: '/testtypes',
      method: 'GET',
    })
  }, [fetchData, refreshData])

  const cleanForm = () => {
    setName('');
    setDescription('');
    setRegisterSelected(null);
    setErroModal('');
    setMaxTimeMinutes('');
    setRefreshData(!refreshData);
  }

  const handleClose = () => {
    onCloseCreate();
    onCloseUpdate();
    onCloseDelete();
    cleanForm();
  }

  const validateInputs = () => {
    if (!name || !description || !typeTest) {

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
        url: '/tests',
        method: 'POST',
        body: {
          name,
          description,
          type_id: parseInt(typeTest),
          max_time_minutes: parseInt(maxTimeMinutes),
        }
      });
      handleClose();
      cleanForm();
    } catch (error) {
      console.error('Error al crear test:', error);
    }
  }

  const onSelectItem = async (data) => {
    setName(data.name);
    setDescription(data.description);
    setTypeTest(data.type_id);
    setMaxTimeMinutes(data.max_time_minutes);
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
        url: `/tests/${registerSelected.id}`,
        method: 'PUT',
        body: {
          name,
          description,
          type_id: parseInt(typeTest),
          max_time_minutes: parseInt(maxTimeMinutes),
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
        url: `/tests/${registerSelected.id}`,
        method: 'DELETE',
      });
      handleClose();
      cleanForm();
    } catch (error) {
      console.error('Error al eliminar el test:', error);
    }
  }

  const orderedData = data && data.length > 0 ? data.sort((a, b) => a.position - b.position) : data;


  if (loadingTests || loadingTypeTests) return <Loading />
  if (errorTests || errorTypeTests) return <Text color={'red.500'}>Error: {errorTests || errorTypeTests}</Text>

  return (
    <Stack dir='column' justifyContent={'flex-start'} alignItems={'flex-start'} gap={3} w={'100%'} h='100%'>
      <Heading color={'dark_text'} fontSize={{ base: 'xl', md: '3xl' }}>Tets Existentes</Heading>
      <Text color={'text'} fontSize={{ base: '0.8rem', md: '0.9rem' }}>Gestiona todos los tests creados</Text>
      <Stack flexDir={'row'} justifyContent={{ base: 'flex-start', md: 'flex-end' }} alignItems={'center'} w={'100%'}>
        <Button variant={"solid"} size="sm" onClick={onOpenCreate} minHeight={10}> Agregar nuevo test</Button>
      </Stack>
      {
        (!orderedData || orderedData.length === 0) && (
          <Text color={'text'} fontSize={{ base: '0.8rem', md: '0.9rem' }}>No se han creado tests</Text>
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
                  <Th textAlign={'center'}>Tipo</Th>
                  <Th textAlign={'center'}>Acciones</Th>

                </Tr>
              </Thead>
              <Tbody>
                {data.map((dt, i) => {
                  return (
                    <Tr key={dt.id} bgColor={i % 2 === 0 ? '#F8FAFC' : 'white'}>
                      <Td textAlign={'center'}>{dt.name}</Td>
                      <td style={{ textWrap: 'balance', textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: dt.description && dt.description.length > 150 ? dt.description.substring(0, 200) + '...' : dt.description }} />
                      <Td textAlign={'center'}>{dataTypeTests && dataTypeTests.length > 0 && dataTypeTests.find(d => d.id === dt.type_id).name}</Td>
                      <Td textAlign={'center'}>
                        <Stack flexDir={'row'} justifyContent={'center'} alignItems={'center'}>
                          <Button rightIcon={<UniIcon icon={'UilEye'} size={6} />} size={'sm'} variant='darkGray' minH={8} onClick={() => { navigation(`/test/${dt.id}`) }}  > Configurar</Button>
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
      <ModalComponent isOpen={isOpenCreate} onClose={handleClose} title={'Crear nuevo test'}>
        <Stack w='100%' gap={2}>
          <Stack>
            <InputText text={'Nombre'} placeholder={'Nombre del test'} type={'text'} value={name} setValue={setName} />
            <InputText text={'Descripcion'} placeholder={'Descripcion del test'} type={'text'} value={description} setValue={setDescription} />
            <InputSelect text={'Tipo'} value={typeTest} setValue={setTypeTest} options={dataTypeTests} />
            <InputText text={'Tiempo maximo'} placeholder={'Tiempo maximo'} type={'number'} value={maxTimeMinutes} setValue={setMaxTimeMinutes} />
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

      <ModalComponent isOpen={isOpenUpdate} onClose={handleClose} title={'Actualizar test'}>
        <Stack w='100%' gap={2}>
          <Stack>
            <InputText text={'Nombre'} placeholder={'Nombre del test'} type={'text'} value={name} setValue={setName} />
            <InputText text={'Descripcion'} placeholder={'Descripcion del test'} type={'text'} value={description} setValue={setDescription} />
            <InputSelect text={'Tipo'} value={typeTest} setValue={setTypeTest} options={dataTypeTests} />
            <InputText text={'Tiempo maximo'} placeholder={'Tiempo maximo'} type={'number'} value={maxTimeMinutes} setValue={setMaxTimeMinutes} />
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

export default Tests