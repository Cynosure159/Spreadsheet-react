import { useEffect, useRef, useState } from "react";

export default function ActiveCell(props) {
	const [readOnly, setReadOnly] = useState(true);
	const inputRef = useRef();

	useEffect(() => {
		if (inputRef.current) {
			// console.log(inputRef.current.value);
			// console.log(props.lastRow, props.lastCol);
			let temp = inputRef.current.value;
			props.updateCallback(props.lastRow, props.lastCol, temp);
		} // 若有输入则回调更新数据
		setReadOnly(true);
	}, [props.left, props.top]); //当选中位置改变时

	useEffect(() => {
		setReadOnly(true);
	}, [props.trigger]); // 触发时取消编辑模式

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
			onClick={(e) => {
				// console.log(readOnly);
				if (readOnly) setReadOnly(false);
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
