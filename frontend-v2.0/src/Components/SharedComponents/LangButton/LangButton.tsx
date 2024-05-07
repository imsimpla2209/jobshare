/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function LangButton() {

	const { i18n, t } = useTranslation(['main']);
	let lang = i18n.language;
	useEffect(() => {
		i18n.changeLanguage(lang);
	}, []);

	const change = () => {
		lang === "en"
			? lang = 'vi'
			: lang = "en";
		i18n.changeLanguage(lang);
		localStorage.setItem("lang", JSON.stringify(lang));
		// window.location.reload();
	}

	return (
		<Link
			className="btn btn-warning"
			style={{ width: "70px", position: "fixed", top: "50%", transform: "translateY(-50%)", zIndex: "99999" }}
			onClick={change} to={''}		>
			{lang === 'vi' ? "en" : 'vi'}
		</Link>
	)
}
