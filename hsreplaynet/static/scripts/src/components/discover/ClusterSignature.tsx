import React from "react";
import CardTable from "../tables/CardTable";
import { SortDirection } from "../../interfaces";
import CardData from "../../CardData";
import { ArchetypeSignature } from "../../utils/api";
import LoadingSpinner from "../LoadingSpinner";

interface Props {
	cardData: CardData | null;
	signature?: ArchetypeSignature;
}

interface State {
	sortBy: string;
	sortDirection: SortDirection;
}

export default class ClusterSignature extends React.Component<Props, State> {
	constructor(props: Props, context?: any) {
		super(props, context);
		this.state = {
			sortBy: "prevalence",
			sortDirection: "descending",
		};
	}

	public render(): React.ReactNode {
		const { cardData, signature } = this.props;

		if (!cardData) {
			return <LoadingSpinner active />;
		}

		const cards = [];
		const prevalences = [];

		signature.components.forEach(([dbfId, prevalence]) => {
			cards.push({ card: cardData.fromDbf(dbfId), count: 1 });
			prevalences.push({
				dbf_id: dbfId,
				prevalence,
			});
		});
		return (
			<CardTable
				cards={cards}
				data={prevalences}
				columns={["prevalence"]}
				sortBy={this.state.sortBy}
				sortDirection={this.state.sortDirection}
				onSortChanged={(sortBy, sortDirection) =>
					this.setState({ sortBy, sortDirection })
				}
				numCards={signature.components.length}
				minColumnWidth={100}
				headerWidth={[150, 300]}
				headerWidthRatio={0.66}
			/>
		);
	}
}
