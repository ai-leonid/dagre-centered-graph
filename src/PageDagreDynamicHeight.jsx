import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import dagre from '@dagrejs/dagre';
import {fetchData} from './api.js';
import {NodeRedBorder} from './NodeRedBorder.jsx';

const nodeWidth = 200;
const nodeHeight = 36;

const getCenteredElements = (nodes, edges, direction = 'LR', nodeDimensions) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    const { width, height } = nodeDimensions[node.id] || { width: nodeWidth, height: nodeHeight };
    dagreGraph.setNode(node.id, { width, height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const centeredNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? 'left' : 'top';
    node.sourcePosition = isHorizontal ? 'right' : 'bottom';

    return {
      ...node,
      position: nodeWithPosition
        ? {
            x: nodeWithPosition.x - (nodeDimensions[node.id]?.width || nodeWidth) / 2,
            y: nodeWithPosition.y - (nodeDimensions[node.id]?.height || nodeHeight) / 2,
          }
        : { x: 0, y: 0 },
      style: { width: nodeDimensions[node.id]?.width || nodeWidth },
    };
  });

  return { nodes: centeredNodes, edges };
};

const nodeTypes = {
  NodeRedBorder: ({ data }) => (
    <div ref={data.ref}>
      <NodeRedBorder data={data} />
    </div>
  ),
};

export const PageDagreDynamicHeight = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeDimensions, setNodeDimensions] = useState({});
  const nodeRefs = useRef({});
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isLayoutInitialized, setIsLayoutInitialized] = useState(false);

  useEffect(() => {
    fetchData().then((nodesResp) => {
      const inputNodes = nodesResp.nodes.map((node) => ({
        ...node,
        type: 'NodeRedBorder',
        data: {
          label: node.mainTask.goal,
          id: node.id,
          index: node.index,
          pathPoint: node.pathPoint,
          mainTask: node.mainTask,
          ref: (el) => (nodeRefs.current[node.id] = el),
        },
      }));
      setNodes(inputNodes);
      setEdges(nodesResp.connections);
      setIsDataFetched(true);
    });
  }, [setEdges, setNodes]);

  useLayoutEffect(() => {
    if (!isDataFetched) return;

    const newNodeDimensions = {};
    nodes.forEach((node) => {
      const nodeElement = nodeRefs.current[node.id];
      if (nodeElement) {
        newNodeDimensions[node.id] = {
          width: nodeElement.offsetWidth || nodeWidth,
          height: nodeElement.offsetHeight || nodeHeight,
        };
      }
    });
    setNodeDimensions(newNodeDimensions);
    setIsLayoutInitialized(true);
  }, [nodes, edges, isDataFetched]);

  useEffect(() => {
    const hasAllDimensions = nodes.every((node) => nodeDimensions[node.id]);
    if (!hasAllDimensions) {
      return;
    }

    const { nodes: centeredNodes, edges: centeredEdges } = getCenteredElements(
      nodes,
      edges,
      'LR',
      nodeDimensions,
    );

    if (centeredNodes.length > 0) {
      setNodes(centeredNodes.map(node => ({
        ...node,
        position: node.position || { x: 0, y: 0 }
      })));
      setEdges(centeredEdges);
    }
  }, [nodeDimensions, edges, isLayoutInitialized]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            ref: (el) => (nodeRefs.current[node.id] = el),
          },
          position: node.position || { x: 0, y: 0 } // Защита от undefined
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};
