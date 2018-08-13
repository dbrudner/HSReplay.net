import React from "react";
import { InjectedTranslateProps, translate } from "react-i18next";
import { CardData as Card } from "hearthstonejson-client";
import CardFilterItem from "../CardFilterItem";
import CardFilterItemGroup from "../CardFilterItemGroup";

class TribeFilter extends React.Component<InjectedTranslateProps> {
	public render(): React.ReactNode {
		const { t } = this.props;

		return (
			<CardFilterItemGroup
				title={t("Tribe")}
				filter={this.filter}
				collapsible
			>
				<CardFilterItem value={"BEAST"}>
					{t("GLOBAL_RACE_PET")}
				</CardFilterItem>
				<CardFilterItem value={"DEMON"}>
					{t("GLOBAL_RACE_DEMON")}
				</CardFilterItem>
				<CardFilterItem value={"DRAGON"}>
					{t("GLOBAL_RACE_DRAGON")}
				</CardFilterItem>
				<CardFilterItem value={"ELEMENTAL"}>
					{t("GLOBAL_RACE_ELEMENTAL")}
				</CardFilterItem>
				<CardFilterItem value={"MECHANICAL"}>
					{t("GLOBAL_RACE_MECHANICAL")}
				</CardFilterItem>
				<CardFilterItem value={"MURLOC"}>
					{t("GLOBAL_RACE_MURLOC")}
				</CardFilterItem>
				<CardFilterItem value={"PIRATE"}>
					{t("GLOBAL_RACE_PIRATE")}
				</CardFilterItem>
				<CardFilterItem value={"TOTEM"}>
					{t("GLOBAL_RACE_TOTEM")}
				</CardFilterItem>
			</CardFilterItemGroup>
		);
	}

	private filter = (card: Card, value: string) => value === card.race;
}

export default translate("hearthstone")(TribeFilter);
