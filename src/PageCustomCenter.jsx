import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge
} from '@xyflow/react';
import dagre from '@dagrejs/dagre';
import {fetchData} from './api.js';
import {NodeRedBorder} from './NodeRedBorder.jsx';

const nodeWidth = 200;
const getCenteredElements = (nodes, edges, direction = 'LR', nodeDimensions) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  // Устанавливаем узлы в граф с динамическими размерами
  nodes.forEach((node) => {
    const { width, height } = nodeDimensions[node.id] || { width: nodeWidth, height: 36 };
    dagreGraph.setNode(node.id, { width, height });
  });

  // Устанавливаем рёбра (связи) в граф
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  // Применяем позиционирование из dagre
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? 'left' : 'top';
    node.sourcePosition = isHorizontal ? 'right' : 'bottom';

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - (nodeDimensions[node.id]?.width || nodeWidth) / 2,
        y: nodeWithPosition.y - (nodeDimensions[node.id]?.height || 36) / 2,
      },
      style: { width: nodeDimensions[node.id]?.width || nodeWidth },
    };
  });

  return { nodes: layoutedNodes, edges };
};

const nodeTypes = {NodeRedBorder: NodeRedBorder};

export const PageDagreDynamicHeight = ()=> {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeDimensions, setNodeDimensions] = useState({});
  const nodeRefs = useRef({});

  useEffect(() => {
    // После монтирования всех узлов получаем их размеры и сохраняем их в состоянии
    const newNodeDimensions = {};
    nodes.forEach((node) => {
      const nodeElement = nodeRefs.current[node.id];
      if (nodeElement) {
        newNodeDimensions[node.id] = {
          width: nodeElement.offsetWidth || nodeWidth,
          height: nodeElement.offsetHeight || 36,
        };
      }
    });
    setNodeDimensions(newNodeDimensions);
  }, [nodes]);

  useEffect(() => {
    fetchData().then((nodesResp) => {
      const inputNodes = nodesResp.nodes.map(node => {
        return {
          ...node,
          type: 'NodeRedBorder',
          position: {
            x: (node.pathPoint.charCodeAt(0) - 65) * 300,
            y: (node.index * 200),
            //y: (node.position * 200),
          },
          data: {
            label: node.mainTask.goal,
            id: node.id,
            index: node.index,
            position: node.position,
            pathPoint: node.pathPoint,
            mainTask: node.mainTask,
            ref: (el) => (nodeRefs.current[node.id] = el),
          },
        };
      });
      const edges = nodesResp.connections;
      const {nodes: layoutedNodes, edges: layoutedEdges} = getCenteredElements(
          inputNodes,
          edges,
          undefined,
          nodeDimensions
      );

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
      //setNodes([...inputNodes]);
      //setEdges([...edges]);
    });

  }, [setEdges, setNodes]);

  const onConnect = useCallback(
      (params) => setEdges((eds) => addEdge(params, eds)),
      [setEdges],
  );

  return (
      <div style={{width: '100vw', height: '100vh'}}>
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            //fitView
            //viewport={{x: 100, y: 100, zoom: 0.8}}
            //panOnDrag={true}
        >
          <Controls/>
          <MiniMap/>
          <Background variant="dots" gap={12} size={1}/>
        </ReactFlow>


      </div>
  );
}