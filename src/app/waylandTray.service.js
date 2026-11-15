/**
 * SPDX-FileCopyrightText: 2026 Engawa custom build
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

const { isLinux, isWayland } = require('./system.utils.ts')

/**
 * KDE/Wayland: Electron tray activation cannot restore a minimized window.
 * @see https://github.com/electron/electron/issues/43709
 */
function isLinuxWayland() {
	return isLinux && isWayland
}

/**
 * Close-to-tray: hide and drop the taskbar entry.
 *
 * @param {import('electron').BrowserWindow} browserWindow
 */
function hideToTray(browserWindow) {
	if (!browserWindow || browserWindow.isDestroyed()) {
		return
	}

	if (isLinuxWayland()) {
		browserWindow.setSkipTaskbar(true)
	}

	if (browserWindow.isMinimized()) {
		browserWindow.restore()
	}

	browserWindow.hide()
}

/**
 * Prepare a window for showing again after close-to-tray hide.
 *
 * @param {import('electron').BrowserWindow} browserWindow
 */
function showFromTray(browserWindow) {
	if (!browserWindow || browserWindow.isDestroyed() || !isLinuxWayland()) {
		return
	}

	browserWindow.setSkipTaskbar(false)
}

/**
 * KDE Wayland: un-minimize via tray by cycling visibility.
 * Keeps the taskbar entry — unlike intercepting the minimize button.
 *
 * @param {import('electron').BrowserWindow} browserWindow
 * @param {() => void} [afterShow]
 * @return {boolean} Whether a Wayland minimized restore was started
 */
function restoreMinimizedFromTray(browserWindow, afterShow) {
	if (!browserWindow || browserWindow.isDestroyed() || !isLinuxWayland() || !browserWindow.isMinimized()) {
		return false
	}

	browserWindow.setSkipTaskbar(false)
	browserWindow.restore()
	browserWindow.hide()

	setImmediate(() => {
		if (browserWindow.isDestroyed()) {
			return
		}

		browserWindow.show()
		afterShow?.()
	})

	return true
}

module.exports = {
	hideToTray,
	showFromTray,
	restoreMinimizedFromTray,
	isLinuxWayland,
}