import { Button, Heading, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import UniIcon from '../utils/UniIcon.jsx';
import UseFetch from '../utils/UseFetch';
import InputText from '../components/InputText';
import Loading from '../components/Loading';
import DeleteModal from '../components/Modal/DeleteModal';
import ModalComponent from '../components/Modal/ModalComponent.jsx';

const Users = () => {
    const { data: dataUsers, loading: loadingUsers, error: errorUsers, fetchData: fetchUsers } = UseFetch()
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [identificationNumber, setIdentificationNumber] = useState('');
    const [password, setPassword] = useState('');
    const [dateBirth, setDateBirth] = useState('');
    const [schoolName, setSchoolName] = useState('');
    const [city, setCity] = useState('');
    const [registerSelected, setRegisterSelected] = useState(null);
    const [refreshData, setRefreshData] = useState(false);
    const { isOpen: isOpenCreate, onOpen: onOpenCreate, onClose: onCloseCreate } = useDisclosure()
    const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()

    useEffect(() => {
        fetchUsers({
            url: '/users',
            method: 'GET',
        });

    }, [fetchUsers, refreshData]);

    const cleanForm = () => {
        setName('');
        setLastName('');
        setEmail('');
        setIdentificationNumber('');
        setPassword('');
        setDateBirth('');
        setSchoolName('');
        setCity('');
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
            await fetchUsers({
                url: '/users',
                method: 'POST',
                body: {
                    name,
                    last_name: lastName,
                    email,
                    identification_number: identificationNumber,
                    password,
                    date_birth: dateBirth,
                    school_name: schoolName,
                    city,
                    role: 'student'
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
        setLastName(data.last_name);
        setEmail(data.email);
        setIdentificationNumber(data.identification_number);
        setCity(data.city);
        setSchoolName(data.school_name);
        setDateBirth(data.date_birth);
        setRegisterSelected(data);
    }

    const onOpenUpdateData = () => {
        onOpenUpdate();
    }

    const handleUpdate = async () => {
        try {
            await fetchUsers({
                url: `/users/${registerSelected.id}`,
                method: 'PUT',
                body: {
                    name,
                    last_name: lastName,
                    email,
                    identification_number: identificationNumber,
                    password,
                    date_birth: dateBirth,
                    school_name: schoolName,
                    city
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
            await fetchUsers({
                url: `/users/${registerSelected.id}`,
                method: 'DELETE',
            });
            handleClose();
            cleanForm();
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
        }
    }

    const colorDarkText = useColorModeValue('dark_text', 'secondary.100');
    const colorText = useColorModeValue('text', 'secondary.200');
    const bgColorActiveRowColorMode = useColorModeValue('#F8FAFC', 'secondary.700');
    const bgColorRowColorMode = useColorModeValue('white', 'secondary.800');

    if (loadingUsers) return <Loading />;
    if (errorUsers) return <Text color={'red.500'}>Error: {errorUsers}</Text>;


    return (
        <Stack dir='column' justifyContent={'flex-start'} alignItems={'flex-start'} gap={3} w={'100%'} h='100%'>
            <Heading color={colorDarkText} fontSize={{ base: 'xl', md: '3xl' }}>Usuarios</Heading>
            <Text color={colorText} fontSize={{ base: '0.8rem', md: '0.9rem' }}>Listado de todos los usuarios del sistema</Text>
            <Stack flexDir={'row'} justifyContent={{ base: 'flex-start', md: 'flex-end' }} alignItems={'center'} w={'100%'}>
                <Button variant={"solid"} size="sm" onClick={onOpenCreate} minHeight={10}> Agregar nuevo usuario</Button>
            </Stack>
            {
                (!dataUsers || dataUsers.length === 0) && (
                    <Text color={colorText} fontSize={{ base: '0.8rem', md: '0.9rem' }}>No se han creado usuarios</Text>
                )
            }
            {
                dataUsers && dataUsers.length > 0 && (
                    <TableContainer w={'100%'} color={colorText}>
                        <Table variant='simple' size={'lg'} color={colorText}>
                            <Thead>
                                <Tr>
                                    <Th textAlign={'center'}>Identificacion</Th>
                                    <Th textAlign={'center'}>Nombre</Th>
                                    <Th textAlign={'center'}>Apellido</Th>
                                    <Th textAlign={'center'}>Correo</Th>
                                    <Th textAlign={'center'}>Ciudad</Th>
                                    <Th textAlign={'center'}>Colegio</Th>
                                    <Th textAlign={'center'}>Rol</Th>
                                    <Th textAlign={'center'}>Acciones</Th>

                                </Tr>
                            </Thead>
                            <Tbody color={colorText}>
                                {dataUsers.map((data, i) => (
                                    <Tr key={data._id} bgColor={i % 2 === 0 ? bgColorActiveRowColorMode : bgColorRowColorMode}>
                                        <Td textAlign={'center'}>{data.identification_number}</Td>
                                        <Td textAlign={'center'}>{data.name}</Td>
                                        <Td textAlign={'center'}>{data.last_name}</Td>
                                        <Td textAlign={'center'}>{data.email}</Td>
                                        <Td textAlign={'center'}>{data.city}</Td>
                                        <Td textAlign={'center'}>{data.school_name}</Td>
                                        <Td textAlign={'center'}>{data.role}</Td>
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
                        <InputText text={'Nombre'} placeholder={'Nombre'} type={'text'} value={name} setValue={setName} />
                        <InputText text={'Apellido'} placeholder={'Apeliido'} type={'text'} value={lastName} setValue={setLastName} />
                        <InputText text={'Correo'} placeholder={'Correo'} type={'email'} value={email} setValue={setEmail} />
                        <InputText text={'Identificacion'} placeholder={'Identificacion'} type={'text'} value={identificationNumber} setValue={setIdentificationNumber} />
                        <InputText text={'Ciudad'} placeholder={'Ciudad'} type={'text'} value={city} setValue={setCity} />
                        <InputText text={'Colegio'} placeholder={'Colegio'} type={'text'} value={schoolName} setValue={setSchoolName} />
                        <InputText text={'Contraseña'} placeholder={'Contraseña'} type={'password'} value={password} setValue={setPassword} />
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
                        <InputText text={'Apellido'} placeholder={'Apeliido'} type={'text'} value={lastName} setValue={setLastName} />
                        <InputText text={'Correo'} placeholder={'Correo'} type={'email'} value={email} setValue={setEmail} disabled={true} />
                        <InputText text={'Identificacion'} placeholder={'Identificacion'} type={'text'} value={identificationNumber} setValue={setIdentificationNumber} disabled={true} />
                        <InputText text={'Ciudad'} placeholder={'Ciudad'} type={'text'} value={city} setValue={setCity} />
                        <InputText text={'Colegio'} placeholder={'Colegio'} type={'text'} value={schoolName} setValue={setSchoolName} />
                        <InputText text={'Pasword'} placeholder={'****'} type={'password'} value={password} setValue={setPassword} disabled={true} />

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

export default Users