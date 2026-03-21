import type { Edge as KernelEdge, Node as KernelNode } from "viewscape-core/entities";
import { describe, expect, it } from "vitest";
import { toReactFlowEdges, toReactFlowNodes } from "./react-flow-adapter.js";

const testNodes: KernelNode[] = [
	{
		id: "n-1",
		type: "service",
		label: "Service A",
		tags: [],
		metadata: {},
		layoutByPerspective: {
			"persp-overview": { x: 100, y: 200 },
			"persp-architecture": { x: 300, y: 400 },
		},
	},
	{
		id: "n-2",
		type: "actor",
		label: "Customer",
		tags: [],
		metadata: {},
		layoutByPerspective: {
			"persp-overview": { x: 0, y: 50 },
		},
	},
];

const testEdges: KernelEdge[] = [
	{
		id: "e-1",
		sourceNodeId: "n-1",
		targetNodeId: "n-2",
		type: "service_call",
		label: "calls",
		directed: true,
		metadata: {},
	},
];

describe("toReactFlowNodes", () => {
	it("maps positions from layoutByPerspective", () => {
		const result = toReactFlowNodes(testNodes, "persp-overview");
		expect(result[0]?.position).toEqual({ x: 100, y: 200 });
		expect(result[1]?.position).toEqual({ x: 0, y: 50 });
	});

	it("uses different positions for different perspectives", () => {
		const result = toReactFlowNodes(testNodes, "persp-architecture");
		expect(result[0]?.position).toEqual({ x: 300, y: 400 });
	});

	it("falls back to { x: 0, y: 0 } for missing perspective", () => {
		const result = toReactFlowNodes(testNodes, "persp-nonexistent");
		expect(result[0]?.position).toEqual({ x: 0, y: 0 });
	});

	it("sets correct node type from kernel type", () => {
		const result = toReactFlowNodes(testNodes, "persp-overview");
		expect(result[0]?.type).toBe("service");
		expect(result[1]?.type).toBe("actor");
	});

	it("passes kernel node in data", () => {
		const result = toReactFlowNodes(testNodes, "persp-overview");
		expect(result[0]?.data.kernelNode.label).toBe("Service A");
	});

	it("marks nodes as dimmed when not in visibleNodeIds", () => {
		const visible = new Set(["n-1"]);
		const result = toReactFlowNodes(testNodes, "persp-overview", { visibleNodeIds: visible });
		expect(result[0]?.data.dimmed).toBe(false);
		expect(result[1]?.data.dimmed).toBe(true);
	});

	it("marks node as selected when matching selectedNodeId", () => {
		const result = toReactFlowNodes(testNodes, "persp-overview", { selectedNodeId: "n-2" });
		expect(result[0]?.selected).toBe(false);
		expect(result[1]?.selected).toBe(true);
	});

	it("marks node as highlighted when in highlightedNodeIds", () => {
		const highlighted = new Set(["n-1"]);
		const result = toReactFlowNodes(testNodes, "persp-overview", {
			highlightedNodeIds: highlighted,
		});
		expect(result[0]?.data.highlighted).toBe(true);
		expect(result[1]?.data.highlighted).toBe(false);
	});

	it("all nodes visible when visibleNodeIds not provided", () => {
		const result = toReactFlowNodes(testNodes, "persp-overview");
		expect(result[0]?.data.dimmed).toBe(false);
		expect(result[1]?.data.dimmed).toBe(false);
	});
});

describe("toReactFlowEdges", () => {
	it("maps sourceNodeId/targetNodeId to source/target", () => {
		const result = toReactFlowEdges(testEdges);
		expect(result[0]?.source).toBe("n-1");
		expect(result[0]?.target).toBe("n-2");
	});

	it("sets type to terrain", () => {
		const result = toReactFlowEdges(testEdges);
		expect(result[0]?.type).toBe("terrain");
	});

	it("passes kernel edge in data", () => {
		const result = toReactFlowEdges(testEdges);
		expect(result[0]?.data?.kernelEdge.label).toBe("calls");
	});

	it("marks edges as dimmed when not in visibleEdgeIds", () => {
		const visible = new Set<string>();
		const result = toReactFlowEdges(testEdges, { visibleEdgeIds: visible });
		expect(result[0]?.data?.dimmed).toBe(true);
	});

	it("sets animated for highlighted edges", () => {
		const highlighted = new Set(["e-1"]);
		const result = toReactFlowEdges(testEdges, { highlightedEdgeIds: highlighted });
		expect(result[0]?.animated).toBe(true);
	});
});
