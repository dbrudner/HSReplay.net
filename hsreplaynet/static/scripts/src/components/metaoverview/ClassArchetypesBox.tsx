import React from "react";
import { ApiArchetypePopularity, SortableProps } from "../../interfaces";
import CardData from "../../CardData";
import { getHeroClassName } from "../../helpers";
import ArchetypeClassTable from "./ArchetypeClassTable";
import { Archetype } from "../../utils/api";

interface Props extends SortableProps {
	data: ApiArchetypePopularity[];
	archetypeData: Archetype[];
	playerClass: string;
	cardData: CardData;
	gameType: string;
	totalPopularity?: boolean;
}

export default class ClassArchetypesBox extends React.Component<Props> {
	public render(): React.ReactNode {
		const { playerClass } = this.props;
		return (
			<div className="box class-box">
				<div className="box-title">
					<span
						className={`player-class ${playerClass.toLowerCase()}`}
					>
						{getHeroClassName(playerClass)}
					</span>
				</div>
				<div className="box-content">
					<ArchetypeClassTable
						data={this.props.data}
						archetypeData={this.props.archetypeData}
						onSortChanged={this.props.onSortChanged}
						sortBy={this.props.sortBy}
						sortDirection={this.props.sortDirection}
						gameType={this.props.gameType}
						cardData={this.props.cardData}
						playerClass={playerClass}
						totalPopularity={this.props.totalPopularity}
					/>
				</div>
			</div>
		);
	}
}
