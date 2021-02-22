import { useRef, useState } from "react";
import ActiveCell from "./ActiveCell";

export default function MySpreadsheet() {
	const [rows, setRows] = useState(6); // 行数
	const [cols, setCols] = useState(8); // 列数
	const [tableRows, setTableRows] = useState(6); // 行数
	const [tableCols, setTableCols] = useState(8); // 列数
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
	}); // 选中表格后的active cell参数

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
		// console.log(
		// 	tableRef.current.rows[row].cells[col].getClientRects()[0].x,
		// 	tableRef.current.rows[row].cells[col].getClientRects()[0].y
		// );
		setActiveProps({
			...activeProps,
			width: tableRef.current.rows[row].cells[col].offsetWidth + "px",
			height: tableRef.current.rows[row].cells[col].offsetHeight + "px",
			left:
				tableRef.current.rows[row].cells[col].getClientRects()[0].x +
				"px",
			top:
				tableRef.current.rows[row].cells[col].getClientRects()[0].y +
				"px",
			lastRow: activeProps.row,
			lastCol: activeProps.col,
			value: tableRef.current.rows[row].cells[col].innerText,
			row: row,
			col: col,
		}); //根据table中的具体元素位置和大小设定active cell 的位置大小
	}

	return (
		<div className="spreadsheet">
			<div className="spreadsheet-control">
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

			<div className="spreadsheet-table">
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
												onClick={() =>
													clickCell(index, _index)
												}
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
					updateCallback={input}
				/>
			</div>
		</div>
	);
}
