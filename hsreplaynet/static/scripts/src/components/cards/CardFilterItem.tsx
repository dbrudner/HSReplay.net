import React from "react";
import InfoboxFilter from "../InfoboxFilter";
import { CardFilterConsumer, CardFilterFunction } from "./CardFilterManager";

interface Props {
	value?: string;
	filter?: CardFilterFunction;
}

class CardFilterItem extends React.Component<Props> {
	public render(): React.ReactNode {
		return (
			<InfoboxFilter value={this.props.value}>
				{this.props.children}
				<CardFilterConsumer>
					{({ cardData, dbfIds }) => {
						if (!cardData || !this.props.filter) {
							return null;
						}
						const cards = dbfIds.map(dbfId =>
							cardData.fromDbf(dbfId),
						);
						return (
							<span className="infobox-value">
								{cards.filter(this.props.filter).length}
							</span>
						);
					}}
				</CardFilterConsumer>
			</InfoboxFilter>
		);
	}
}

export default CardFilterItem;
