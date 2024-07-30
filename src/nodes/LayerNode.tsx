import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'

export default memo(({ data, isConnectable }) => {
  return (
    <>
      <div style={{borderRadius: 10, padding: 20, border: '1px solid black', minHeight: 60}}>
       Layer 
      </div>
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        isConnectable={isConnectable}
      />
    </>
  );
});



