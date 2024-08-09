import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { Box, TextField, Typography } from '@mui/material'
import LinkIcon from '@mui/icons-material/Link'

export default memo(({ id, data, isConnectable }: {id: string, data: any, isConnectable: boolean}) => {

    return (

        <>
            <Box
                height={100}
                width={200}
                my={4}
                color='black'
                display="flex"
                flexDirection="column"
                borderRadius={1}
                border={1}
                alignItems="start"
                justifyContent='center'
                gap={4}
                p={2}
                sx={{
                    bgcolor: '#eee',
                    '&:hover': {
                        bgcolor: '#ccc',
                    },
                }}
            >
                <Typography color="neutral" fontSize="sm" fontWeight="lg" display='flex' width="1" justifyContent='space-between'>
                    Source
                    <LinkIcon/>
                </Typography>
                <TextField
                    label="URL"
                    className="nodrag"
                    type="text"
                    sx={{bgcolor: 'white', width: 1}}
                    id={id}
                    onChange={data.onChange}
                    defaultValue={data.url}
                />
            </Box>
            <Handle
                type="source"
                position={Position.Right}
                id="a"
                isConnectable={isConnectable}
            />
        </>
    );
});



