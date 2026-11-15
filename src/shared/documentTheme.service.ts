/*
 * SPDX-FileCopyrightText: 2026 Engawa custom build
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { AppConfig } from '../app/AppConfig.ts'
import { getAppConfig } from './appConfig.service.ts'
import { applyBodyThemeAttrs } from './theme.utils.js'

/**
 * Apply the configured document theme to <body> and keep it in sync.
 */
export function initDocumentTheme() {
	applyBodyThemeAttrs(getAppConfig().theme)

	window.TALK_DESKTOP.onAppConfigChange((event, { key, value }) => {
		if (key === 'theme') {
			applyBodyThemeAttrs(value as AppConfig['theme'])
		}
	})
}