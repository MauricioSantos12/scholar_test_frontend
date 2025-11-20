import { Button, Divider, Heading, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import UniIcon from '../utils/UniIcon.jsx';
import UseFetch from '../utils/UseFetch';
import InputText from '../components/InputText';
import Loading from '../components/Loading';
import DeleteModal from '../components/Modal/DeleteModal';
import ModalComponent from '../components/Modal/ModalComponent.jsx';
import { useAuth } from '../context/useAuth.js';

const Users = () => {
    const { data: dataUsers, loading: loadingUsers, error: errorUsers, fetchData: fetchUsers } = UseFetch()
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [identificationNumber, setIdentificationNumber] = useState('');
    const [password, setPassword] = useState('');
    const [dateBirth, setDateBirth] = useState('');
    const [schoolName, setSchoolName] = useState('');
    const [parentName, setParentName] = useState('');
    const [parentEmail, setParentEmail] = useState('');
    const [parentPhone, setParentPhone] = useState('');
    const [roleUser, setRoleUser] = useState('');
    const [city, setCity] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [registerSelected, setRegisterSelected] = useState(null);
    const [refreshData, setRefreshData] = useState(false);
    const { isOpen: isOpenCreate, onOpen: onOpenCreate, onClose: onCloseCreate } = useDisclosure()
    const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const { user } = useAuth();
    const showToast = useToast();

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
        setParentEmail('');
        setParentName('');
        setParentPhone('');
        setRoleUser('');
        setShowPassword(false);
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
                    role: 'student',
                    parent_name: parentName,
                    parent_email: parentEmail,
                    parent_phone: parentPhone
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
            console.error('Error al crear el usuario:', error);
            showToast({
                title: "Error",
                description: "Ha ocurrido un error al crear el usuario",
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "bottom-right"
            })
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
        setParentName(data.parent_name);
        setParentEmail(data.parent_email);
        setParentPhone(data.parent_phone);
        setRoleUser(data.role);
        // setPassword(data.password);
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
                    city,
                    role: registerSelected.role,
                    parent_name: parentName,
                    parent_email: parentEmail,
                    parent_phone: parentPhone
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
            showToast({
                title: "Error",
                description: "Ha ocurrido un error al actualizar el usuario",
                status: "error",
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
            await fetchUsers({
                url: `/users/${registerSelected.id}`,
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
            console.error('Error al eliminar el usuario:', error);
            showToast({
                title: "Error",
                description: "Ha ocurrido un error al eliminar el usuario",
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "bottom-right"
            })
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
            <ModalComponent isOpen={isOpenCreate} onClose={handleClose} title={'Crear nuevo usario'}>
                <Stack w='100%' gap={2}>
                    <Stack>
                        <InputText text={'Nombre'} placeholder={'Nombre'} type={'text'} value={name} setValue={setName} />
                        <InputText text={'Apellido'} placeholder={'Apeliido'} type={'text'} value={lastName} setValue={setLastName} />
                        <InputText text={'Correo'} placeholder={'Correo'} type={'email'} value={email} setValue={setEmail} />
                        <InputText text={'Identificacion'} placeholder={'Identificacion'} type={'text'} value={identificationNumber} setValue={setIdentificationNumber} />
                        <InputText text={'Ciudad'} placeholder={'Ciudad'} type={'text'} value={city} setValue={setCity} />
                        <InputText text={'Colegio'} placeholder={'Colegio'} type={'text'} value={schoolName} setValue={setSchoolName} />
                        <Divider />
                        {
                            roleUser === 'student' && (
                                <>
                                    <InputText text={'Nombre acudiente'} placeholder={'Pedro'} type={'text'} value={parentName} setValue={setParentName} />
                                    <InputText text={'Correo acudiente'} placeholder={'8dYQK@example.com'} type={'email'} value={parentEmail} setValue={setParentEmail} />
                                    <InputText text={'Telefono acudiente'} placeholder={'123456789'} type={'text'} value={parentPhone} setValue={setParentPhone} />
                                    <Divider />
                                </>
                            )
                        }

                        <InputText
                            text={'Contraseña'}
                            placeholder={'Contraseña'}
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            setValue={setPassword}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                        />
                        <Stack flexDir={'row'} justifyContent={'flex-end'} alignItems={'center'} w='100%'>
                            <Button variant={"gray"} size="sm" onClick={handleClose}> Cancelar</Button>
                            <Button variant={"solid"} size="sm" onClick={handleSave}> Crear</Button>
                        </Stack>
                    </Stack>
                </Stack>
            </ModalComponent>

            <ModalComponent isOpen={isOpenUpdate} onClose={handleClose} title={'Actualizar nuevo usario'}>
                <Stack w='100%' gap={2}>
                    <Stack>
                        <InputText text={'Nombre'} placeholder={'Nombre'} type={'text'} value={name} setValue={setName} />
                        <InputText text={'Apellido'} placeholder={'Apeliido'} type={'text'} value={lastName} setValue={setLastName} />
                        <InputText text={'Correo'} placeholder={'Correo'} type={'email'} value={email} setValue={setEmail} disabled={user && user.role === 'admin' ? false : true} />
                        <InputText text={'Identificacion'} placeholder={'Identificacion'} type={'text'} value={identificationNumber} setValue={setIdentificationNumber} disabled={user && user.role === 'admin' ? false : true} />
                        <InputText text={'Ciudad'} placeholder={'Ciudad'} type={'text'} value={city} setValue={setCity} />
                        <InputText text={'Colegio'} placeholder={'Colegio'} type={'text'} value={schoolName} setValue={setSchoolName} />
                        <Divider />
                        {
                            roleUser === 'student' && (
                                <>
                                    <InputText text={'Nombre acudiente'} placeholder={'Pedro'} type={'text'} value={parentName} setValue={setParentName} />
                                    <InputText text={'Correo acudiente'} placeholder={'8dYQK@example.com'} type={'email'} value={parentEmail} setValue={setParentEmail} />
                                    <InputText text={'Telefono acudiente'} placeholder={'123456789'} type={'text'} value={parentPhone} setValue={setParentPhone} />
                                    <Divider />
                                </>
                            )
                        }

                        <InputText
                            text={'Pasword'}
                            placeholder={'****'}
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            setValue={setPassword}
                            disabled={user && user.role === 'admin' ? false : true}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                        />

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