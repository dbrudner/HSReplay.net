import React from "react";
import CardData from "../../CardData";
import { CardData as Card } from "hearthstonejson-client";

const { Provider, Consumer } = React.createContext<FilterProps>({
	cardData: null,
	dbfIds: [],
	values: {},
	setValue: (x, y) => console.error("called setValue out of context"),
});
export { Consumer as CardFilterConsumer };

export type CardFilterFunction = <T extends keyof Card>(
	card: Card,
	value: Card[T],
) => boolean;

interface Props {
	cardData: CardData | null;
	onFilter: (dbfIds: number[]) => void;
}

interface State {
	filterValues: { [filterKey: string]: any };
	filteredCards: number[] | null;
}

export interface FilterProps {
	cardData: CardData | null;
	dbfIds: number[];
	values: { [filterKey: string]: any };
	setValue: (filterKey: string, value: any) => void;
}

export default class CardFilterManager extends React.Component<Props, State> {
	constructor(props: Props, context: any) {
		super(props, context);
		this.state = {
			filteredCards: CardFilterManager.getInitialCards(props.cardData),
			filterValues: {},
		};
	}

	public componentDidUpdate(
		prevProps: Readonly<Props>,
		prevState: Readonly<State>,
		snapshot?: any,
	): void {
		if (
			prevState.filteredCards !== this.state.filteredCards &&
			this.state.filteredCards !== null
		) {
			this.props.onFilter(this.state.filteredCards);
		}
	}

	public static getDerivedStateFromProps(nextProps: Props, prevState: State) {
		if (prevState.filteredCards === null && nextProps.cardData) {
			return {
				filteredCards: CardFilterManager.getInitialCards(
					nextProps.cardData,
				),
			};
		}
		return null;
	}

	public render(): React.ReactNode {
		return (
			<Provider
				value={{
					dbfIds: this.state.filteredCards,
					cardData: this.props.cardData,
					values: this.state.filterValues,
					setValue: this.setValue,
				}}
			>
				{this.props.children}
			</Provider>
		);
	}

	private static getInitialCards(cardData: CardData | null) {
		if (!cardData) {
			return null;
		}
		return cardData.collectible().map(card => card.dbfId);
	}

	private setValue = (filterKey: string, value: any): void => {
		this.setState(state => {
			return Object.assign({}, state, {
				filteredCards: this.filter({
					...state.filterValues,
					[filterKey]: value,
				}),
				filterValues: Object.assign({}, state.filterValues, {
					[filterKey]: value,
				}),
			});
		});
	};

	private filter = (filterValues: {
		[filterKey: string]: any;
	}): number[] | null => {
		const cards = CardFilterManager.getInitialCards(this.props.cardData);
		if (!cards || !this.props.cardData) {
			return null;
		}
		let cardsWithData = cards.map(dbfId =>
			this.props.cardData.fromDbf(dbfId),
		);
		for (const [key, values] of Object.entries(filterValues)) {
			cardsWithData = cardsWithData.filter(card => {
				if (!values || !values.length) {
					return true;
				}
				if (values.indexOf(card[key]) === -1) {
					return false;
				}
				return true;
			});
		}
		return cardsWithData.map(card => card.dbfId);
	};
}
