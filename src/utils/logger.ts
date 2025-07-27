import * as vscode from 'vscode'

export class Logger {
  private static outputChannel: vscode.OutputChannel

  public static initialize() {
    if (!Logger.outputChannel) {
      Logger.outputChannel = vscode.window.createOutputChannel('Commit Assistant')
    }
  }

  public static log(message: string) {
    Logger.outputChannel.appendLine(message)
  }

  public static info(message: string) {
    Logger.log(`[INFO] ${new Date().toISOString()}: ${message}`)
  }

  public static warn(message: string) {
    Logger.log(`[WARN] ${new Date().toISOString()}: ${message}`)
  }

  public static error(message: string) {
    Logger.log(`[ERROR] ${new Date().toISOString()}: ${message}`)
  }

  public static debug(title: string, data: any) {
    const timestamp = new Date().toISOString()
    const message = `
==================== DEBUG: ${title} (${timestamp}) ====================
${JSON.stringify(data, null, 2)}
======================================================================
`
    console.log(message)
  }

  public static debugToOutputChannel(title: string, data: any, settings: any) {
    if (settings?.debug) {
      const message = `
--- DEBUG: ${title} ---
${JSON.stringify(data, null, 2)}
--------------------
`
      Logger.outputChannel.appendLine(message)
    }
  }
}
