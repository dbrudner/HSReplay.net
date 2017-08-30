import * as React from "react";
import * as _ from "lodash";
import AdminDeckInfo from "../components/archetypeanalysis/AdminDeckInfo";
import CardData from "../CardData";
import ClassFilter, {FilterOption} from "../components/ClassFilter";
import ClassAnalysis, {ClusterMetaData} from "../components/archetypeanalysis/ClassAnalysis";
import DataInjector from "../components/DataInjector";
import DataManager from "../DataManager";
import InfoboxFilter from "../components/InfoboxFilter";
import InfoboxFilterGroup from "../components/InfoboxFilterGroup";
import UserData from "../UserData";

interface ArchetypeAnalysisProps extends React.ClassAttributes<ArchetypeAnalysis> {
	cardData: CardData;
	format?: string;
	setFormat?: (format: string) => void;
	setPlayerClass?: (tab: string) => void;
	playerClass?: string;
}

interface ArchetypeAnalysisState {
	deck: ClusterMetaData;
}

export default class ArchetypeAnalysis extends React.Component<ArchetypeAnalysisProps, ArchetypeAnalysisState> {
	constructor(props: ArchetypeAnalysisProps, state: ArchetypeAnalysisState) {
		super(props, state);
		this.state = {
			deck: null,
		};
	}

	render(): JSX.Element {
		const {cardData, format, playerClass} = this.props;
		let adminControls = null;
		if (UserData.isStaff()) {
			adminControls = [
				<InfoboxFilterGroup
					key="format-filter"
					header="Format"
					selectedValue={format}
					onClick={(value) => this.props.setFormat(value)}
					collapsible={true}
					collapsed={true}
				>
					<InfoboxFilter value="FT_STANDARD">Standard</InfoboxFilter>
					<InfoboxFilter value="FT_WILD">Wild</InfoboxFilter>
				</InfoboxFilterGroup>,
				<h2 key="admin-header">Admin</h2>,
				<ul key="admin-controls">
					<li>
						<span>Refresh Data</span>
						<span className="infobox-value">
							<a
								href="#"
								onClick={(e) => {
									e.preventDefault();
									DataManager.get(`/analytics/clustering/refresh/${this.props.format}`, {}, true).then(() => {
										window.alert("Okay");
									});
								}}
							>
								Refresh
							</a>
						</span>
					</li>
				</ul>,
			];
			const {deck} = this.state;
			if (deck !== null) {
				adminControls.push(
					<DataInjector
						key="admin-info"
						query={{url: `/api/v1/decks/${deck.shortid}/`, params: {}}}
					>
						<AdminDeckInfo playerClass={playerClass}/>
					</DataInjector>,
				);
			}
		}

		return (
			<div className="archetype-analysis-container">
				<aside className="infobox">
					<h1>Archetype Analysis</h1>
					<h2>Class</h2>
					<ClassFilter
						minimal={true}
						filters="ClassesOnly"
						selectedClasses={[playerClass as FilterOption]}
						selectionChanged={(playerClasses) => {
							this.props.setPlayerClass(playerClasses[0]);
						}}
					/>
					{adminControls}
				</aside>
				<main>
					<DataInjector
						query={{url: `/analytics/clustering/data/${format}/`, params: {}}}
						extract={{
							data: (data) => {
								return {data: data.find((d) => d.player_class === playerClass)};
							},
						}}
					>
						<ClassAnalysis
							cardData={cardData}
							format={format}
							onSelectedDeckChanged={(deck) => this.setState({deck})}
							playerClass={playerClass}
						/>
					</DataInjector>
				</main>
			</div>
		);
	}
}
