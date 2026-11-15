/**
 * SPDX-FileCopyrightText: 2026 Engawa custom build
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/** @type {Record<'light'|'dark'|'breezetwilight', string>} */
const THEME_MAIN_BACKGROUNDS = {
	light: '#ffffff',
	dark: '#171717',
	breezetwilight: '#fcfcfc',
}

/**
 * @param {'light'|'dark'|'default'|'breezetwilight'} theme
 * @param {boolean} [prefersDark]
 * @return {string}
 */
function resolveMainBackground(theme, prefersDark = false) {
	if (theme === 'default') {
		return prefersDark ? THEME_MAIN_BACKGROUNDS.dark : THEME_MAIN_BACKGROUNDS.light
	}
	return THEME_MAIN_BACKGROUNDS[theme]
}

export {
	THEME_MAIN_BACKGROUNDS,
	resolveMainBackground,
}