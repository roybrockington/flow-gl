import { Box, TextField, Typography } from "@mui/material"
import LayersIcon from '@mui/icons-material/Layers'
import LinkIcon from '@mui/icons-material/Link'
import FilterFramesIcon from '@mui/icons-material/FilterFrames'

const NodeMenu = () => {
    const onDragStart = (e: React.DragEvent<HTMLDivElement>, nodeType: "source" | "layer" | "intersection") => {
        e.dataTransfer.setData('application/reactflow', nodeType)
        e.dataTransfer.effectAllowed = 'move'
    }

    return (
        <aside>
            <Typography variant="overline" gutterBottom display="flex" alignItems="center" gap={2} borderBottom={2} p={1}>
                <FilterFramesIcon />
                Nodes
            </Typography>
            <Box
                onDragStart={(event) => onDragStart(event, 'source')}
                draggable
                height={100}
                width={100}
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
                />
            </Box>
            <Box
                onDragStart={(event) => onDragStart(event, 'layer')} draggable
                height={100}
                width={100}
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
        </aside>
    )
}


export default NodeMenu
