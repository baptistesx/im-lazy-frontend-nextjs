import { ReactElement } from "react";

export type DrawerItem = {
	route: string;
	icon: ReactElement;
	title: string;
	children?: DrawerItem[];
};

export const DRAWER_WIDTH = 240;
