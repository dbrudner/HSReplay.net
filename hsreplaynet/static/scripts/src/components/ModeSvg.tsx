import * as React from "react";

interface Props {
	className?: string;
	type: "arena" | "standard" | "wild";
}

export default class ModeSvg extends React.Component<Props> {
	constructor(props: Props, context: any) {
		super(props, context);
	}

	render(): React.ReactNode {
		const className = ["mode-icon"];
		if (this.props.className) {
			className.push(this.props.className);
		}

		switch (this.props.type) {
			case "standard":
				return (
					<svg
						width="128"
						height="128"
						viewBox="0 0 33.867 33.867"
						className={className.join(" ")}
					>
						<g transform="translate(0 -263.13)">
							<path d="m17.955 264.86c-0.48207 0.46226-1.9563 1.0356-1.9563 1.0356-5.1432-0.24163-7.7231 3.9051-7.7231 3.9051s-0.20101 0.13646-0.14609-1.2676c-2.0202 1.9164-1.3013 3.0367-1.7036 3.8825-0.48165-0.31355-0.57498-0.61813-0.72988-1.1078-0.21592 0.33417-0.26466 1.0297 0.137 2.4407-6.4549 5.4539-4.6314 9.7939-4.6314 9.7939s1.0451-2.0934 3.0491-3.6358c1.2094-0.93087 4.5887-2.0258 5.5651-2.4408 0.95192-0.2929 1.6752-0.74241 2.1846-1.135 0.5858-0.45156 0.7698-0.98512 1.196-1.318 0.31507-0.24605 0.88048-0.33456 1.1855-0.34895 0.57436-0.0271 1.0705 9.9e-4 1.6277 0.16084-0.57237 0.20451-0.81999 0.0767-1.8961 0.45273-1.0779 0.37671-1.1611 1.7368-2.3449 2.1029-1.5203 0.47019-4.7963 1.6476-5.9312 2.2578-0.96412 0.52477-1.5132 0.72006-2.9777 2.6727 4.3081-0.3051 7.6153-1.9771 8.7625-2.392-0.46376 0.39052-1.4523 2.2944-1.3181 3.3439 0.13424-0.19526 0.39057-0.35393 1.3425-0.91532-1.074 1.0618-1.6232 4.8451-1.2204 5.6261 0.3051-0.65903 0.50034-1.4035 0.95189-1.7086 0.09764 1.4889 0.73226 2.7947 1.8062 3.3439-0.37833-0.85429 0.30512-4.9061 0.93973-6.6391 0.02441 1.135 0.7078 2.6239 1.1838 3.1243 0.37833-0.6102 0.78106-2.2089 0.84208-2.7581-0.03661-0.30511-0.73224-1.4157-1.074-1.9039 0.45155 0.20748 0.69564 0.52477 1.1472 1.0251 0.21967-0.31731 0.23193-1.135 0.31736-3.0876 1.1472 3.9541-1.2327 8.2134-1.2327 8.2134-0.46376-0.68343-0.72001-1.0251-1.2082-2.2577-0.42714 0.75666-0.77802 3.3924 0.13882 5.346 0.78392 1.6704 3.2537 3.7772 4.5823 4.5736-0.4518-0.97658-0.79265-1.5367-0.99133-2.3514-1e-6 0 0.60916 0.48716 1.0572 0.38677-0.76017-0.97908-1.2933-3.384-1.1645-4.2599 0.23484 0.27195 0.25778 0.56671 0.81202 1.0001-0.58789-1.5731 0.21943-4.1481 0.67752-5.0167 0.19477 0.12931 0.29626 0.92628 0.44651 1.7988 0.17448 1.0132 0.069 1.5304 0.22469 2.9564 0.14645-0.0855 1.2464-1.9074 1.5271-2.6641 0.28069-0.75666 0.46523-2.0738 0.53698-3.1609 0.37772 0.49583 0.58248 1.1918 0.77392 2.8623-0.0033 1.5179-0.67972 3.5395-0.06701 4.8981 0.97388-0.71157 2.2759-3.7559 2.2759-3.7559 0.06144 8e-3 -0.15487-0.5481-0.88373-1.7833 0.62241 0.24408 1.2937 0.84208 1.2937 0.84208l0.34168-1.2692s-0.84304-1.0306-1.8381-1.8712c0.65718 0.14338 1.3708 0.58533 2.1066 1.1146 0.34677-0.6265 0.16397-2.7284-0.31669-4.0595 0.44098 0.62737 0.73432 1.0924 1.2463 1.4225 0.2929-0.30511 0.82631-3.3214 0.68135-4.3099-1.0917-0.54305-1.7529-1.2352-2.1846-1.9377 0.81785 0.31953 1.1519 0.55263 2.0991 1.1725-0.18306-1.4035-1.0617-2.2587-1.0617-2.2587s1.7452 0.95193 3.0022 1.196c1.257 0.24409 3.4415-0.17088 3.4415-0.17088s-1.379-0.76882-2.5628-1.44c-1.1167 0.36002-1.3974 0.34174-2.1357-0.13426 0.51258 0.0427 0.96418-0.055 1.4157-0.40275-0.90311-0.5736-1.0017-1.0529-1.0017-1.0529 1.1276 0 1.7039-0.13329 2.2132-0.98444-0.64245 0.12629-2.3771 0.22433-3.4478-0.55823-1.9237-1.406-4.591-1.4843-4.591-1.4843l2.4834 3.6465c-0.67069 0.30858-1.8296 0.28647-3.7971-0.4039 0.40812 0.69228 0.50152 1.0448 0.58886 2.591-0.53554-2.1492-1.3474-2.4755-1.7949-3.59 2.3453 1.0535 3.9736 0.90766 3.9736 0.90766s-0.17097-0.37105-0.41415-0.76559c-0.68253-0.0223-1.6284-0.78972-1.6284-0.78972s0.64449-0.01 1.0375-0.11172c-0.58334-0.51658-0.91248-0.90852-1.6284-2.341 1.9437-0.14226 3.8929 0.62885 5.5635 1.7197-0.44874-1.3117-4.1421-3.5899-6.4894-3.728 0.3879-0.25 0.97519-1.1281 0.93198-1.8985-1.5199 0.81007-3.2793 0.75937-3.2793 0.75937s0.07586-0.91393-0.33909-1.1046zm-5.5568 4.6752c-0.23188 0.28069-0.68421 0.6182-0.6598 0.83787 0.02441 0.21968 0.79296 0.43337 0.80609 1.02 0.01807 0.80805-0.20244 0.96119-0.82485 1.3395 0.35392 0.0732 0.57832-0.0269 0.84352-0.1098l0.3906-0.12203s-0.25424 0.41343-1.0755 0.74233c-0.85714 0.15951-1.5487 0.0271-1.9283-0.0853-0.25123 0.10692-0.5858 0.26843-0.84208 0.19521-0.25629-0.0732-0.80547-0.28064-1.0984-0.78101 0 0 1.4279 0.15864 2.0992-0.37834 0.57359-0.43934 0.79946-1.1838 1.2356-1.7488 0.31188-0.40407 0.64973-0.71935 1.0539-0.90957zm-5.4031 4.8963c0.17543-1e-3 0.39204 0.032 0.72155 0.1175 0.012203 0.12203-0.28069 0.31733-0.81767 0.70785-0.3051-0.14645-0.37834-0.73227-0.37834-0.73227 0.16476-0.055 0.29903-0.0915 0.47446-0.093z" />
						</g>
					</svg>
				);
			case "wild":
				return (
					<svg viewBox="0 0 128 128" className={className.join(" ")}>
						<path d="m111.79 90.899c-1.312 4.81 2.405 12.024 2.405 12.024-5.247 2.405-20.331-6.34-20.331-6.34-16.133-0.377-27.26-13.165-27.26-13.165l15.776-14.449c1.789 2.517 8.422 8.594 13.232 8.594s9.838-2.623 10.712-10.056-5.106-11.399-7.074-11.399-5.652-0.276-12.82 5.934c-7.493 6.49-26.234 23.829-26.234 23.829 0 11.805-13.117 15.522-13.117 15.522 0.219-2.842-1.312-6.559-1.312-6.559-6.121 2.623-17.708 4.81-28.42-2.623s-10.056-22.299-10.056-22.299l-3.716-6.34 6.121-4.591c1.312-6.34 7.214-12.024 7.214-12.024 6.121-20.987 19.238-22.299 19.238-22.299-0.437 8.745 3.279 12.898 3.279 12.898 18.582-0.437 29.313 15.519 29.313 15.519l-16.265 14.153c-5.028-5.903-14.242-10.14-17.736-10.292-6.341-0.276-10.095 4.476-10.201 12.13-0.087 6.262 5.552 9.154 8.409 8.96 4.066-0.276 4.687-8.409 4.687-8.409s4.243 2.634 4.273 7.444c0.013 2.164 4.298-1.246 4.298-1.246l26.015-22.955-2.405-19.02 19.457 6.121s12.481-6.405 24.922 7.214c3.227 1.059 6.387-3.155 6.387-3.155 2.107 4.478-1.141 11.026-1.141 11.026s15.274 20.836-7.65 35.853z" />
					</svg>
				);
			case "arena":
				return (
					<svg viewBox="0 0 128 128" className={className.join(" ")}>
						<path d="m96.92 97.413l-4.277-13.028c1.592-2.26 2.925-4.714 3.96-7.32l22.487-13.425-22.758-13.408c-0.941-2.233-2.108-4.347-3.466-6.319l3.755-14.792-14.339 4.707c-1.707-1.057-3.511-1.97-5.395-2.729l-13.247-22.189-13.019 22.098c-2.123 0.839-4.144 1.875-6.043 3.088l-16.25-4.677 4.83 16.452c-0.931 1.563-1.742 3.206-2.428 4.912l-21.82 12.857 21.545 12.863c0.732 1.942 1.63 3.801 2.676 5.563l-4.503 15.646 15.042-4.416c2.154 1.471 4.481 2.704 6.94 3.676l13.03 22.118 13.258-22.207c2.071-0.836 4.044-1.861 5.899-3.055l14.123 3.585zm-49.192-15.152c-0.297-0.404-0.73-1.866-0.73-1.866l-0.812-1.704s-0.73-1.217 0.812-0.974 7.141 2.434 10.224 2.516c3.084 0.081 4.707-1.542 5.275-1.704s3.895-1.461 4.869-1.623 6.979-3.836 7.871-12.67c0.893-8.834-7.06-14.027-11.604-14.108 0 0-2.84-0.081-3.489 0.325s-4.869 2.353-6.735 2.597c0 0-1.542 1.461-1.298 3.246 0.243 1.785 0.243 7.93 6.735 7.941 0 0 1.55-0.837 1.384-6.904 0 0 8.08-0.672 8.29 6.904s-7.24 8.625-11.857 8.416-14.377-6.613-13.642-16.791l0.569-3.625 1.623-1.866s3.733-7.547 12.253-9.819c0 0 0.73-1.217 1.623-1.217s1.623 0.974 2.921 1.136 1.785-1.217 3.002-1.136 1.298 0.974 2.597 1.217c1.298 0.243 7.628 0.974 12.74 7.952 0 0 0.243 1.785 0.974 2.11 0.73 0.325 2.434 1.055 2.678 1.623 0.243 0.568 1.948 6.654 1.785 9.251s-0.893 14.688-8.926 18.42l-0.162 2.191s-6.005 5.356-15.175 4.707c-9.169-0.65-11.638-1.615-13.795-4.545z" />
					</svg>
				);
		}
	}
}