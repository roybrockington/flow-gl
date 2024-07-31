import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'

export default memo(({ data, isConnectable }) => {

    return (

        <>
            <div style={{display: 'flex', flexDirection: 'column', borderRadius: 10, padding: 20, border: '1px solid black', minHeight: 60}}>
                Source
                <input
                    className="nodrag"
                    type="text"
                    onChange={data.onChange}
                    defaultValue={data.url}
                    style={{maxWidth: 50}}
                />
            </div>
            <Handle
                type="source"
                position={Position.Right}
                id="a"
                isConnectable={isConnectable}
            />
        </>
    );
});



