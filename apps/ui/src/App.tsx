import { useState } from "react";
import styles from "./app.module.css";

function App() {
	const [count, setCount] = useState(0);

	return (
		<div className={styles.root}>
			<h1>Vite + React</h1>
			<div className={styles.card}>
				<button onClick={() => setCount((count) => count + 1)} type="button">
					count is {count}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className={styles["read-the-docs"]}>
				Click on the Vite and React logos to learn more
			</p>
		</div>
	);
}

export default App;
