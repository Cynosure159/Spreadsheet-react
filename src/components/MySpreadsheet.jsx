import { useState } from "react";

export default function MySpreadsheet(params) {
	const [rows, setRows] = useState(6);
	const [cols, setCols] = useState(8);

	return (
		<div>
			<div>
				<span>行数：</span>
				<input type="number" value={rows} />
				<span>列数：</span>
				<input type="number" value={cols} />
			</div>
			<div></div>
		</div>
	);
}
