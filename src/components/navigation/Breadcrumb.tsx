import { seedCapabilities, seedDomains, seedJourneys } from "@/store/seed-loader.js";

interface BreadcrumbProps {
	activeDomainId: string | null;
	activeCapabilityId: string | null;
	activeJourneyId: string | null;
	activeStepIndex: number | null;
	totalSteps: number;
	onClearDomain: () => void;
	onClearCapability: () => void;
}

export function Breadcrumb({
	activeDomainId,
	activeCapabilityId,
	activeJourneyId,
	activeStepIndex,
	totalSteps,
	onClearDomain,
	onClearCapability,
}: BreadcrumbProps) {
	const domain = activeDomainId ? seedDomains.find((d) => d.id === activeDomainId) : null;
	const capability = activeCapabilityId
		? seedCapabilities.find((c) => c.id === activeCapabilityId)
		: null;
	const journey = activeJourneyId ? seedJourneys.find((j) => j.id === activeJourneyId) : null;

	return (
		<div className="breadcrumb">
			<button type="button" className="breadcrumb__segment" onClick={onClearDomain}>
				All Domains
			</button>
			{domain && (
				<>
					<span className="breadcrumb__separator">&rsaquo;</span>
					<button type="button" className="breadcrumb__segment" onClick={onClearCapability}>
						{domain.label}
					</button>
				</>
			)}
			{capability && (
				<>
					<span className="breadcrumb__separator">&rsaquo;</span>
					<span className="breadcrumb__segment breadcrumb__segment--current">
						{capability.label}
					</span>
				</>
			)}
			{journey && (
				<>
					<span className="breadcrumb__separator">&rsaquo;</span>
					<span className="breadcrumb__segment breadcrumb__segment--journey">
						{journey.label}
						{activeStepIndex != null && (
							<span className="breadcrumb__step-count">
								{" "}
								(Step {activeStepIndex + 1}/{totalSteps})
							</span>
						)}
					</span>
				</>
			)}
		</div>
	);
}
