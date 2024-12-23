import "./App.css"
import Header from "./components/Header"
import Content from "./components/Content"
import Cart from "./components/Cart"
import { CartProvider } from "./components/context/cartProvider"

function App() {
	return (
		<CartProvider>
			<div className="flex flex-col grow">
				<Header />
				<Content />
				{/* bottom cart affix (wrapper) */}
				<Cart />
			</div>
		</CartProvider>
	)
}

export default App
