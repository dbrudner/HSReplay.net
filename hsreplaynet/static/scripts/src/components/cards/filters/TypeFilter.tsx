import React from "react";
import { InjectedTranslateProps, translate } from "react-i18next";
import { CardData as Card } from "hearthstonejson-client";
import CardFilter from "../CardFilter";
import CardFilterGroup from "../CardFilterGroup";

class TypeFilter extends React.Component<InjectedTranslateProps> {
	public render(): React.ReactNode {
		const { t } = this.props;

		return (
			<CardFilterGroup
				title={t("Type")}
				filter={this.filter}
				filterKey="type"
				collapsible
			>
				<CardFilter value={"MINION"}>
					{t("GLOBAL_CARDTYPE_MINION")}
				</CardFilter>
				<CardFilter value={"SPELL"}>
					{t("GLOBAL_CARDTYPE_SPELL")}
				</CardFilter>
				<CardFilter value={"WEAPON"}>
					{t("GLOBAL_CARDTYPE_WEAPON")}
				</CardFilter>
				<CardFilter value={"HERO"}>
					{t("GLOBAL_CARDTYPE_HERO")}
				</CardFilter>
			</CardFilterGroup>
		);
	}

	private filter = (card: Card, value: string) => value === card.type;
}

export default translate("hearthstone")(TypeFilter);
