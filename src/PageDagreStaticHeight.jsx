import React, {useCallback, useEffect, useRef} from 'react';
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
const nodeHeight = 180;

const getCenteredElements = (nodes, edges, direction = 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Устанавливаем направление графа
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({rankdir: direction});

  // Устанавливаем узлы в граф
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {width: nodeWidth, height: nodeHeight});
  });

  // Устанавливаем связи (рёбра) в граф
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  // Применяем позиционирование из dagre
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? 'left' : 'top';
    node.sourcePosition = isHorizontal ? 'right' : 'bottom';

    // Задаём координаты узла
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
      style: {width: nodeWidth, height: nodeHeight},
    };
  });

  return {nodes: layoutedNodes, edges};
};

const nodeTypes = {NodeRedBorder: NodeRedBorder};

export const PageDagreStaticHeight = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const nodeRefs = useRef({});

  useEffect(() => {
    fetchData().then((nodesResp) => {

      const inputNodes = nodesResp.nodes.map(node => {
        return {
          ...node,
          type: 'NodeRedBorder',
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
      const {nodes: centeredNodes, edges: centeredEdges} = getCenteredElements(
          inputNodes,
          edges,
          undefined,
      );

      setNodes([...centeredNodes]);
      setEdges([...centeredEdges]);
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
        >
          <Controls/>
          <MiniMap/>
          <Background variant="dots" gap={12} size={1}/>
        </ReactFlow>


      </div>
  );
};