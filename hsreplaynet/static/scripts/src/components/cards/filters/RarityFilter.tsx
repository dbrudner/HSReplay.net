import React from "react";
import { InjectedTranslateProps, translate } from "react-i18next";
import { CardData as Card } from "hearthstonejson-client";
import CardFilterItem from "../CardFilterItem";
import CardFilterItemGroup from "../CardFilterItemGroup";
import { CardFilterFunction } from "../CardFilterManager";

class RarityFilter extends React.Component<InjectedTranslateProps> {
	public render(): React.ReactNode {
		const { t } = this.props;

		/*return (
			<CardFilterItemGroup
				title={t("Rarity")}
				filter={this.filter}
			>
				<CardFilterItem value={"FREE"}>
					{t("GLOBAL_RARITY_FREE")}
				</CardFilterItem>
				<CardFilterItem value={"COMMON"}>
					{t("GLOBAL_RARITY_COMMON")}
				</CardFilterItem>
				<CardFilterItem value={"RARE"}>
					{t("GLOBAL_RARITY_RARE")}
				</CardFilterItem>
				<CardFilterItem value={"EPIC"}>
					{t("GLOBAL_RARITY_EPIC")}
				</CardFilterItem>
				<CardFilterItem value={"LEGENDARY"}>
					{t("GLOBAL_RARITY_LEGENDARY")}
				</CardFilterItem>
			</CardFilterItemGroup>
		);*/

		return (
			<>
				<CardFilterItem filter={this.filterFree}>
					{t("GLOBAL_RARITY_FREE")}
				</CardFilterItem>
				<CardFilterItem filter={this.filterCommon}>
					{t("GLOBAL_RARITY_COMMON")}
				</CardFilterItem>
				<CardFilterItem filter={this.filterRare}>
					{t("GLOBAL_RARITY_RARE")}
				</CardFilterItem>
			</>
		);
	}

	private filterFree: CardFilterFunction = (card: Card) =>
		card.rarity === "FREE";
	private filterCommon: CardFilterFunction = (card: Card) =>
		card.rarity === "COMMON";
	private filterRare: CardFilterFunction = (card: Card) =>
		card.rarity === "RARE";
}

export default translate("hearthstone")(RarityFilter);
