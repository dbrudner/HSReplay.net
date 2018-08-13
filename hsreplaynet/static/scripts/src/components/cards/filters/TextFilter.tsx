import React, { ChangeEvent } from "react";
import { CardData as Card } from "hearthstonejson-client";
import { InjectedTranslateProps, translate } from "react-i18next";
import CardFilter from "../CardFilter";
import { CardFilterFunction } from "../CardFilterManager";
import { cleanText, slangToCardId } from "../../../helpers";

interface Props extends InjectedTranslateProps {
	autofocus?: boolean;
}

interface State {
	input: string;
	filter: CardFilterFunction | null;
}

class TextFilter extends React.Component<Props, State> {
	constructor(props: Props, context: any) {
		super(props, context);
		this.state = {
			input: "",
			filter: null,
		};
	}

	public render(): React.ReactNode {
		const { t } = this.props;

		const clearButton =
			this.state.input !== "" ? (
				<span
					className="glyphicon glyphicon-remove form-control-feedback"
					onClick={() => this.setState({ input: "" })}
				/>
			) : null;

		return (
			<>
				<CardFilter filter={this.state.filter} />
				<div className="search-wrapper">
					<div className="form-group has-feedback">
						<input
							type="text"
							value={this.state.input}
							onChange={this.onChange}
							autoFocus={this.props.autofocus}
							placeholder={t("Search: Fireball, Magma Rager…")}
							className="form-control"
						/>
						<span className="glyphicon glyphicon-search form-control-feedback" />
						{clearButton}
					</div>
				</div>
			</>
		);
	}

	private onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const target = e.target;
		if (!target) {
			return;
		}
		const input = target.value;
		this.setState({
			input,
			filter: input ? this.filter(target.value) : null,
		});
	};

	private filter = (input: string) => {
		const parts = input
			.split(",")
			.map(x => {
				x = x.trim();
				const isSearch = x.length > 0 ? x[0] === "^" : false;
				x = cleanText(x);
				return isSearch ? `^${x}` : x;
			})
			.filter(x => !!x);

		let slangs = parts.map(slangToCardId).filter(x => !!x);
		if (!slangs.length) {
			slangs = null;
		}

		return (card: Card): boolean => {
			const cardName = card.name ? cleanText(card.name) : null;
			const cardText = card.text ? cleanText(card.text) : null;
			return (
				parts.some(part => {
					if (part[0] === "^") {
						// do a prefix search
						return cardName.indexOf(part.substr(1)) === 0;
					} else {
						// otherwise just check whether it's anywhere on the card
						return (
							(cardName && cardName.indexOf(part) !== -1) ||
							(cardText && cardText.indexOf(part) !== -1)
						);
					}
				}) ||
				(slangs && slangs.some(slang => card.id === slang))
			);
		};
	};
}

export default translate()(TextFilter);
