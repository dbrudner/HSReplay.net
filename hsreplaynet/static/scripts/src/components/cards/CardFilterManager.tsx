import React from "react";
import CardData from "../../CardData";
import { CardData as Card } from "hearthstonejson-client";

const { Provider, Consumer } = React.createContext<CardFilterProps>({
	cardData: null,
	dbfIds: [],
	addFilter: x => console.error("called addFilter out of context"),
	removeFilter: x => console.error("called removeFilter out of context"),
	filters: [],
});
export { Provider as CardFilterProvider, Consumer as CardFilterConsumer };

export type CardFilterFunction = <T extends keyof Card>(card: Card) => boolean;

export interface CardFilterProps {
	cardData: CardData | null;
	dbfIds: number[];
	addFilter: (filter: CardFilterFunction) => void;
	removeFilter: (filter: CardFilterFunction) => void;
	filters: CardFilterFunction[];
}

interface Props {
	cardData: CardData | null;
	onFilter: (dbfIds: number[]) => void;
}

interface State {
	filters: CardFilterFunction[];
	filteredCards: number[] | null;
}

export default class CardFilterManager extends React.Component<Props, State> {
	constructor(props: Props, context: any) {
		super(props, context);
		this.state = {
			filters: [],
			filteredCards: CardFilterManager.getInitialCards(props.cardData),
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
		console.log(this.state.filters);
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
					filters: this.state.filters,
					addFilter: this.addFilter,
					removeFilter: this.removeFilter,
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

	private addFilter = (filter: CardFilterFunction) => {
		console.log("add");
		this.setState(state => {
			const filters = state.filters.concat(filter);
			return {
				filters,
				filteredCards: this.filter(filters),
			};
		});
	};

	private removeFilter = (filter: CardFilterFunction) => {
		console.log("remove");
		this.setState(state => {
			const filters = state.filters.filter(
				toRemove => filter !== toRemove,
			);
			return {
				filters,
				filteredCards: this.filter(filters),
			};
		});
	};

	private filter = (filters: CardFilterFunction[]): number[] | null => {
		const cards = CardFilterManager.getInitialCards(this.props.cardData);
		if (!cards || !this.props.cardData) {
			return null;
		}
		let cardsWithData = cards.map(dbfId =>
			this.props.cardData.fromDbf(dbfId),
		);
		for (const filter of filters) {
			cardsWithData = cardsWithData.filter(filter);
		}
		return cardsWithData.map(card => card.dbfId);
	};
}
