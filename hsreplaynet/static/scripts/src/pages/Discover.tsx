import * as React from "react";
import * as _ from "lodash";
import AdminDeckInfo from "../components/discover/AdminDeckInfo";
import CardData from "../CardData";
import ClassFilter, {FilterOption} from "../components/ClassFilter";
import ClassAnalysis, {ClusterMetaData} from "../components/discover/ClassAnalysis";
import DataInjector from "../components/DataInjector";
import DataManager from "../DataManager";
import InfoboxFilter from "../components/InfoboxFilter";
import InfoboxFilterGroup from "../components/InfoboxFilterGroup";
import UserData from "../UserData";
import InfoIcon from "../components/InfoIcon";

interface DiscoverProps extends React.ClassAttributes<Discover> {
	cardData: CardData;
	dataset?: string;
	format?: string;
	playerClass?: string;
	setDataset?: (dataset: string) => void;
	setFormat?: (format: string) => void;
	setPlayerClass?: (tab: string) => void;
	setTab?: (clusterTab: string) => void;
	tab?: string;
	sampleSize?: string;
	setSampleSize?: (sampleSize: string) => void;
}

interface DiscoverState {
	deck: ClusterMetaData;
}

export default class Discover extends React.Component<DiscoverProps, DiscoverState> {
	constructor(props: DiscoverProps, state: DiscoverState) {
		super(props, state);
		this.state = {
			deck: null,
		};
	}

	render(): JSX.Element {
		const {cardData, tab, dataset, format, playerClass, sampleSize, setTab} = this.props;
		let adminControls = null;
		if (UserData.hasFeature("archetype-training")) {
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
				<InfoboxFilterGroup
					key="cluster-data-filter"
					header="Dataset"
					selectedValue={dataset}
					onClick={(value) => this.props.setDataset(value)}
				>
					<InfoboxFilter value="live">Live</InfoboxFilter>
					<InfoboxFilter value="latest">Latest</InfoboxFilter>
				</InfoboxFilterGroup>,
			];
			const {deck} = this.state;
			if (deck !== null) {
				adminControls.push(
					<h2 key="admin-header">Admin</h2>,
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
			<div className="discover-container">
				<aside className="infobox">
					<h1>
						Discover
						<InfoIcon
							header="Discover"
							content="Here you can find deck clusters detected by our archetype algorithms. Each dot is a deck, with the size representing the number of replays."
						/>
					</h1>
					<h2>Class</h2>
					<ClassFilter
						minimal={true}
						filters="ClassesOnly"
						selectedClasses={[playerClass as FilterOption]}
						selectionChanged={(playerClasses) => {
							this.props.setPlayerClass(playerClasses[0]);
						}}
					/>
					<InfoboxFilterGroup
						key="cluster-sample-size"
						header="Sample size"
						selectedValue={sampleSize}
						onClick={(value) => this.props.setSampleSize(value)}
					>
						<InfoboxFilter value="250">250</InfoboxFilter>
						<InfoboxFilter value="500">500</InfoboxFilter>
						<InfoboxFilter value="full">Full</InfoboxFilter>
					</InfoboxFilterGroup>
					{adminControls}
				</aside>
				<main>
					<DataInjector
						query={{url: `/analytics/clustering/data/${dataset}/${format}/`, params: {}}}
						extract={{
							data: (clusterData) => {
								let maxGames = 0;
								let data = null;

								clusterData.forEach((classData) => {
									if (classData.player_class === playerClass) {
										data = classData;
									}
									classData.data.forEach((deckData) => {
										if (deckData.metadata.games > maxGames) {
											maxGames = deckData.metadata.games;
										}
									});
								});

								return {data, maxGames};
							},
						}}
					>
						<ClassAnalysis
							cardData={cardData}
							clusterTab={tab}
							setClusterTab={setTab}
							format={format}
							onSelectedDeckChanged={(deck) => this.setState({deck})}
							playerClass={playerClass}
							sampleSize={sampleSize === "full" ? Number.MAX_SAFE_INTEGER : +sampleSize}
						/>
					</DataInjector>
				</main>
			</div>
		);
	}
}
