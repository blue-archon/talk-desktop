/**
 * SPDX-FileCopyrightText: 2026 Engawa custom build
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/** @type {() => void} */
let restoreHandler = () => {}

/**
 * Register the main-process handler that restores the Talk window from the tray.
 *
 * @param {() => void} handler
 */
function setTrayRestoreHandler(handler) {
	restoreHandler = handler
}

function restoreFromTray() {
	restoreHandler()
}

module.exports = {
	setTrayRestoreHandler,
	restoreFromTray,
}