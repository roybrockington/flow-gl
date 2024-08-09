import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import LayersIcon from '@mui/icons-material/Layers'
import { Box, Typography } from '@mui/material'

export default memo(({ isConnectable }: {isConnectable: boolean}) => {
    return (
        <>
            <Box
                height={100}
                width={200}
                my={4}
                color='white'
                display="flex"
                borderRadius={1}
                alignItems="start"
                gap={4}
                p={2}
                sx={{
                    bgcolor: 'primary.main',
                    '&:hover': {
                        bgcolor: 'primary.dark',
                    },
                }}
            >
                <Typography color="neutral" fontSize="sm" fontWeight="lg" display='flex' width="1" justifyContent='space-between'>
                Layer 
                <LayersIcon />
                </Typography>
            </Box>
            <Handle
                type="target"
                position={Position.Left}
                id="a"
                isConnectable={isConnectable}
            />
        </>
    );
});



