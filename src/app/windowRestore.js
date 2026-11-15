/**
 * SPDX-FileCopyrightText: 2026 Engawa custom build
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

const { app } = require('electron')
const { isLinux } = require('./system.utils.ts')
const { restoreMinimizedFromTray, showFromTray } = require('./waylandTray.service.js')

/**
 * @param {import('electron').BrowserWindow} browserWindow
 */
function focusLinuxWindow(browserWindow) {
	browserWindow.setVisibleOnAllWorkspaces(false)
	// Brief always-on-top is a reliable way to steal focus on Plasma.
	browserWindow.setAlwaysOnTop(true, 'pop-up-menu')
	app.focus({ steal: true })
	browserWindow.focus()
	browserWindow.moveTop()
	browserWindow.setAlwaysOnTop(false)
}

/**
 * Bring a BrowserWindow back from tray hide or taskbar minimize.
 *
 * @param {import('electron').BrowserWindow | null | undefined} browserWindow
 */
function restoreBrowserWindow(browserWindow) {
	if (!browserWindow || browserWindow.isDestroyed()) {
		return
	}

	showFromTray(browserWindow)

	if (restoreMinimizedFromTray(browserWindow, () => {
		if (isLinux) {
			focusLinuxWindow(browserWindow)
		} else {
			browserWindow.focus()
		}
	})) {
		return
	}

	if (browserWindow.isMinimized()) {
		browserWindow.restore()
	}

	if (isLinux) {
		// KDE/Wayland: nudge the compositor before show/focus.
		browserWindow.setVisibleOnAllWorkspaces(true, {
			visibleOnFullScreen: true,
			skipTransformProcessType: true,
		})
	}

	browserWindow.show()

	if (isLinux) {
		focusLinuxWindow(browserWindow)
	} else {
		browserWindow.focus()
	}
}

module.exports = {
	restoreBrowserWindow,
}