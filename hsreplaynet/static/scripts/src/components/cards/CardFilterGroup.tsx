import React from "react";
import { CardFilterConsumer, CardFilterFunction } from "./CardFilterManager";
import InfoboxFilterGroup from "../InfoboxFilterGroup";

const { Provider, Consumer } = React.createContext<CardFilterFunction | null>(
	null,
);
export { Consumer as FilterGroupConsumer };

interface Props {
	title: string;
	filter: CardFilterFunction;
	filterKey: string;
	collapsible?: boolean;
}

export default class CardFilterGroup extends React.Component<Props> {
	public render(): React.ReactNode {
		const { filterKey, collapsible } = this.props;

		return (
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
		);
	}
}
