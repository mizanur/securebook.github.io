import { h } from "preact";
import "@styles/Logo.scss";
import logoImg from "@assets/original/logo.svg";

export function Logo() {
	return <img className="Logo" src={logoImg}></img>;
}