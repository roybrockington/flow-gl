import { useRef, useCallback, DragEvent, useState, ChangeEvent } from 'react'
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
    Node,
    getOutgoers,
} from '@xyflow/react'
import NodeMenu from './components/NodeMenu'
import CompiledMap from './components/CompiledMap'
import { nodeTypes } from './nodes'
import '@xyflow/react/dist/style.css'

const flowKey = 'assignment'

let id = 0
const getId = () => `dndnode_${id++}`


const DnDFlow = () => {
    const reactFlowWrapper = useRef(null)
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])
    const { screenToFlowPosition, setViewport } = useReactFlow()
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null)
    const [showMap, setShowMap] = useState(false)
    const [mapLayers, setMapLayers] = useState<Node[]>([])

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [],
    )

    const onChange = (e:ChangeEvent<HTMLInputElement>) => {
        setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id !== e.target.id) {
                    return node
                }

                const url = e.target.value

                return {...node, data: {...node.data, url}}
            })
        )
    }

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
                data: { 
                    label: `${type} node`,
                    onChange: onChange
                },
            }

            setNodes((nds) => nds.concat(newNode))
        },
        [screenToFlowPosition],
    )

    const onSave = useCallback(() => {
        if (rfInstance) {
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

    const launchMap = () => {
        let sources = nodes.filter((x: Node) => 
            x.type == 'source' && x.data.url !== '' && getOutgoers(x, nodes, edges).length == 1
        )

        let sorted = sources.sort((b,a) => getOutgoers(a, nodes, edges)[0].position.y - getOutgoers(b, nodes, edges)[0].position.y)

        setMapLayers(sorted)
        setShowMap(true)
    }

    return (
        <div className="dndflow">
            <div style={{display: showMap ? '' : 'none', border: '1px green solid', position: 'absolute', left: '25%', top: '10%', width: '50vw', height: '80vh'}}>
                <CompiledMap mapLayers={mapLayers} setMapLayers={setMapLayers} setShowMap={setShowMap} />
            </div>
            <NodeMenu />
            <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{display : showMap ? 'none' : ''}}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onInit={setRfInstance as any}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    nodeTypes={nodeTypes}
                >
                    <Controls />
                    <Panel position="top-left">
                        <button onClick={onSave}>Save</button>
                        <button onClick={onRestore}>Restore</button>
                    </Panel>
                    <Panel position="top-right">
                        <button onClick={launchMap}>Map &gt;</button>
                    </Panel>
                </ReactFlow>
            </div>
        </div>
    )
}

export default () => (
        <ReactFlowProvider>
        <div style={{width: '50vw', height: '80vh', border: '1px solid black'}}>
            <DnDFlow />
        </div>
        </ReactFlowProvider>
)
