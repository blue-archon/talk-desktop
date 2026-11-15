/*!
 * SPDX-FileCopyrightText: 2026 Engawa custom build
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Migration } from '../migration.service.ts'
import { getAppConfig, setAppConfig } from '../AppConfig.ts'

/**
 * First-time adopters of the Engawa package: prefer Breeze Twilight over stock default.
 */
export const breezeTwilightThemeMigration: Migration = {
	name: '02-breezeTwilightTheme',
	onUpgrade: true,
	validator: () => getAppConfig('theme') === 'default',
	up() {
		setAppConfig('theme', 'breezetwilight')
	},
}