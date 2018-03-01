import React from "react";
import * as _ from "lodash";
import CardIcon from "./CardIcon";
import ManaCurve from "./ManaCurve";
import * as moment from "moment";
import {
	ApiStream,
	CardObj,
	DeckObj,
	HearthstoneCollection,
	User,
} from "../interfaces";
import {
	cardSorting,
	compareDecks,
	getDustCost,
	getFragments,
	getHeroCardId,
	toPrettyNumber,
	toTitleCase,
} from "../helpers";
import UserData, { Account } from "../UserData";
import Tooltip from "./Tooltip";
import DataInjector from "./DataInjector";
import SemanticAge from "./SemanticAge";
import { TwitchStreamPromotionEvents } from "../metrics/GoogleAnalytics";
import HearthstoneJSON, {
	CardData as HearthstoneJSONCardData,
} from "hearthstonejson-client";

interface DeckTileProps extends DeckObj {
	dustCost?: number;
	compareWith?: CardObj[];
	archetypeName?: string;
	hrefTab?: string;
	lastPlayed?: Date;
}

interface StreamsProps {
	streams: ApiStream[];
}

interface CollectionProps {
	collection: HearthstoneCollection | null;
}

interface Props extends DeckTileProps, StreamsProps, CollectionProps {}

class DeckTile extends React.Component<Props> {
	public getUrl(customTab?: string) {
		const { hrefTab } = this.props;
		const tab = customTab
			? { tab: customTab }
			: hrefTab && { tab: hrefTab };
		const fragments = ["gameType", "rankRange"];
		if (UserData.hasFeature("deck-region-filter")) {
			fragments.push("region");
		}
		return `/decks/${this.props.deckId}/` + getFragments(fragments, tab);
	}

	protected getMark(card: HearthstoneJSONCardData, count: number): string {
		if (count > 0) {
			return `x${count}`;
		}

		if (card.rarity === "LEGENDARY") {
			return "★";
		}

		return "";
	}

	public render(): React.ReactNode {
		const cards = this.props.cards || [];
		const cardIcons = [];
		const toCraftCardIcons = [];

		if (this.props.compareWith) {
			const removed = this.props.compareWith.filter(c1 =>
				cards.every(c2 => c2.card.id !== c1.card.id),
			);
			removed.forEach(c => cards.push({ card: c.card, count: 0 }));
		}

		cards.sort(cardSorting);

		let missingDust = null;
		cards.forEach((obj, index: number) => {
			const card = obj.card;
			const count = +obj.count;
			let markText = this.getMark(card, count);
			const markStyle = {
				color: "#f4d442",
				fontSize: "1em",
				right: 0,
				top: 0,
			};

			let itemClassName = null;
			if (this.props.compareWith) {
				const comparisonCard = this.props.compareWith.find(
					c => c.card.id === card.id,
				);
				if (count === 0) {
					itemClassName = "removed";
					markText = "" + -comparisonCard.count;
				} else {
					if (!comparisonCard || comparisonCard.count < count) {
						itemClassName = "added";
						markText =
							"+" +
							(count -
								(comparisonCard ? comparisonCard.count : 0));
					} else if (comparisonCard.count > count) {
						itemClassName = "reduced";
						markText = "" + (count - comparisonCard.count);
					} else {
						itemClassName = "unchanged";
					}
				}
			}

			let userOwns = null;
			if (
				this.props.collection &&
				typeof this.props.collection.collection === "object"
			) {
				const collectionCards = this.props.collection.collection;
				const dbfId = card.dbfId;
				const [nonGolden, golden] = collectionCards[dbfId] || [0, 0];
				userOwns = nonGolden + golden;
				if (userOwns < count) {
					const difference = count - userOwns;
					missingDust += getDustCost(card) * difference;
					toCraftCardIcons.push(
						<li
							className={"needs-crafting"}
							key={`craft_${card.id}`}
						>
							<CardIcon
								card={card}
								mark={this.getMark(card, difference)}
								markStyle={markStyle}
								tabIndex={-1}
							/>
						</li>,
					);
				}
			}

			if (userOwns < count) {
				markText = this.getMark(card, userOwns);
			}
			if (this.props.compareWith || userOwns === null || userOwns > 0) {
				cardIcons.push(
					<li
						className={itemClassName}
						key={
							this.props.compareWith
								? index
								: `${count}x ${card.id}`
						}
					>
						<CardIcon
							card={card}
							mark={markText}
							markStyle={markStyle}
							tabIndex={-1}
						/>
					</li>,
				);
			}
		});

		const deckNameStyle = {
			backgroundImage:
				"url(/static/images/64x/class-icons/" +
				this.props.playerClass.toLowerCase() +
				".png)",
		};

		const dustCost =
			typeof this.props.dustCost === "number"
				? this.props.dustCost
				: null;

		const dustCostStyle = {
			backgroundImage: "url(/static/images/dust.png)",
		};

		let deckName = null;
		const playerClass = toTitleCase(this.props.playerClass);
		if (this.props.archetypeName) {
			deckName = (
				<span
					className="deck-name"
					style={deckNameStyle}
					title={playerClass}
				>
					{this.props.archetypeName}
				</span>
			);
		} else {
			deckName = (
				<span
					className="deck-name"
					style={deckNameStyle}
					title={playerClass}
				>
					{playerClass}
				</span>
			);
		}

		let globalDataIndicator = null;
		if (this.props.hasGlobalData) {
			globalDataIndicator = (
				<Tooltip
					className="global-data-wrapper"
					header="Global statistics available"
					content="This deck is eligible for global statistics."
				>
					<span className="glyphicon glyphicon-globe" />
				</Tooltip>
			);
		}

		let headerData = [];
		if (this.props.lastPlayed) {
			headerData = [
				<span key="last-played" className="last-played">
					<SemanticAge date={this.props.lastPlayed} />
				</span>,
			];
		} else if (dustCost !== null) {
			headerData = [
				<span
					key="dust-cost"
					className="dust-cost"
					style={dustCostStyle}
				>
					{this.props.dustCost}
				</span>,
			];
			if (this.props.streams && this.props.streams.length > 0) {
				const streamCount = this.props.streams.length;
				headerData.push(
					<a
						key="live-now"
						className="live-now text-twitch"
						href={this.getUrl("streams")}
						onClick={() =>
							TwitchStreamPromotionEvents.onClickLiveNow(
								this.props.deckId,
								{
									transport: "beacon",
								},
							)
						}
					>
						<img
							src={`${STATIC_URL}/images/socialauth/twitch.png`}
						/>
						&nbsp;{streamCount > 1
							? `${streamCount} streams`
							: "Live now"}
					</a>,
				);
			}
		}

		return (
			<li
				style={{
					backgroundImage:
						"url(https://art.hearthstonejson.com/v1/256x/" +
						getHeroCardId(this.props.playerClass, true) +
						".jpg)",
				}}
				key={this.props.deckId}
			>
				<a href={this.getUrl()}>
					<div className="deck-tile">
						<div className="col-lg-2 col-md-2 col-sm-2 col-xs-6">
							{deckName}
							<small>{headerData}</small>
							{globalDataIndicator}
						</div>
						<div className="col-lg-1 col-md-1 col-sm-1 col-xs-3">
							<span className="win-rate">
								{(+this.props.winrate).toFixed(1)}%
							</span>
						</div>
						<div className="col-lg-1 col-md-1 col-sm-1 col-xs-3">
							<span className="game-count">
								{toPrettyNumber(this.props.numGames)}
							</span>
						</div>
						<div className="col-lg-1 col-md-1 hidden-sm hidden-xs">
							<div
								className="duration"
								title="Average game length"
							>
								<span className="glyphicon glyphicon-time" />
								{" " +
									moment
										.duration(
											this.props.duration,
											"seconds",
										)
										.asMinutes()
										.toFixed(1) +
									" min"}
							</div>
						</div>
						<div className="col-lg-1 hidden-md hidden-sm hidden-xs">
							<ManaCurve cards={this.props.cards} />
						</div>
						<div className="col-lg-6 col-md-7 col-sm-8 hidden-xs">
							<ul className="card-list">
								{toCraftCardIcons}
								{toCraftCardIcons.length > 0 ? (
									<li
										key="separator"
										className="card-list-separator"
									/>
								) : null}
								{cardIcons}
							</ul>
						</div>
					</div>
				</a>
			</li>
		);
	}
}

