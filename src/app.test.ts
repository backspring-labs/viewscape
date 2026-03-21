import type { Node } from "viewscape-core/entities";
import { createGraph } from "viewscape-core/graph";
import { describe, expect, it } from "vitest";

describe("Viewscape", () => {
	it("viewscape-core is linked and exports work", () => {
		const testNode: Node = {
			id: "test-1",
			type: "service",
			label: "Test Service",
			tags: [],
			metadata: {},
			layoutByPerspective: {},
		};
		const graph = createGraph([testNode], []);
		expect(graph.nodes.size).toBe(1);
	});
});
