import {CopyToClipboard} from './CopyToClipboard.jsx';
import {Handle, Position} from '@xyflow/react';
import React from 'react';

export const NodeRedBorder = ({data}) => (<>
  <div style={{
    position: 'relative',
    paddingTop: 16,
    paddingLeft: 4,
    paddingRight: 4,
    paddingBottom: 8,
    border: '1px solid tomato',
    maxWidth: 200,
    height: '100%',
    fontSize: '12px',
  }}>
    <div style={{
      position: 'absolute',
      top: 0,
      fontSize: 8,
      width: 200,
    }}>
      <CopyToClipboard text={data.id}/></div>
    {data.mainTask.image &&
        <div>
          <img style={{width: '100%', objectFit: 'cover', height: 100}}
               src={'http://127.0.0.1:3000' + data.mainTask.image} alt=""/>
        </div>
    }
    <div>
      index: {data.index} | position: {data.position} | point: {data.pathPoint}
      <br/>
      <strong>{data.label}</strong>
    </div>
  </div>

  <Handle type="target" position={Position.Left}/>
  <Handle type="source" position={Position.Right}/>
</>);
