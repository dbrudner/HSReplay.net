import React from "react";
import { CardData as Card } from "hearthstonejson-client";
import {
	CardFilterConsumer,
	CardFilterFunction,
	CardFilterProps,
	CardFilterProvider,
} from "./CardFilterManager";
import InfoboxFilterGroup from "../InfoboxFilterGroup";
import CardFilter from "./CardFilter";
import { memoize } from "lodash";
import { Collection } from "../../utils/api";

const { Provider, Consumer } = React.createContext<CardFilterItemGroupProps>({
	filterFactory: () =>
		console.error("filterFactory requested outside context") as any,
	collection: null,
});
export { Consumer as CardFilterItemGroupConsumer };

interface CardFilterItemGroupProps {
	filterFactory: CardFilterGroupFunction;
	collection: Collection | null;
}

export type CardFilterGroupFunction = (
	value: string,
) => (card: Card) => boolean;

interface Props extends CardFilterProps {
	title: string;
	filterFactory: CardFilterGroupFunction;
	startCollapsed: boolean;
	collapsible?: boolean;
	value: string[];
	onChange: (value: string[]) => void;
	className?: string;
	collection?: Collection;
}

interface State {
	filter: CardFilterFunction | null;
}

class CardFilterItemGroup extends React.Component<Props, State> {
	constructor(props: Props, context: any) {
		super(props, context);
		this.state = {
			filter: null,
		};
	}

	public render(): React.ReactNode {
		const { collapsible, startCollapsed } = this.props;

		return (
			<>
				<CardFilter
					filter={this.filter(
						this.props.value,
						this.props.filterFactory,
					)}
				/>
				<InfoboxFilterGroup
					header={this.props.title}
					deselectable
					selectedValue={this.props.value}
					collapsed={startCollapsed}
					collapsible={collapsible}
					onClick={this.onChange}
					className={this.props.className}
				>
					<CardFilterProvider
						value={{
							dbfIds: this.getChildDbfs(),
							cardData: this.props.cardData,
							addFilter: this.props.addFilter,
							removeFilter: this.props.removeFilter,
							filters: this.props.filters,
							collectible: this.props.collectible,
						}}
					>
						<Provider
							value={{
								filterFactory: this.filterFactory(
									this.props.filterFactory,
								),
								collection: this.props.collection || null,
							}}
						>
							{this.props.children}
						</Provider>
					</CardFilterProvider>
				</InfoboxFilterGroup>
			</>
		);
	}

	private getChildDbfs = (): number[] => {
		const filter = this.filter(this.props.value, this.props.filterFactory);
		if (!this.props.cardData || !filter) {
			return this.props.dbfIds;
		}

		const initialCards = this.props.collectible
			? this.props.cardData.collectible()
			: this.props.cardData
					.all()
					.filter(x => !!x.dbfId && !x.collectible);
		const otherFilters = this.props.filters.filter(x => x !== filter);
		let cards = initialCards;
		for (const otherFilter of otherFilters) {
			cards = cards.filter(otherFilter);
		}
		return cards.map(x => x.dbfId);
	};

	private onChange = (value: string, sender: string) => {
		const values = this.props.value;
		if (this.props.value.indexOf(sender) !== -1) {
			this.props.onChange(values.filter(x => x !== sender));
		} else {
			this.props.onChange(values.concat([value]));
		}
	};

	private filter = memoize(
		(
			values: string[],
			factory: CardFilterGroupFunction,
		): CardFilterFunction | null => {
			if (!values.length) {
				return null;
			}

			const funcs = values.map(factory);
			return card => funcs.some(x => x(card));
		},
	);

	private filterFactory = (factory: CardFilterGroupFunction) => (
		value: string,
	) => factory(value);
}

export default props => (
	<CardFilterConsumer>
		{(filterProps: CardFilterProps) => (
			<CardFilterItemGroup {...filterProps} {...props} />
		)}
	</CardFilterConsumer>
);
