import { useRef, useCallback, DragEvent, useState, useEffect } from 'react'
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
    getConnectedEdges,
    useNodesData
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import NodeMenu from './components/NodeMenu'
import './index.css'
import Source from './nodes/SourceNode'
import Layer from './nodes/LayerNode'
import CompiledMap from './components/Map'

const demoSources = [
    'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/san-francisco.geojson', // multipolygon
    'https://raw.githubusercontent.com/dwillis/nyc-maps/master/boroughs.geojson', // multipolygon
    'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/chicago.geojson', // multipolygon
    'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart.geo.json' //points
]

const initialNodes = [
    {
        id: '1',
        type: 'source',
        data: { url: demoSources[0] },
        position: { x: 200, y: 5 },
    },
    {
        id: '2',
        type: 'source',
        data: { url: demoSources[2] },
        position: { x: 200, y: 230 },
    },
    {
        id: '3',
        type: 'layer',
        data: {},
        position: { x: 400, y: 5 },
    },
    {
        id: '4',
        type: 'layer',
        data: {},
        position: { x: 400, y: 230 },
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

            if (typeof type === 'undefined' || !type) {
                return
            }

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
                    <Panel position="top-left">
                        <button onClick={onSave}>Save</button>
                        <button onClick={onRestore}>Restore</button>
                    </Panel>
                    <Panel position="top-right">
                        <button onClick={()=>console.log('map!')}>Map &gt;</button>
                    </Panel>
                </ReactFlow>
            </div>
            <div style={{border: '1px green solid', position: 'absolute', right: 0, top: 0, width: '50vw', height: '50vh'}}>
                <CompiledMap nodes={nodes} edges={edges} />
            </div>
        </div>
    )
}

export default () => (
    <div style={{display:'flex'}}>
        <div style={{width: '50vw', height: '80vh', border: '1px solid black'}}>
            <ReactFlowProvider>
                <DnDFlow />
            </ReactFlowProvider>
        </div>
    </div>
)
