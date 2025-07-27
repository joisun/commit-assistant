import * as vscode from 'vscode'

interface AllSettings {
  debug?: boolean
  // other settings...
}

export class Logger {
  private static outputChannel: vscode.OutputChannel
  private static context: vscode.ExtensionContext

  public static initialize(context: vscode.ExtensionContext) {
    Logger.context = context
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
    const message = `[DEBUG CONSOLE] ${title} (${timestamp}):\n${JSON.stringify(data, null, 2)}`
    console.log(message)
  }

  public static debugToOutputChannel(title: string, data: any) {
    if (!Logger.context) {
      console.log('Logger not initialized with context. Cannot read debug setting.')
      return
    }
    const settings = Logger.context.globalState.get<AllSettings>('aiSettings')
    if (settings?.debug) {
      const message = `[DEBUG] ${new Date().toISOString()} ${title}:\n${JSON.stringify(data, null, 2)}`
      Logger.outputChannel.appendLine(message)
    }
  }
}
