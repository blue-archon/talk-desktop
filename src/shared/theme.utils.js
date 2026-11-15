/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

const THEME_DATASET_KEYS = [
	'themeLight',
	'themeDark',
	'themeDefault',
	'themeBreezetwilight',
]

/**
 * @return {boolean}
 */
export function prefersDark() {
	return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * @param {'light'|'dark'|'default'|'breezetwilight'} theme - Theme name
 */
export function applyBodyThemeAttrs(theme = 'default') {
	for (const element of [document.documentElement, document.body]) {
		for (const key of THEME_DATASET_KEYS) {
			delete element.dataset[key]
		}
		delete element.dataset.themes
	}

	if (theme === 'default') {
		document.body.dataset.themes = 'default'
		document.documentElement.dataset.themes = 'default'
		return
	}

	if (theme === 'breezetwilight') {
		document.body.dataset.themeBreezetwilight = ''
		document.body.dataset.themes = 'breezetwilight'
		document.documentElement.dataset.themeBreezetwilight = ''
		document.documentElement.dataset.themes = 'breezetwilight'
		return
	}

	const attr = `theme${theme[0].toUpperCase() + theme.substring(1)}`
	document.body.dataset[attr] = ''
	document.body.dataset.themes = theme
	document.documentElement.dataset[attr] = ''
	document.documentElement.dataset.themes = theme
}