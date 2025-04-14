import React, { ReactNode } from 'react';
import { Box, Typography, SxProps, Theme } from '@mui/material';

interface LabeledBoxProps {
  label: string;
  children?: ReactNode;
  sx?: SxProps<Theme>; // Allow additional sx properties
}

const LabeledBox: React.FC<LabeledBoxProps> = ({ label, children, sx }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        p: 2,
        border: '1px solid #ccc',
        borderRadius: 2,
        ...sx, // Merge additional sx properties
      }}
    >
      <Typography
        variant="body2"
        sx={{
          position: 'absolute',
          top: -12,
          left: 12,
          backgroundColor: 'background.paper',
          px: 1,
        }}
      >
        {label}
      </Typography>
      {children}
    </Box>
  );
};

export default LabeledBox;
