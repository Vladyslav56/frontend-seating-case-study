import "./App.css"
import Header from "./components/Header"
import Content from "./components/Content"
import Cart from "./components/Cart"

function App() {
	return (
		<div className="flex flex-col grow">
			<Header />
			<Content />
			{/* bottom cart affix (wrapper) */}
			<Cart />
		</div>
	)
}

export default App
