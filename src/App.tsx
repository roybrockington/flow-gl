import { useRef, useCallback, DragEvent, useState } from 'react'
import {
    ReactFlow,
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    useReactFlow,
    Connection,
    Panel,
    ReactFlowInstance,
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

const nodeTypes = {
    source: Source,
    layer: Layer
}

const flowKey = 'assigntment'

let id = 0
const getId = () => `dndnode_${id++}`

const DnDFlow = () => {
    const reactFlowWrapper = useRef(null)
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState([])
    const { screenToFlowPosition, setViewport } = useReactFlow()
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null)

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
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

    const onSave = useCallback(() => {
        if (rfInstance) {
            console.log(rfInstance)
            const flow = rfInstance.toObject()
            localStorage.setItem(flowKey, JSON.stringify(flow))
        }
    }, [rfInstance])

    const onRestore = useCallback(() => {
        const restoreFlow = async () => {
            const flow = JSON.parse(localStorage.getItem(flowKey) || '""')

            if (flow) {
                const { x = 0, y = 0, zoom = 1 } = flow.viewport
                setNodes(flow.nodes || [])
                setEdges(flow.edges || [])
                setViewport({ x, y, zoom })
            }
        }

        restoreFlow()
    }, [setNodes, setViewport])

    const handleInit = useCallback((instance: ReactFlowInstance) => {
        setRfInstance(instance)
    }, [])


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
                    onInit={handleInit as any} // @todo - fix type error
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    nodeTypes={nodeTypes}
                    fitView
                >
                    <Controls />
                      <Panel position="top-right">
                        <button onClick={onSave}>Save</button>
                        <button onClick={onRestore}>Restore</button>
                      </Panel>
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
