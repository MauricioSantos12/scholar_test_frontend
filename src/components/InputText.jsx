import { Button, Input, InputGroup, InputRightElement, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { Editor } from '@tinymce/tinymce-react';
import React from 'react'
import UniIcon from '../utils/UniIcon';


const InputText = ({ text, placeholder, value, setValue, type, disabled, setShowPassword, showPassword, props }) => {
    const colorDarkText = useColorModeValue('dark_text', 'secondary.100');
    const bgColor = useColorModeValue('secondary.100', 'secondary.900');
    console.log({ value })
    return (
        <Stack dir='column' justifyContent={'center'} alignItems={'flex-start'} gap={2} w='100%'>
            <Text color={colorDarkText} fontWeight={'bold'} fontSize={'lg'}>{text}</Text>
            {
                type === 'number' && (
                    <NumberInput
                        w={'100%'}
                        clampValueOnBlur={false}
                        defaultValue={value}
                        placeholder={placeholder || ''}
                        size={'md'}
                        min={0}
                        {...props}
                        onChange={(e) => setValue(e)}>
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                )
            }
            {
                (type === 'text' || type === 'email' || type == 'password') && (
                    <InputGroup size='md'>
                        <Input
                            value={value}
                            variant='outline'
                            placeholder={placeholder || ''}
                            bgColor={bgColor}
                            p={{ base: 2, md: 4 }}
                            fontSize={'md'}
                            minH={12}
                            type={type || 'text'}
                            onChange={(e) => setValue(e.target.value)} disabled={disabled}
                            {...props}
                        />
                        {
                            setShowPassword && (
                                <InputRightElement width='4.5rem' h={'100%'}>
                                    <UniIcon size={6} p={0} m={0} cursor='pointer' icon={showPassword ? 'UilEye' : 'UilEyeSlash'} onClick={() => setShowPassword(!showPassword)} />
                                </InputRightElement>
                            )
                        }

                    </InputGroup>
                )
            }
            {
                type === 'richtext' && (
                    <Editor
                        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                        init={{
                            setup: (editor) => {
                                editor.on('OpenDialog', () => {
                                    const dialogs = document.querySelectorAll('.tox-dialog');
                                    dialogs.forEach((dialog) => {
                                        dialog.style.zIndex = 200000;
                                    });
                                });
                            },
                            height: 350,
                            width: '100%',
                            menubar: false,
                            toolbar1: 'undo redo | bold italic underline | subscript superscript | removeformat | alignleft aligncenter alignright alignjustify',
                            plugins: ['charmap', 'lists'],
                            content_style:
                                'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                            uploadcare_public_key: '908ab7f173b03a6059ee',
                            skin: 'oxide',
                            content_css: 'default',
                            fixed_toolbar_container: false,
                            z_index: 200001,
                        }}
                        onEditorChange={(e) => setValue(e)}
                        // initialValue={value}
                        value={value}

                    />
                )
            }

            {
                type === 'date' && (
                    <Input size='md' type='datetime-local' variant='outline'
                        placeholder={placeholder || ''}
                        bgColor={bgColor}
                        p={{ base: 2, md: 4 }}
                        fontSize={'md'}
                        value={value}
                        minH={12} onChange={(e) => setValue(e)} disabled={disabled} />
                )
            }
        </Stack >
    )
}

export default InputText