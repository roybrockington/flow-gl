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
    getIncomers,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import NodeMenu from './components/NodeMenu'
import './index.css'
import Source from './nodes/SourceNode'
import Layer from './nodes/LayerNode'
import CompiledMap from './components/Map'

const nodeTypes = {
    source: Source,
    layer: Layer
}

export type GeoJson = {
    id: string
    url: string
    order: number
}

const flowKey = 'assignment'

let id = 0
const getId = () => `dndnode_${id++}`

const DnDFlow = () => {
    const reactFlowWrapper = useRef(null)
    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])
    const { screenToFlowPosition, setViewport } = useReactFlow()
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null)
    const [showMap, setShowMap] = useState(false)
    const [mapLayers, setMapLayers] = useState<GeoJson[] | null>([])

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [],
    )

    const onChange = (e: React.SyntheticEvent<HTMLFormElement>, id: string) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id == id) {
            return node
          }

          const url = e.target.value;

          return {
            ...node,
            data: {
              ...node.data,
              url,
            },
          }
        }),
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
            console.log(type)

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

    const toggleMap = () => {
        let layerNodes = nodes.filter((x: Node) => x.type == 'layer')
        layerNodes.forEach(layer => {
            const source = (getIncomers(layer, nodes, edges))
            if(source[0]?.data?.url) {
                setMapLayers([
                    ...mapLayers,
                    {
                        id: source[0].id,
                        url: source[0].data.url,
                        order: source[0].position.y
                    }
                ])
            }
        })
        setShowMap(true)
    }


    return (
        <div className="dndflow">
            <div style={{display: showMap ? '' : 'none', border: '1px green solid', position: 'absolute', left: '25%', top: '10%', width: '50vw', height: '80vh'}}>
                <CompiledMap mapLayers={mapLayers} showMap={showMap} setShowMap={setShowMap} />
            </div>
            <NodeMenu />
            <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{display : showMap ? 'none' : ''}}>
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
                        <button onClick={toggleMap}>Map &gt;</button>
                    </Panel>
                </ReactFlow>
            </div>
        </div>
    )
}

export default () => (
        <div style={{width: '50vw', height: '80vh', border: '1px solid black'}}>
            <ReactFlowProvider>
                <DnDFlow />
            </ReactFlowProvider>
        </div>
)
