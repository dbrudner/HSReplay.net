import * as React from "react";
import { toTitleCase, winrateData } from "../helpers";

export interface ArchetypeData {
	name: string;
	winrate: number;
};

interface ClassMatchupProps extends React.ClassAttributes<ClassMatchup> {
	playerClass: string;
	totalWinrate: number;
	archetypes: ArchetypeData[];
}

export default class ClassMatchup extends React.Component<ClassMatchupProps, void> {
	render(): JSX.Element {
		const archetypes = this.props.archetypes.map((archetype) => (
			<div className="class-matchup-archetype">
				<span>{archetype.name}</span>
				{this.winrate(archetype.winrate)}
			</div>
		));

		return (
			<div className="class-matchup col-xs-12 col-sm-12 col-md-6 col-lg-4">
				<div className="class-matchup-header">
					<span className={"player-class " + this.props.playerClass.toLowerCase()}>
							{toTitleCase(this.props.playerClass)}
					</span>
					<span className="pull-right">{this.props.totalWinrate.toFixed(2)}%</span>
				</div>
				{archetypes}
			</div>
		);
	}

	winrate(winrate: number) {
		const wrData =  winrateData(this.props.totalWinrate, winrate, 5);
		return (
			<span className="winrate-cell pull-right" style={{color: wrData.color}}>
				{wrData.tendencyStr}
				{winrate.toFixed(2) + "%"}
			</span>
		);
	}
}
