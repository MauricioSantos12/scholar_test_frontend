import { Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Stack, Text } from '@chakra-ui/react'
import { Editor } from '@tinymce/tinymce-react';
import React from 'react'


const InputText = ({ text, placeholder, value, setValue, type, disabled }) => {
    return (
        <Stack dir='column' justifyContent={'center'} alignItems={'flex-start'} gap={4}>
            <Text color={'dark_text'} fontWeight={'bold'} fontSize={'lg'}>{text}</Text>
            {
                type === 'number' && (
                    <NumberInput
                        w={'100%'}
                        clampValueOnBlur={false}
                        defaultValue={value}
                        placeholder={placeholder || ''}
                        size={'md'}
                        min={0}
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
                type === 'text' && (
                    <Input
                        value={value}
                        variant='outline'
                        placeholder={placeholder || ''}
                        bgColor={'#F8FAFC'}
                        p={{ base: 2, md: 4 }}
                        fontSize={'md'}
                        minH={12}
                        type={type || 'text'}
                        onChange={(e) => setValue(e.target.value)} disabled={disabled} />
                )
            }
            {
                type === 'richtext' && (
                    <Editor
                        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                        init={{
                            setup: (editor) => {
                                editor.on('OpenDialog', (e) => {
                                    console.log({ e })
                                    const dialogs = document.querySelectorAll('.tox-dialog');
                                    console.log({ dialogs })
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
        </Stack>
    )
}

export default InputText