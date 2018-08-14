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

export type CardFilterGroupFunction = <T extends keyof Card>(
	card: Card,
	value: Card[T],
) => (card: Card) => boolean;

interface Props extends CardFilterProps {
	title: string;
	filterFactory: CardFilterGroupFunction;
	collapsible?: boolean;
}

interface State {
	filter: CardFilterFunction | null;
	filters: { id: string; filter: CardFilterFunction }[];
}

class CardFilterItemGroup extends React.Component<Props, State> {
	constructor(props: Props, context: any) {
		super(props, context);
		this.state = {
			filter: null,
			filters: [],
		};
	}

	public render(): React.ReactNode {
		const { collapsible } = this.props;

		/*return (
			<CardFilterConsumer>
				{({ values, setValue }) => (
					<InfoboxFilterGroup
						header={this.props.title}
						deselectable
						selectedValue={values[filterKey] || null}
						collapsed={collapsible}
						collapsible={collapsible}
						onClick={(value, sender) => {
							let newValue = values[filterKey] || [];
							if (!value) {
								newValue = newValue.filter(
									test => test !== sender,
								);
							} else {
								newValue.push(value);
							}
							setValue(filterKey, newValue);
						}}
					>
						<Provider value={this.props.filter}>
							{this.props.children}
						</Provider>
					</InfoboxFilterGroup>
				)}
			</CardFilterConsumer>
		);*/

		const { cardData, dbfIds } = this.props;

		return (
			<>
				<CardFilter filter={this.state.filter} />
				<InfoboxFilterGroup
					header={this.props.title}
					deselectable
					selectedValue={[]}
					collapsed={collapsible}
					collapsible={collapsible}
					onClick={(value, sender) => {}}
				>
					<CardFilterProvider
						value={{
							cardData,
							dbfIds,
							addFilter: () => {}, // this.addFilter,
							removeFilter: () => {}, // this.removeFilter,
							filters: [],
						}}
					>
						{this.props.children}
					</CardFilterProvider>
				</InfoboxFilterGroup>
			</>
		);
	}
}

export default props => (
	<CardFilterConsumer>
		{(filterProps: CardFilterProps) => (
			<CardFilterItemGroup {...filterProps} {...props} />
		)}
	</CardFilterConsumer>
);
