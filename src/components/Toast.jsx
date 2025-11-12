import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';

const Toast = ({ title, description, status }) => {
  const toast = useToast();

  useEffect(() => {
    if (title || description) {
      toast({
        title,
        description,
        status,
        duration: 4000,
        isClosable: true,
      });
    }
  }, [title, description, status]);

  return null; // no renderiza nada visible
};

export default Toast;