/**
 * SPDX-FileCopyrightText: 2026 Engawa custom build
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

const { app } = require('electron')
const path = require('node:path')
const { isLinux } = require('./system.utils.ts')
const { getTrayIconPath } = require('../shared/icons.utils.js')

/** @type {import('electron').Tray | null} */
let trayRef = null
let lastCount = 0

/**
 * @param {import('electron').Tray} tray
 */
function registerTray(tray) {
	trayRef = tray
	updateTrayBadge(lastCount)
}

/**
 * Show an orange attention marker on the tray icon when there is unread activity.
 *
 * @param {number} count
 */
function updateTrayBadge(count) {
	lastCount = Math.max(0, Number(count) || 0)
	app.setBadgeCount(lastCount)

	if (!trayRef || trayRef.isDestroyed() || !isLinux) {
		return
	}

	trayRef.setImage(path.resolve(__dirname, getTrayIconPath({ attention: lastCount > 0 })))
	const label = lastCount > 0
		? `${app.name} — ${lastCount} unread`
		: app.name
	trayRef.setToolTip(label)
}

module.exports = {
	registerTray,
	updateTrayBadge,
}