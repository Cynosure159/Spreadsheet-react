import { useEffect, useRef, useState } from "react";

export default function ActiveCell(props) {
	const [readOnly, setReadOnly] = useState(true);
	const inputRef = useRef();

	useEffect(() => {
		if (inputRef.current) {
			// console.log(inputRef.current.value);
			let temp = inputRef.current.value;
			props.updateCallback(props.lastRow, props.lastCol, temp);
		}
		setReadOnly(true);
	}, [props]);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.value = props.value;
		}
	}, [readOnly]);

	return props.hidden ? null : (
		<div
			className="active-cell"
			style={{
				width: props.width,
				height: props.height,
				left: props.left,
				top: props.top,
			}}
			onClick={() => {
				setReadOnly(false);
			}}
		>
			{readOnly ? null : (
				<input
					ref={inputRef}
					className="active-cell-input"
					autoFocus
					// style={readOnly ? { display: "none" } : null}
				></input>
			)}
		</div>
	);
}
