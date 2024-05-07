import 'flag-icons/css/flag-icons.min.css';
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import store from "./Store/store";
import "./i18n";
import "react-alice-carousel/lib/alice-carousel.css"
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
	<Provider store={store}>
		<App />
	</Provider>
);
