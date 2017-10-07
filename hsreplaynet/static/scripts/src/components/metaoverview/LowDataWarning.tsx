import * as React from "react";

interface LowDataWarningProps extends React.ClassAttributes<LowDataWarning> {
	date: Date;
	numArchetypes: number;
}

const MIN_ARCHETYPES_THRESHHOLD = 6;
const SEVERE_MIN_ARCHETYPES_THRESHHOLD = 3;
const SEASON_AGE_THRESHOLD = 7;

export default class LowDataWarning extends React.Component<LowDataWarningProps, {}> {
	render(): JSX.Element {
		if (this.props.numArchetypes >= MIN_ARCHETYPES_THRESHHOLD) {
			return null;
		}
		const message = this.props.date.getDate() < SEASON_AGE_THRESHOLD
			? "Too few contributors at this rank(s) at this point in the season for reliable statistics."
			: "Too few contributors at this rank(s) for reliable statistics.";

		const classNames = ["low-data-warning"];
		const belowThredhold = this.props.numArchetypes < SEVERE_MIN_ARCHETYPES_THRESHHOLD;
		if (belowThredhold) {
			classNames.push("severe");
		}
		const glyphicon = belowThredhold ? "warning-sign" : "info-sign";
		return (
			<div className={classNames.join(" ")}>
				<span className={"glyphicon glyphicon-" + glyphicon}/>
				<strong>&nbsp;Low Data:&nbsp;</strong>
				{message}
			</div>
		);
	}
}