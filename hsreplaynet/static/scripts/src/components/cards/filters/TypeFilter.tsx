import React from "react";
import { InjectedTranslateProps, translate } from "react-i18next";
import CardFilterItem from "../CardFilterItem";
import CardFilterItemGroup from "../CardFilterItemGroup";

class TypeFilter extends React.Component<InjectedTranslateProps> {
	public render(): React.ReactNode {
		const { t } = this.props;

		return (
			<CardFilterItemGroup
				title={t("Type")}
				filterFactory={this.filter}
				collapsible={false}
			>
				<CardFilterItem value={"MINION"}>
					{t("GLOBAL_CARDTYPE_MINION")}
				</CardFilterItem>
				<CardFilterItem value={"SPELL"}>
					{t("GLOBAL_CARDTYPE_SPELL")}
				</CardFilterItem>
				<CardFilterItem value={"WEAPON"}>
					{t("GLOBAL_CARDTYPE_WEAPON")}
				</CardFilterItem>
				<CardFilterItem value={"HERO"}>
					{t("GLOBAL_CARDTYPE_HERO")}
				</CardFilterItem>
			</CardFilterItemGroup>
		);
	}

	private filter = (card, value) => card => value === card.type;
}

export default translate("hearthstone")(TypeFilter);
