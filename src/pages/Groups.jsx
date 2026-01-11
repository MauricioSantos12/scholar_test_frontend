import { Button, Heading, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import UseFetch from '../utils/UseFetch.js';
import Loading from '../components/Loading.jsx';
import ModalComponent from '../components/Modal/ModalComponent.jsx';
import DeleteModal from '../components/Modal/DeleteModal.jsx';
import { useNavigate } from 'react-router-dom';
import InputText from '../components/InputText.jsx';
import UniIcon from '../utils/UniIcon.jsx';

const Groups = () => {

  const { data, loading: loadingGroups, error: errorGroups, fetchData } = UseFetch()

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [city, setCity] = useState('');
  const [registerSelected, setRegisterSelected] = useState(null);
  const [refreshData, setRefreshData] = useState(false);
  const navigation = useNavigate();
  const { isOpen: isOpenCreate, onOpen: onOpenCreate, onClose: onCloseCreate } = useDisclosure()
  const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
  const [errorModal, setErroModal] = useState('');
  const showToast = useToast();
  const globalName = 'grupo';

  useEffect(() => {
    fetchData({
      url: '/groups',
      method: 'GET',
    })

  }, [fetchData, refreshData])

  const cleanForm = () => {
    setName('');
    setDescription('');
    setCity('');
    setSchoolName('');
    setRegisterSelected(null);
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
    if (!name || !description) {

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
        url: '/groups',
        method: 'POST',
        body: {
          name,
          description,
          city,
          school_name: schoolName
        }
      });
      showToast({
        title: "Creacion Exitosa",
        description: "El contenido ha sido creado con exito",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom-right"
      })
      handleClose();
      cleanForm();
    } catch (error) {
      console.error('Error al crear grupo:', error);
      showToast({
        title: "Error",
        description: "Ha ocurrido un error al crear el grupo",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-right"
      })
    }
  }


  const onSelectItem = async (data) => {
    setName(data.name);
    setDescription(data.description);
    setCity(data.city);
    setSchoolName(data.school_name);
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
      const updatedTest = await fetchData({
        url: `/groups/${registerSelected.id}`,
        method: 'PUT',
        body: {
          name,
          description,
          city,
          school_name: schoolName
        }
      });
    } catch (error) {
      console.error('Error al actualizar el grupo:', error);
      showToast({
        title: "Error",
        description: `Ha ocurrido un error al actualizar el grupo - ${error}`,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-right"
      })
    } finally {
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
    }
  }


  const onOpenDeleteData = () => {
    onOpenDelete();
  }

  const handleDelete = async () => {
    try {
      await fetchData({
        url: `/groups/${registerSelected.id}`,
        method: 'DELETE',
      });
      handleClose();
      cleanForm();
      showToast({
        title: "Eliminacion Exitosa",
        description: "El contenido ha sido eliminado con exito",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom-right"
      })
    } catch (error) {
      console.error('Error al eliminar el grupo:', error);
    }
  }

  const orderedData = data && data.length > 0 ? data.sort((a, b) => a.position - b.position) : data;

  const colorDarkText = useColorModeValue('dark_text', 'secondary.100');
  const colorText = useColorModeValue('text', 'secondary.200');
  const bgColorActiveRowColorMode = useColorModeValue('#F8FAFC', 'secondary.700');
  const bgColorRowColorMode = useColorModeValue('white', 'secondary.800');

  if (loadingGroups) return <Loading />
  if (errorGroups) return <Text color={'red.500'}>Error: {errorGroups}</Text>

  return (
    <Stack dir='column' justifyContent={'flex-start'} alignItems={'flex-start'} gap={3} w={'100%'} h='100%'>
      <Heading color={colorDarkText} fontSize={{ base: 'xl', md: '3xl' }}>Grupos Existentes</Heading>
      <Text color={colorText} fontSize={{ base: '0.8rem', md: '0.9rem' }}>Gestiona todos los grupos creados</Text>
      <Stack flexDir={'row'} justifyContent={{ base: 'flex-start', md: 'flex-end' }} alignItems={'center'} w={'100%'}>
        <Button variant={"solid"} size="sm" onClick={onOpenCreate} minHeight={10}> Agregar nuevo grupo</Button>
      </Stack>
      {
        (!orderedData || orderedData.length === 0) && (
          <Text color={colorText} fontSize={{ base: '0.8rem', md: '0.9rem' }}>No se han creado grupos aún</Text>
        )
      }
      {
        orderedData && orderedData.length > 0 && (
          <TableContainer w={'100%'}>
            <Table variant='simple' size={'lg'} color={colorDarkText}>
              <Thead color={colorDarkText}>
                <Tr>
                  <Th textAlign={'center'}>Nombre</Th>
                  <Th textAlign={'center'}>Descripcion</Th>
                  <Th textAlign={'center'}>Ciudad</Th>
                  <Th textAlign={'center'}>Institución Educativa</Th>
                  <Th textAlign={'center'}>Acciones</Th>

                </Tr>
              </Thead>
              <Tbody color={colorDarkText}>
                {data.map((dt, i) => {
                  return (
                    <Tr key={data.id} bgColor={i % 2 === 0 ? bgColorActiveRowColorMode : bgColorRowColorMode}>
                      <Td textAlign={'center'}>{dt.name}</Td>
                      <td style={{ textWrap: 'balance', textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: dt.description && dt.description.length > 150 ? dt.description.substring(0, 200) + '...' : dt.description }} />
                      <Td textAlign={'center'}>{dt.city}</Td>
                      <Td textAlign={'center'}>{dt.school_name}</Td>
                      <Td textAlign={'center'}>
                        <Stack flexDir={'row'} justifyContent={'center'} alignItems={'center'}>
                          <Button rightIcon={<UniIcon icon={'UilEye'} size={6} />} size={'sm'} variant='darkGray' minH={8} onClick={() => { navigation(`/group/${dt.id}`) }}  > Configurar</Button>
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
      <ModalComponent isOpen={isOpenCreate} onClose={handleClose} title={`Crear nuevo ${globalName}`}>
        <Stack w='100%' gap={2}>
          <Stack>
            <InputText text={'Nombre'} placeholder={`Nombre del ${globalName}`} type={'text'} value={name} setValue={setName} />
            <InputText text={'Descripcion'} placeholder={`Descripcion del ${globalName}`} type={'text'} value={description} setValue={setDescription} />
            <InputText text={'Ciudad'} placeholder={`Ciudad del ${globalName}`} type={'text'} value={city} setValue={setCity} />
            <InputText text={'Institución Educativa'} placeholder={'Nombre de la institución educativa'} type={'text'} value={schoolName} setValue={setSchoolName} />
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

      <ModalComponent isOpen={isOpenUpdate} onClose={handleClose} title={`Actualizar ${globalName}`}>
        <Stack w='100%' gap={2}>
          <Stack>
            <InputText text={'Nombre'} placeholder={`Nombre del ${globalName}`} type={'text'} value={name} setValue={setName} />
            <InputText text={'Descripcion'} placeholder={`Descripcion del ${globalName}`} type={'text'} value={description} setValue={setDescription} />
            <InputText text={'Ciudad'} placeholder={`Ciudad del ${globalName}`} type={'text'} value={city} setValue={setCity} />
            <InputText text={'Institución Educativa'} placeholder={'Nombre de la institución educativa'} type={'text'} value={schoolName} setValue={setSchoolName} />
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

export default Groups