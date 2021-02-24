import { useRef, useState } from "react";
import ActiveCell from "./ActiveCell";
import SelectRect from "./SelectRect";

export default function MySpreadsheet() {
	const [rows, setRows] = useState(6); // 行数
	const [cols, setCols] = useState(8); // 列数
	const [tableRows, setTableRows] = useState(6); // 行数
	const [tableCols, setTableCols] = useState(8); // 列数
	const [mouseDown, setMouseDown] = useState(false); // 是否按住鼠标
	const [tableData, setTableData] = useState([
		["", "A", "B", "C", "D", "E", "F", "G", "H"],
		[1, "", "", "", "", "", "", "", ""],
		[2, "", "", "", "", "", "", "", ""],
		[3, "", "", "", "", "", "", "", ""],
		[4, "", "", "", "", "", "", "", ""],
		[5, "", "", "", "", "", "", "", ""],
		[6, "", "", "", "", "", "", "", ""],
	]); // 表格数据
	const [selected, setSelected] = useState(false); // 是否选中表格
	const [activeProps, setActiveProps] = useState({
		width: "",
		height: "",
		left: "",
		top: "",
		row: 0,
		col: 0,
		lastRow: 0,
		lastCol: 0,
		value: "",
		trigger: false, // 一个触发属性，用来取消编辑模式
	}); // 选中表格后的active cell参数

	const [drugSelected, setDrugSelected] = useState(false); // 是否拖拽选择
	const [selectProps, setSelectProps] = useState({
		width: "",
		height: "",
		left: "",
		top: "",
		rowX: 0,
		colX: 0,
		rowY: 0,
		colY: 0,
		border: false,
	}); // 选择多个表格后的select Rect参数

	const tableRef = useRef();

	function resize() {
		// console.log(rows, cols);
		let temp = tableData;

		// 需要增加列数
		if (temp[0].length - 1 < cols) {
			let difference = cols + 1 - temp[0].length;
			// console.log(difference);

			// 单独处理首行
			let tempArray = [];
			for (let i = 0; i < difference; i++) {
				tempArray.push(
					String.fromCharCode(
						temp[0][temp[0].length - 1].charCodeAt() + i + 1
					)
				);
			}
			temp[0] = temp[0].concat(tempArray);

			for (let i = 1; i < temp.length; i++) {
				temp[i] = temp[i].concat(Array(difference).fill(""));
			}
		}

		// 需要减少列数
		if (temp[0].length - 1 > cols) {
			for (let i = 0; i < temp.length; i++) {
				temp[i] = temp[i].slice(0, cols + 1);
			}
		}

		// 需要增加行数
		if (temp.length - 1 < rows) {
			let difference = rows + 1 - temp.length;
			// console.log(difference);
			for (let i = 0; i < difference; i++) {
				// 行头位递增
				temp.push(
					[temp[temp.length - 1][0] + 1].concat(
						Array(temp[0].length - 1).fill("")
					)
				);
			}
		}

		// 需要减少行
		if (temp.length - 1 > rows) {
			temp = temp.slice(0, rows + 1);
		}
		// console.log(temp);
		setTableData(temp);
		setTableRows(rows);
		setTableCols(cols);
	}

	function input(row, col, value) {
		// 更改表格data
		// console.log(row, col);
		let temp = tableData;
		if (value.charAt(0) !== "=") {
			temp[row][col] = value;
			tableRef.current.rows[row].cells[col].innerText = value;
		} else {
			console.log("??");
			temp[row][col] = "math";
			tableRef.current.rows[row].cells[col].innerText = "math";
		}
		setTableData(temp);
	}

	function clickCell(row, col) {
		setSelected(true);
		setDrugSelected(false);
		setActiveProps({
			...activeProps,
			width: tableRef.current.rows[row].cells[col].offsetWidth + "px",
			height: tableRef.current.rows[row].cells[col].offsetHeight + "px",
			left: tableRef.current.rows[row].cells[col].offsetLeft + "px",
			top: tableRef.current.rows[row].cells[col].offsetTop + "px",
			lastRow: activeProps.row,
			lastCol: activeProps.col,
			value: tableRef.current.rows[row].cells[col].innerText,
			row: row,
			col: col,
		}); //根据table中的具体元素位置和大小设定active cell 的位置大小
	}

	function updateActiveProps() {
		setActiveProps({
			...activeProps,
			left:
				tableRef.current.rows[activeProps.row].cells[activeProps.col]
					.offsetLeft + "px",
			top:
				tableRef.current.rows[activeProps.row].cells[activeProps.col]
					.offsetTop + "px",
		}); // 更新位置
	}

	function handleMouseDown(e) {
		setMouseDown(true);
		setSelectProps({
			...selectProps,
			border: false,
		});
	}

	function handleMouseUp(e) {
		setMouseDown(false);
		setSelectProps({
			...selectProps,
			border: true,
		});
	}

	function getCellByPos(mouseX, mouseY) {
		let ans = { x: null, y: null };
		for (let i = 0; i <= cols; i++) {
			if (
				tableRef.current.rows[0].cells[i].getClientRects()[0].x <=
					mouseX &&
				tableRef.current.rows[0].cells[i].getClientRects()[0].x +
					tableRef.current.rows[0].cells[i].offsetWidth >
					mouseX
			) {
				ans.y = i;
				break;
			}
		}
		for (let i = 0; i <= rows; i++) {
			if (
				tableRef.current.rows[i].cells[0].getClientRects()[0].y <=
					mouseY &&
				tableRef.current.rows[i].cells[0].getClientRects()[0].y +
					tableRef.current.rows[i].cells[0].offsetHeight >
					mouseY
			) {
				ans.x = i;
				break;
			}
		}
		if (ans.x === 0) ans.x = 1;
		if (ans.y === 0) ans.y = 1;
		if (
			tableRef.current.rows[0].cells[cols].getClientRects()[0].x +
				tableRef.current.rows[0].cells[cols].offsetWidth <=
			mouseX
		) {
			ans.y = cols;
		}
		if (
			tableRef.current.rows[rows].cells[0].getClientRects()[0].y +
				tableRef.current.rows[rows].cells[0].offsetHeight <=
			mouseY
		) {
			ans.x = rows;
		}
		return ans;
	}

	function updateSelectProps(x1, x2, y1, y2) {
		// 计算左上右下坐标
		let rowX,
			rowY,
			colX,
			colY,
			width = 0,
			height = 0;
		if (x1 < x2) {
			rowX = x1;
			rowY = x2;
		} else {
			rowX = x2;
			rowY = x1;
		}
		if (y1 < y2) {
			colX = y1;
			colY = y2;
		} else {
			colX = y2;
			colY = y1;
		}

		// 计算大小
		for (let i = colX; i <= colY; i++) {
			width += tableRef.current.rows[0].cells[i].offsetWidth;
		}
		for (let i = rowX; i <= rowY; i++) {
			height += tableRef.current.rows[i].cells[0].offsetHeight;
		}

		if (rowX !== rowY || colX !== colY) setDrugSelected(true);

		setSelectProps({
			...selectProps,
			rowX: rowX,
			rowY: rowY,
			colX: colX,
			colY: colY,
			height: height,
			width: width,
			left: tableRef.current.rows[rowX].cells[colX].offsetLeft,
			top: tableRef.current.rows[rowX].cells[colX].offsetTop,
		});
	}

	function handleMouseMove(e) {
		let mouseX =
			e.pageX ||
			e.clientX +
				(document.documentElement.scrollLeft ||
					document.body.scrollLeft);
		let mouseY =
			e.pageY ||
			e.clientY +
				(document.documentElement.scrollTop || document.body.scrollTop);
		if (mouseDown) {
			let cellNow = getCellByPos(mouseX, mouseY);
			// console.log(cellNow.x, cellNow.y);
			updateSelectProps(
				activeProps.row,
				cellNow.x,
				activeProps.col,
				cellNow.y
			);
		}
	}

	function ascendingSort(index) {
		// 退出编辑
		setActiveProps({
			...activeProps,
			trigger: !activeProps.trigger,
		});

		let temp = tableData.slice(1, tableData.length);
		temp.sort((a, b) => {
			let x = Number(a[index]);
			let y = Number(b[index]);
			if (isNaN(x)) return 1;
			if (isNaN(y)) return -1;
			return x - y;
		});
		let topEmp = 0;
		// console.log(temp[topEmp][activeProps.col]);
		while (topEmp + 1 < tableData.length && temp[topEmp][index] === "")
			topEmp++;
		let temp1 = temp.splice(topEmp, temp.length - topEmp);
		temp = temp1.concat(temp);
		for (let i = 0; i < temp.length; i++) {
			temp[i][0] = i + 1;
		}
		setTableData(tableData.slice(0, 1).concat(temp));
	}

	function descendingSort(index) {
		// 退出编辑
		setActiveProps({
			...activeProps,
			trigger: !activeProps.trigger,
		});
		let temp = tableData.slice(1, tableData.length);
		temp.sort((a, b) => {
			let x = Number(a[index]);
			let y = Number(b[index]);
			if (isNaN(x)) return 1;
			if (isNaN(y)) return -1;
			return y - x;
		});
		let topNum = 0;
		// console.log(temp[topEmp][activeProps.col]);
		while (topNum + 1 < tableData.length && temp[topNum][index] !== "")
			topNum++;
		let topEmp = topNum;
		while (topEmp + 1 < tableData.length && temp[topEmp][index] === "")
			topEmp++;
		let temp1 = temp.splice(topNum, topEmp - topNum);
		temp = temp.concat(temp1);
		for (let i = 0; i < temp.length; i++) {
			temp[i][0] = i + 1;
		}
		setTableData(tableData.slice(0, 1).concat(temp));
	}

	return (
		<div className="spreadsheet">
			<div className="spreadsheet-control">
				<div>
					<span>行数：</span>
					<input
						type="number"
						value={rows}
						min="4"
						max="50"
						onChange={(e) => {
							setRows(Number(e.target.value));
							// resizeRows(Number(e.target.value));
						}}
						style={{ marginRight: "10px" }}
					/>
					<span>列数：</span>
					<input
						type="number"
						value={cols}
						min="4"
						max="26"
						onChange={(e) => {
							setCols(Number(e.target.value));
							// resizeCols(Number(e.target.value));
						}}
						style={{ marginRight: "10px" }}
					/>
					<button
						onClick={() => {
							resize();
						}}
					>
						更改
					</button>
				</div>
				<div style={{ marginTop: "10px" }}>
					<span>排序：</span>
					{/* <input
						type="number"
						value={rows}
						min="4"
						max="50"
						onChange={(e) => {
							setRows(Number(e.target.value));
							// resizeRows(Number(e.target.value));
						}}
						style={{ marginRight: "10px" }}
					/>
					<span style={{ marginRight: "10px" }}>列</span> */}
					<button
						style={{ marginRight: "10px" }}
						onClick={() => {
							if (activeProps.col > 0)
								ascendingSort(activeProps.col);
						}}
					>
						升序
					</button>
					<button
						style={{ marginRight: "10px" }}
						onClick={() => {
							if (activeProps.col > 0)
								descendingSort(activeProps.col);
						}}
					>
						降序
					</button>
				</div>
			</div>

			<div
				className="spreadsheet-table"
				onScroll={updateActiveProps}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
				onMouseMove={handleMouseMove}
			>
				<table ref={tableRef}>
					{tableData.map((item, index) => (
						<tr key={index}>
							{index === 0
								? item.map((_item, _index) => (
										<th key={_index}>
											{tableData[index][_index]}
										</th>
								  ))
								: item.map((_item, _index) =>
										_index === 0 ? (
											<th key={_index}>
												{tableData[index][_index]}
											</th>
										) : (
											<td
												onMouseDown={() => {
													if (
														activeProps.row !==
															index ||
														activeProps.col !==
															_index
													)
														clickCell(
															index,
															_index
														); // 点击了新的位置
												}}
												key={_index}
											>
												{tableData[index][_index]}
											</td>
										)
								  )}
						</tr>
					))}
				</table>

				<ActiveCell
					hidden={!selected}
					left={activeProps.left}
					top={activeProps.top}
					height={activeProps.height}
					width={activeProps.width}
					value={activeProps.value}
					lastRow={activeProps.lastRow}
					lastCol={activeProps.lastCol}
					trigger={activeProps.trigger}
					updateCallback={input}
				/>

				<SelectRect
					hidden={!drugSelected}
					left={selectProps.left}
					top={selectProps.top}
					height={selectProps.height}
					width={selectProps.width}
					border={selectProps.border}
				/>
			</div>
		</div>
	);
}
