import React from "react";
import InfoboxFilter from "../InfoboxFilter";
import { CardFilterConsumer } from "./CardFilterManager";
import { CardFilterItemGroupConsumer } from "./CardFilterItemGroup";

interface Props {
	value: string;
}

class CardFilterItem extends React.Component<Props> {
	public render(): React.ReactNode {
		return (
			<CardFilterItemGroupConsumer>
				{filter => (
					<CardFilterConsumer>
						{({ cardData, dbfIds }) => {
							let matches = null;
							if (cardData) {
								const cards = dbfIds.map(dbfId =>
									cardData.fromDbf(dbfId),
								);
								matches = cards.filter(filter(this.props.value))
									.length;
							}

							return (
								<InfoboxFilter
									value={this.props.value}
									disabled={matches === 0}
								>
									{this.props.children}
									{matches !== null ? (
										<span className="infobox-value">
											{matches}
										</span>
									) : null}
								</InfoboxFilter>
							);
						}}
					</CardFilterConsumer>
				)}
			</CardFilterItemGroupConsumer>
		);
	}
}

export default CardFilterItem;
