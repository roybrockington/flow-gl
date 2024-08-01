const NodeMenu = () => {
  const onDragStart = (e: React.DragEvent<HTMLDivElement>, nodeType: "source" | "layer" | "intersection") => {
    e.dataTransfer.setData('application/reactflow', nodeType)
    e.dataTransfer.effectAllowed = 'move'
  }

    return (
        <aside style={{display:'flex', flexDirection:'column', gap: 8, alignItems: 'center'}}>
            <div onDragStart={(event) => onDragStart(event, 'source')} draggable style={{borderRadius: 10, padding: 20, border: '1px solid black', minHeight: 60, maxWidth: 60, display:'flex', flexDirection: 'column', gap:10}}> 
                <div>
                    Source
                </div>
                <input
                    type="text"
                    style={{maxWidth: 50}}
                />
            </div>
            <div onDragStart={(event) => onDragStart(event, 'layer')} draggable style={{borderRadius: 10, padding: 20, border: '1px solid black', minHeight: 60, minWidth: 60}}>
                <div>
                   Layer
                </div>
            </div>
        </aside>
    )
}


export default NodeMenu
