/**
 * Temporary development data bridge.
 *
 * Imports seed data directly from viewscape-core source via @seed alias.
 * This will be replaced by a real ContentRepoAdapter when the backend is added.
 * Do not treat this as a long-term content loading contract.
 */

import {
	annotations,
	capabilities,
	domains,
	edges,
	evidenceRefs,
	journeys,
	layers,
	nodes,
	perspectives,
	scenes,
	steps,
} from "@seed/seed-banking.js";
import { createGraph } from "viewscape-core/graph";

export const seedGraph = createGraph(nodes, edges);
export const seedDomains = domains;
export const seedCapabilities = capabilities;
export const seedNodes = nodes;
export const seedEdges = edges;
export const seedJourneys = journeys;
export const seedSteps = steps;
export const seedPerspectives = perspectives;
export const seedLayers = layers;
export const seedScenes = scenes;
export const seedAnnotations = annotations;
export const seedEvidenceRefs = evidenceRefs;
