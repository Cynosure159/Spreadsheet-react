export default function SelectRect(props) {
	return props.hidden ? null : (
		<div
			className={`select-rect ${
				props.border ? "select-rect-border" : ""
			}`}
			style={{
				width: props.width,
				height: props.height,
				left: props.left,
				top: props.top,
			}}
		></div>
	);
}
