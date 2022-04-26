import createEngine, { 
  DefaultNodeModel,
  DiagramModel,
  DagreEngine
} from '@nosferatu500/react-diagrams';

import {
  CanvasWidget
} from '@nosferatu500/react-canvas-core';
import { useState } from 'react';
import { useEffect } from 'react';
import useFiles from '../hooks/useFiles';

const addNodes = (model, file) => {
  if (!file) return
  const name = file.url.substring(file.url.lastIndexOf('/') + 1)
  const rootNode = new DefaultNodeModel({
    name,
    color: file.isDirectory ? 'rgb(0,192,255)' : 'rgb(192, 96, 144)',
  });
  rootNode.setPosition(100, 100);
  model.addAll(rootNode)

  if (file.isDirectory) {
    const parentPort = rootNode.addOutPort('Children')
    file.children.forEach(child => {
      const childNode = addNodes(model, child)
      if (!childNode) return
      const port = childNode.addInPort('Parent')
      const link = parentPort.link(port)

      model.addAll(childNode, link)
    })
  }

  return rootNode
}

const useGraph = (root) => {
  const [graphEngine, setGraphEngine] = useState(null)

  useEffect(() => {
    if (!root) return
    // create an instance of the engine with all the defaults
    const engine = createEngine({ });
    const model = new DiagramModel();

    const dagreEngine = new DagreEngine({
			graph: {
        rankdir: 'LR',
				ranker: 'tight-tree',
				marginx: 200,
				marginy: 25,
        edgesep: 50,
        nodesep: 60,
        ranksep: 200,
			},
			// includeLinks: true
		});

    addNodes(model, root)
    dagreEngine.redistribute(model)

    engine.setModel(model);
    setGraphEngine(engine)
  }, [])

  return graphEngine
} 



export const Graph = () => {

  const { files: root } = useFiles()

  const graph = useGraph(root)

  console.log(root)

  return (
    graph && <CanvasWidget className="diagram-container" engine={graph}/>
  )
}