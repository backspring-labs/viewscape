import { seedJourneys } from "@/store/seed-loader.js";
import type { Capability } from "viewscape-core/entities";
import type { TerrainGraph } from "viewscape-core/graph";
import { getNode } from "viewscape-core/graph";

interface CapabilityDetailPanelProps {
	capability: Capability;
	graph: TerrainGraph;
	onSelectNode: (nodeId: string) => void;
	onSelectJourney: (journeyId: string) => void;
}

export function CapabilityDetailPanel({
	capability,
	graph,
	onSelectNode,
	onSelectJourney,
}: CapabilityDetailPanelProps) {
	const referencedNodes = capability.nodeIds
		.map((id) => getNode(graph, id))
		.filter((n) => n != null);

	const availableJourneys = seedJourneys.filter((j) => capability.journeyIds.includes(j.id));

	return (
		<div className="detail-panel">
			<div className="detail-panel__header">
				<span className="detail-panel__type-badge" data-type="capability">
					capability
				</span>
				<h3 className="detail-panel__title">{capability.label}</h3>
			</div>

			{capability.description && (
				<p className="detail-panel__description">{capability.description}</p>
			)}

			{capability.tags.length > 0 && (
				<div className="detail-panel__tags">
					{capability.tags.map((tag) => (
						<span key={tag} className="detail-panel__tag">
							{tag}
						</span>
					))}
				</div>
			)}

			{referencedNodes.length > 0 && (
				<div className="detail-panel__section">
					<h4 className="detail-panel__section-title">Referenced Nodes</h4>
					<ul className="detail-panel__list">
						{referencedNodes.map((n) => (
							<li key={n.id}>
								<button
									type="button"
									className="detail-panel__link"
									onClick={() => onSelectNode(n.id)}
								>
									{n.label}
									<span className="detail-panel__link-type">{n.type}</span>
								</button>
							</li>
						))}
					</ul>
				</div>
			)}

			{availableJourneys.length > 0 && (
				<div className="detail-panel__section">
					<h4 className="detail-panel__section-title">Journeys</h4>
					<ul className="detail-panel__list">
						{availableJourneys.map((j) => (
							<li key={j.id}>
								<button
									type="button"
									className="detail-panel__link detail-panel__link--journey"
									onClick={() => onSelectJourney(j.id)}
								>
									{j.label}
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
