/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

const { app, Tray, Menu } = require('electron')
const path = require('node:path')
const { getTrayIcon } = require('../shared/icons.utils.js')
const { isLinux } = require('./system.utils.ts')
const { registerTray } = require('./trayBadge.service.js')
const { restoreFromTray } = require('./trayRestore.service.js')
const { hideToTray } = require('./waylandTray.service.js')

let isAppQuitting = false

/**
 * Allow quitting the app if requested. It minimizes to a tray otherwise.
 */
app.on('before-quit', () => {
	isAppQuitting = true
})

/**
 * Setup tray with an icon that provides a context menu.
 *
 * @param {import('electron').BrowserWindow} browserWindow Browser window, associated with the tray
 * @return {import('electron').Tray} Tray instance
 */
function setupTray(browserWindow) {
	const icon = path.resolve(__dirname, getTrayIcon())
	const tray = new Tray(icon)
	tray.setToolTip(app.name)

	// Defer one tick — KDE StatusNotifierItem activation can race window manager focus.
	const restore = () => setImmediate(restoreFromTray)

	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'Open',
			click: restore,
		},
		{
			role: 'quit',
		},
	])

	tray.setContextMenu(contextMenu)
	tray.on('click', restore)
	tray.on('double-click', restore)

	// Plasma sometimes maps another button to activation; cover middle-click too.
	if (isLinux) {
		tray.on('middle-click', restore)
	}

	browserWindow.on('close', (event) => {
		if (!isAppQuitting) {
			event.preventDefault()
			hideToTray(browserWindow)
		}
	})

	browserWindow.on('closed', () => {
		tray.destroy()
	})

	registerTray(tray)

	return tray
}

module.exports = {
	setupTray,
}