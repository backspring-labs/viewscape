import { seedCapabilities, seedDomains } from "@/store/seed-loader.js";
import type { NavigationContext } from "viewscape-core/context";
import type { TerrainGraph } from "viewscape-core/graph";
import { getEdge, getNode } from "viewscape-core/graph";
import { CapabilityDetailPanel } from "./CapabilityDetailPanel.js";
import { DomainDetailPanel } from "./DomainDetailPanel.js";
import { EdgeDetailPanel } from "./EdgeDetailPanel.js";
import { NodeDetailPanel } from "./NodeDetailPanel.js";

interface DetailPanelRouterProps {
	nav: NavigationContext;
	graph: TerrainGraph;
	onSelectNode: (nodeId: string) => void;
	onSelectEdge: (edgeId: string) => void;
	onSelectCapability: (capabilityId: string) => void;
	onSelectJourney: (journeyId: string) => void;
}

/**
 * Routes the right panel to the appropriate detail component.
 *
 * Priority order (binding product rule):
 * 1. Selected node → NodeDetailPanel
 * 2. Selected edge → EdgeDetailPanel
 * 3. Active capability → CapabilityDetailPanel
 * 4. Active domain → DomainDetailPanel
 * 5. Nothing → empty state
 */
export function DetailPanelRouter({
	nav,
	graph,
	onSelectNode,
	onSelectEdge,
	onSelectCapability,
	onSelectJourney,
}: DetailPanelRouterProps) {
	// 1. Selected node
	if (nav.selectedNodeId) {
		const node = getNode(graph, nav.selectedNodeId);
		if (node) {
			return (
				<NodeDetailPanel
					node={node}
					graph={graph}
					onSelectNode={onSelectNode}
					onSelectEdge={onSelectEdge}
				/>
			);
		}
	}

	// 2. Selected edge
	if (nav.selectedEdgeId) {
		const edge = getEdge(graph, nav.selectedEdgeId);
		if (edge) {
			return <EdgeDetailPanel edge={edge} graph={graph} onSelectNode={onSelectNode} />;
		}
	}

	// 3. Active capability
	if (nav.activeCapabilityId) {
		const capability = seedCapabilities.find((c) => c.id === nav.activeCapabilityId);
		if (capability) {
			return (
				<CapabilityDetailPanel
					capability={capability}
					graph={graph}
					onSelectNode={onSelectNode}
					onSelectJourney={onSelectJourney}
				/>
			);
		}
	}

	// 4. Active domain
	if (nav.activeDomainId) {
		const domain = seedDomains.find((d) => d.id === nav.activeDomainId);
		if (domain) {
			return <DomainDetailPanel domain={domain} onSelectCapability={onSelectCapability} />;
		}
	}

	// 5. Empty state
	return (
		<div className="detail-panel detail-panel--empty">
			<p className="detail-panel__empty-text">
				Select a domain, capability, or node to see details.
			</p>
		</div>
	);
}
