import React, { useState, useEffect } from 'react';
import { Button, HStack, Stack } from '@chakra-ui/react';
import UniIcon from '../utils/UniIcon';

const FONT_SIZES = [14, 16, 18, 20, 22];

const FontSizeAdjuster = () => {
  const [sizeIndex, setSizeIndex] = useState(
    FONT_SIZES.indexOf(16) !== -1 ? FONT_SIZES.indexOf(16) : 1
  );

  useEffect(() => {
    const targetElement = document.documentElement;
    const newSize = FONT_SIZES[sizeIndex];
    targetElement.style.setProperty('--base-font-size', `${newSize}px`);

    localStorage.setItem('baseFontSizeIndex', sizeIndex);
  }, [sizeIndex]);

  useEffect(() => {
    const savedIndex = localStorage.getItem('baseFontSizeIndex');
    if (savedIndex !== null) {
      setSizeIndex(parseInt(savedIndex, 10));
    }
  }, []);

  const increaseSize = () => {
    setSizeIndex((prevIndex) =>
      Math.min(prevIndex + 1, FONT_SIZES.length - 1)
    );
  };

  const decreaseSize = () => {
    setSizeIndex((prevIndex) =>
      Math.max(prevIndex - 1, 0)
    );
  };

  return (
    <Stack flexDir={'row'} alignItems={'center'} justifyContent={'center'} w={'100%'} cursor={'pointer'}>
      <Button
        onClick={decreaseSize}
        variant="gray"
        size="sm"
        isDisabled={sizeIndex === 0}
        aria-label="Decrease font size"
      >
        A-
      </Button>
      <Button
        onClick={increaseSize}
        variant="gray"
        size="sm"
        isDisabled={sizeIndex === FONT_SIZES.length - 1}
        aria-label="Increase font size"
      >
        A+
      </Button>

    </Stack>
  );
};

export default FontSizeAdjuster;