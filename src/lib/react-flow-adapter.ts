import type { Edge as ReactFlowEdge, Node as ReactFlowNode } from "@xyflow/react";
import type { Edge as KernelEdge, Node as KernelNode } from "viewscape-core/entities";

export interface TerrainNodeData extends Record<string, unknown> {
	kernelNode: KernelNode;
	dimmed: boolean;
}

export interface TerrainEdgeData extends Record<string, unknown> {
	kernelEdge: KernelEdge;
	dimmed: boolean;
}

export function toReactFlowNodes(
	nodes: KernelNode[],
	perspectiveId: string,
	options: {
		visibleNodeIds?: Set<string>;
		selectedNodeId?: string | null;
		highlightedNodeIds?: Set<string>;
	} = {},
): ReactFlowNode<TerrainNodeData>[] {
	const { visibleNodeIds, selectedNodeId, highlightedNodeIds } = options;

	return nodes.map((node) => {
		const pos = node.layoutByPerspective[perspectiveId];
		const isVisible = !visibleNodeIds || visibleNodeIds.has(node.id);

		const nodeType = resolveNodeType(node.type);

		return {
			id: node.id,
			type: nodeType,
			position: pos ? { x: pos.x, y: pos.y } : { x: 0, y: 0 },
			selected: node.id === selectedNodeId,
			data: {
				kernelNode: node,
				dimmed: !isVisible,
				label: node.label,
				highlighted: highlightedNodeIds?.has(node.id) ?? false,
			},
		};
	});
}

export function toReactFlowEdges(
	edges: KernelEdge[],
	options: {
		visibleEdgeIds?: Set<string>;
		selectedEdgeId?: string | null;
		highlightedEdgeIds?: Set<string>;
	} = {},
): ReactFlowEdge<TerrainEdgeData>[] {
	const { visibleEdgeIds, selectedEdgeId, highlightedEdgeIds } = options;

	return edges.map((edge) => {
		const isVisible = !visibleEdgeIds || visibleEdgeIds.has(edge.id);

		return {
			id: edge.id,
			source: edge.sourceNodeId,
			target: edge.targetNodeId,
			type: "terrain",
			selected: edge.id === selectedEdgeId,
			animated: highlightedEdgeIds?.has(edge.id) ?? false,
			data: {
				kernelEdge: edge,
				dimmed: !isVisible,
				label: edge.label ?? "",
			},
		};
	});
}

function resolveNodeType(kernelType: string): string {
	switch (kernelType) {
		case "actor":
			return "actor";
		case "service":
			return "service";
		case "system":
			return "system";
		case "screen":
			return "screen";
		default:
			return "service";
	}
}