export default class InjectedDeckTile extends React.Component<DeckTileProps> {
	private getAccount(): Account | null {
		if (!UserData.isAuthenticated()) {
			return null;
		}
		const accounts = UserData.getAccounts();
		const defaultAccount = UserData.getDefaultAccountKey();
		if (!accounts.length || !defaultAccount) {
			return null;
		}
		const [region, account_lo] = defaultAccount.split("-");
		return (
			accounts.find(
				(account: Account) =>
					+account.region === +region && +account.lo === +account_lo,
			) || null
		);
	}

	public render(): React.ReactNode {
		const props = _.omit(this.props, "children") as any;

		return (
			<DataInjector
				query={[
					{ key: "streams", params: {}, url: "/live/streaming-now/" },
				]}
				extract={{
					streams: data => {
						const deck = [];
						this.props.cards.forEach(card => {
							for (let i = 0; i < card.count; i++) {
								deck.push(card.card.dbfId);
							}
						});
						return {
							streams: data.filter(
								stream =>
									Array.isArray(stream.deck) &&
									stream.deck.length &&
									compareDecks(stream.deck.map(Number), deck),
							),
						};
					},
				}}
				fetchCondition={UserData.hasFeature("twitch-stream-promotion")}
			>
				{({ streams }) => {
					const account = this.getAccount();
					if (!account) {
						return (
							<DeckTile
								{...props}
								streams={streams}
								collection={null}
							/>
						);
					}

					return (
						<DataInjector
							query={[
								{
									key: "collection",
									params: {
										account_hi: "" + account.hi,
										account_lo: "" + account.lo,
									},
									url: "/api/v1/collection/",
								},
							]}
							extract={{
								collection: data => ({
									collection: data || null,
								}),
							}}
							fetchCondition={UserData.hasFeature(
								"collection-syncing",
							)}
						>
							{({ collection }) => (
								<DeckTile
									{...props}
									streams={streams}
									collection={collection}
								/>
							)}
						</DataInjector>
					);
				}}
			</DataInjector>
		);
	}
}
