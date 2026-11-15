/*
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { BrowserWindow, nativeTheme } from 'electron'
import { getAppConfig, onAppConfigChange } from './AppConfig.ts'
import { resolveMainBackground } from '../shared/themeColors.js'

let windowBackgroundListenersReady = false

onAppConfigChange('theme', () => {
	applyTheme()
	if (windowBackgroundListenersReady) {
		applyWindowBackgrounds()
	}
})

/**
 * Register native theme listeners after AppConfig is loaded.
 * Must not run at import time — nativeTheme may emit before config init.
 */
export function initWindowBackgroundHandling() {
	if (windowBackgroundListenersReady) {
		return
	}
	windowBackgroundListenersReady = true

	nativeTheme.on('updated', () => {
		if (getAppConfig('theme') === 'default') {
			applyWindowBackgrounds()
		}
	})
}

/**
 * Apply the application theme based on the AppConfig
 */
export function applyTheme() {
	const theme = getAppConfig('theme')

	// TODO: add high-contrast themes
	const configToNativeTheme = {
		default: 'system',
		dark: 'dark',
		light: 'light',
		breezetwilight: 'light',
	} as const

	nativeTheme.themeSource = configToNativeTheme[theme]
}

/**
 * Electron paints the native window background during resize before the renderer catches up.
 * Keep it aligned with the active theme to avoid Nextcloud-blue halos.
 */
export function getWindowBackgroundColor() {
	try {
		const theme = getAppConfig('theme')
		return resolveMainBackground(theme, nativeTheme.shouldUseDarkColors)
	} catch {
		return resolveMainBackground('breezetwilight', nativeTheme.shouldUseDarkColors)
	}
}

export function applyWindowBackgrounds() {
	const color = getWindowBackgroundColor()
	for (const browserWindow of BrowserWindow.getAllWindows()) {
		browserWindow.setBackgroundColor(color)
	}
}
