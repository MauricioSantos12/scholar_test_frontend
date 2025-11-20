import { Button, Heading, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import UseFetch from '../utils/UseFetch';
import Loading from '../components/Loading.jsx';
import UniIcon from '../utils/UniIcon.jsx';
import ModalComponent from '../components/Modal/ModalComponent.jsx';
import InputText from '../components/InputText.jsx';
import DeleteModal from '../components/Modal/DeleteModal.jsx';
import { useNavigate } from 'react-router-dom';

const Areas = () => {
  const { data: dataAreas, loading: loadingAreas, error: errorAreas, fetchData: fetchAreas } = UseFetch()
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [registerSelected, setRegisterSelected] = useState(null);
  const [refreshData, setRefreshData] = useState(false);
  const navigation = useNavigate();
  const { isOpen: isOpenCreate, onOpen: onOpenCreate, onClose: onCloseCreate } = useDisclosure()
  const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
  const [errorModal, setErroModal] = useState('');
  const showToast = useToast();

  useEffect(() => {
    fetchAreas({
      url: '/areas',
      method: 'GET',
    });
  }, [fetchAreas, refreshData]);

  const cleanForm = () => {
    setName('');
    setDescription('');
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
      await fetchAreas({
        url: '/areas',
        method: 'POST',
        body: {
          name,
          description,
        }
      });

      handleClose();
      cleanForm();
      showToast({
        title: "Edicion Exitosa",
        description: "El contenido ha sido editado con exito",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom-right"
      })
    } catch (error) {
      console.error('Error al crear área:', error);
      showToast({
        title: "Error",
        description: "Ha ocurrido un error al crear el área",
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
      await fetchAreas({
        url: `/areas/${registerSelected.id}`,
        method: 'PUT',
        body: {
          name,
          description,
        }
      });

    } catch (error) {
      console.error('Error al actualizar el test:', error);
      showToast({
        title: "Error",
        description: "Ha ocurrido un error al actualizar el área",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-right"
      })
    } finally {
      handleClose();
      cleanForm();
      showToast({
        title: "Edicion Exitosa",
        description: "El contenido ha sido editado con exito",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom-right"
      })
    }
  }


  const onOpenDeleteData = () => {
    onOpenDelete();
  }

  const handleDelete = async () => {
    try {
      await fetchAreas({
        url: `/areas/${registerSelected.id}`,
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
      console.error('Error al eliminar el test:', error);
    }
  }

  const orderedData = dataAreas && dataAreas.length > 0 ? dataAreas.sort((a, b) => a.position - b.position) : dataAreas;

  const colorDarkText = useColorModeValue('dark_text', 'secondary.100');
  const colorText = useColorModeValue('text', 'secondary.200');
  const bgColorActiveRowColorMode = useColorModeValue('#F8FAFC', 'secondary.700');
  const bgColorRowColorMode = useColorModeValue('white', 'secondary.800');

  if (loadingAreas) return <Loading />;
  if (errorAreas) return <Text color={'red.500'}>Error: {errorAreas}</Text>;

  return (
    <Stack dir='column' justifyContent={'flex-start'} alignItems={'flex-start'} gap={3} w={'100%'} h='100%'>
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
          <TableContainer w={'100%'} color={colorText}>
            <Table variant='simple' size={'lg'}>
              <Thead color={colorDarkText}>
                <Tr>
                  <Th textAlign={'center'}>Nombre</Th>
                  <Th textAlign={'center'}>Descripcion</Th>
                  <Th textAlign={'cetner'}>Acciones</Th>

                </Tr>
              </Thead>
              <Tbody color={colorText}>
                {orderedData.map((dt, i) => (
                  <Tr key={dt.id} bgColor={i % 2 === 0 ? bgColorActiveRowColorMode : bgColorRowColorMode}>
                    <Td textAlign={'center'}>{dt.name}</Td>
                    <Td textAlign={'center'}>{dt.description && dt.description.length > 100 ? dt.description.substring(0, 100) + '...' : dt.description}</Td>
                    <Td textAlign={'center'}>
                      <Stack flexDir={'row'} justifyContent={'center'} alignItems={'center'}>
                        <Button rightIcon={<UniIcon icon={'UilEye'} size={6} />} size={'sm'} variant='darkGray' minH={8} onClick={() => { navigation(`/area/${dt.id}`) }}  > Configurar</Button>
                        <Button rightIcon={<UniIcon icon={'UilPen'} size={6} />} size={'sm'} variant='green' minH={8} onClick={() => { onSelectItem(dt); onOpenUpdateData() }}> Editar </Button>
                        <Button rightIcon={<UniIcon icon={'UilTrash'} size={6} />} size={'sm'} variant='red' minH={8} onClick={() => { onSelectItem(dt); onOpenDeleteData() }}  > Eliminar</Button>
                      </Stack>
                    </Td>
                  </Tr>
                ))}
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

export default Areas