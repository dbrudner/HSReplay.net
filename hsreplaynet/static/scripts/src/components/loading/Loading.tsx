import _ from "lodash";
import React from "react";
import { InjectedTranslateProps, translate } from "react-i18next";
import { LoadingStatus } from "../../interfaces";
import LoadingSpinner from "../LoadingSpinner";

type StringOrJSX = string | JSX.Element | JSX.Element[] | React.ReactNode;

interface Props extends InjectedTranslateProps {
	customNoDataMessage?: StringOrJSX;
	status?: LoadingStatus;
}

export const withLoading = (dataKeys?: string[], className?: string) => <
	T extends {}
>(
	// tslint:disable-next-line:variable-name
	Component: React.ComponentClass<T>,
) => {
	const cls = class Loading extends React.Component<T & Props> {
		private getClassName(): string {
			return "message-wrapper" + (className ? " " + className : "");
		}

		private getLoadingMessage(
			status: LoadingStatus,
			customNoDataMessage?: StringOrJSX,
		): StringOrJSX | null {
			const { t } = this.props;
			switch (status) {
				case LoadingStatus.SUCCESS:
					return null;
				case LoadingStatus.LOADING:
					return <LoadingSpinner active />;
				case LoadingStatus.PROCESSING:
					return (
						<>
							<LoadingSpinner active />
							<p>
								<i>{t("This may take a few seconds")}</i>
							</p>
						</>
					);
				case LoadingStatus.NO_DATA:
					return customNoDataMessage || t("No available data");
				case LoadingStatus.ERROR:
					return t("Could not load data. Please check back later.");
			}
		}

		public render(): React.ReactNode {
			const { customNoDataMessage, status } = this.props;
			if (status !== undefined) {
				const message = this.getLoadingMessage(
					status,
					customNoDataMessage,
				);
				if (typeof message === "string") {
					return (
						<h3 className={this.getClassName()} aria-busy="true">
							{message}
						</h3>
					);
				} else if (message !== null) {
					return (
						<div className={this.getClassName()} aria-busy="true">
							{message}
						</div>
					);
				}
			}
			const noData = (dataKeys || ["data"]).some(key => {
				const data = this.props[key];
				return !data || (Array.isArray(data) && data.length === 0);
			});
			if (noData) {
				const message = this.getLoadingMessage(
					LoadingStatus.NO_DATA,
					customNoDataMessage,
				);
				if (typeof message === "string") {
					return <h3 className={this.getClassName()}>{message}</h3>;
				} else if (message !== null) {
					return <div className={this.getClassName()}>{message}</div>;
				}
			}
			const props = _.omit(
				this.props,
				"status",
				"customNoDataMessage",
			) as T;
			return <Component {...props} />;
		}
	};

	return translate()(cls);
};
