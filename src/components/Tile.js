import { Box } from '@mui/material'
export default function Tile({ letter, drag, won, red }) {

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                backgroundColor: 'none',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
                margin: 0,
                padding: 0,
                fontSize: '5rem',
                pointerEvents: won || red && 'none',
                '&:hover': {
                    backgroundColor: 'primary.main',
                    opacity: [0.9, 0.8, 0.7],
                },
            }}
            draggable="true"
            onDragStart={drag}
        >
            {letter}
        </Box>
    )
}