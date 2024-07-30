import { useRef, useCallback, DragEvent } from 'react'
import {
    ReactFlow,
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    useReactFlow,
    Connection,
    Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import NodeMenu from './components/NodeMenu'
import './index.css'
import Source from './nodes/SourceNode'
import Layer from './nodes/LayerNode'

const initialNodes = [
    {
        id: '1',
        type: 'source',
        data: { label: 'source node' },
        position: { x: 250, y: 5 },
    },
]

let id = 0
const getId = () => `dndnode_${id++}`

const DnDFlow = () => {
    const reactFlowWrapper = useRef(null)
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState([])
    const { screenToFlowPosition } = useReactFlow()

    const onConnect = useCallback(
        (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
        [],
    )

    const onDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
    }, [])

    const onDrop = useCallback(
        (e: DragEvent) => {
            e.preventDefault()

            const type = e.dataTransfer.getData('application/reactflow')

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return
            }

            // project was renamed to screenToFlowPosition
            // and you don't need to subtract the reactFlowBounds.left/top anymore
            // details: https://reactflow.dev/whats-new/2023-11-10
            const position = screenToFlowPosition({
                x: e.clientX,
                y: e.clientY,
            })
            const newNode = {
                id: getId(),
                type,
                position,
                data: { label: `${type} node` },
            }

            setNodes((nds) => nds.concat(newNode))
        },
        [screenToFlowPosition],
    )

    return (
        <div className="dndflow">
            <NodeMenu />
            <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    fitView
                >
                    <Controls />
                </ReactFlow>
            </div>
        </div>
    )
}

export default () => (
    <div style={{width: 800, height: 800}}>
        <ReactFlowProvider>
            <DnDFlow />
        </ReactFlowProvider>
    </div>
)
