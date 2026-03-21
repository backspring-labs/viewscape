import { edgeTypes } from "@/components/canvas/edges/edge-types.js";
import { nodeTypes } from "@/components/canvas/nodes/node-types.js";
import { Breadcrumb } from "@/components/navigation/Breadcrumb.js";
import { useInitializeContext, useNavigation } from "@/hooks/use-context-machine.js";
import { usePerspectiveProvider } from "@/hooks/use-perspective-provider.js";
import { seedSteps } from "@/store/seed-loader.js";
import { useUIStore } from "@/store/ui-store.js";
import {
	Background,
	BackgroundVariant,
	Controls,
	MiniMap,
	ReactFlow,
	useEdgesState,
	useNodesState,
} from "@xyflow/react";
import { useEffect } from "react";
import { LeftPanel } from "./LeftPanel.js";
import { RightPanel } from "./RightPanel.js";
import { TopBar } from "./TopBar.js";

export function AppShell() {
	useInitializeContext();
	const { nav, graph, isReady, send } = useNavigation();
	const { rfNodes, rfEdges } = usePerspectiveProvider(nav, graph);
	const setRightPanelOpen = useUIStore((s) => s.setRightPanelOpen);

	const [nodes, setNodes, onNodesChange] = useNodesState(rfNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(rfEdges);

	// Sync projected nodes/edges into React Flow state when they change
	useEffect(() => {
		setNodes(rfNodes);
	}, [rfNodes, setNodes]);

	useEffect(() => {
		setEdges(rfEdges);
	}, [rfEdges, setEdges]);

	// Auto-open right panel on selection, auto-close on clear
	useEffect(() => {
		const hasSelection = nav.selectedNodeId != null || nav.selectedEdgeId != null;
		setRightPanelOpen(hasSelection);
	}, [nav.selectedNodeId, nav.selectedEdgeId, setRightPanelOpen]);

	if (!isReady) {
		return <div className="app-shell__loading">Loading...</div>;
	}

	const journeySteps = nav.activeJourneyId
		? seedSteps.filter((s) => s.journeyId === nav.activeJourneyId)
		: [];

	return (
		<div className="app-shell">
			<TopBar
				activePerspectiveId={nav.activePerspectiveId}
				onSwitchPerspective={(id) => send({ type: "SWITCH_PERSPECTIVE", perspectiveId: id })}
			/>
			<Breadcrumb
				activeDomainId={nav.activeDomainId}
				activeCapabilityId={nav.activeCapabilityId}
				activeJourneyId={nav.activeJourneyId}
				activeStepIndex={nav.activeStepIndex}
				totalSteps={journeySteps.length}
				onClearDomain={() => send({ type: "CLEAR_DOMAIN" })}
				onClearCapability={() => send({ type: "CLEAR_CAPABILITY" })}
			/>
			<div className="app-shell__body">
				<LeftPanel
					activeDomainId={nav.activeDomainId}
					activeCapabilityId={nav.activeCapabilityId}
					onSelectDomain={(id) => send({ type: "SELECT_DOMAIN", domainId: id })}
					onSelectCapability={(id) => send({ type: "SELECT_CAPABILITY", capabilityId: id })}
					onClearDomain={() => send({ type: "CLEAR_DOMAIN" })}
				/>
				<div className="app-shell__canvas">
					<ReactFlow
						nodes={nodes}
						edges={edges}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						nodeTypes={nodeTypes}
						edgeTypes={edgeTypes}
						onNodeClick={(_, node) => send({ type: "SELECT_NODE", nodeId: node.id })}
						onEdgeClick={(_, edge) => send({ type: "SELECT_EDGE", edgeId: edge.id })}
						onPaneClick={() => {
							send({ type: "CLEAR_SELECTION" });
						}}
						fitView
						panOnScroll
						minZoom={0.3}
						maxZoom={2}
						proOptions={{ hideAttribution: false }}
					>
						<Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#334155" />
						<Controls position="bottom-left" />
						<MiniMap
							position="bottom-right"
							pannable
							zoomable
							nodeColor={(n) => {
								const data = n.data as Record<string, unknown> | undefined;
								const dimmed = data?.dimmed === true;
								const highlighted = data?.highlighted === true;

								if (dimmed) return "#334155";
								if (highlighted) return "#f59e0b";

								const type = n.type ?? "service";
								const colors: Record<string, string> = {
									actor: "#3b82f6",
									service: "#10b981",
									system: "#8b5cf6",
									screen: "#f59e0b",
								};
								return colors[type] ?? "#64748b";
							}}
							style={{ background: "#1e293b" }}
						/>
					</ReactFlow>
				</div>
				{graph && (
					<RightPanel
						nav={nav}
						graph={graph}
						onSelectNode={(id) => send({ type: "SELECT_NODE", nodeId: id })}
						onSelectEdge={(id) => send({ type: "SELECT_EDGE", edgeId: id })}
						onSelectCapability={(id) => send({ type: "SELECT_CAPABILITY", capabilityId: id })}
						onSelectJourney={(id) => send({ type: "SELECT_JOURNEY", journeyId: id })}
					/>
				)}
			</div>
		</div>
	);
}
