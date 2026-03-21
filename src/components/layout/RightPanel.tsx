import { DetailPanelRouter } from "@/components/detail/DetailPanelRouter.js";
import { useUIStore } from "@/store/ui-store.js";
import type { NavigationContext } from "viewscape-core/context";
import type { TerrainGraph } from "viewscape-core/graph";

interface RightPanelProps {
	nav: NavigationContext;
	graph: TerrainGraph;
	onSelectNode: (nodeId: string) => void;
	onSelectEdge: (edgeId: string) => void;
	onSelectCapability: (capabilityId: string) => void;
	onSelectJourney: (journeyId: string) => void;
}

export function RightPanel({
	nav,
	graph,
	onSelectNode,
	onSelectEdge,
	onSelectCapability,
	onSelectJourney,
}: RightPanelProps) {
	const { rightPanelOpen, toggleRightPanel } = useUIStore();

	return (
		<div className={`right-panel ${rightPanelOpen ? "right-panel--open" : "right-panel--closed"}`}>
			<button type="button" className="right-panel__toggle" onClick={toggleRightPanel}>
				{rightPanelOpen ? "\u25B6" : "\u25C0"}
			</button>
			{rightPanelOpen && (
				<div className="right-panel__content">
					<DetailPanelRouter
						nav={nav}
						graph={graph}
						onSelectNode={onSelectNode}
						onSelectEdge={onSelectEdge}
						onSelectCapability={onSelectCapability}
						onSelectJourney={onSelectJourney}
					/>
				</div>
			)}
		</div>
	);
}
