# Translator Extension for Visual Studio Code

This Visual Studio Code extension enhances your coding experience by providing language translation capabilities using a Large Language Model (LLM). It allows you to seamlessly translate text within the editor environment.

## Features

- **Translation of Selected Text**: Translate text directly from your code editor.
- **Dynamic Language Selection**: Easily switch between source and target languages.
- **Output and Status Updates**: Visual feedback through status bar updates and output channel.

## Installation

You can install the Translator extension directly from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=your-extension-name).

## Usage

### Setting Up

1. Install the extension.
2. Configure your settings by navigating to **File > Preferences > Settings** and searching for **Translator**.

### Using the Extension

1. **Select Text**: Highlight the text you want to translate.
2. **Command Palette**: Open the command palette (Ctrl/Cmd + Shift + P) and search for **Translate**.
3. **Translate**: Choose the appropriate translation command based on your settings.


### Configuration

Modify `settings.json` to customize the extension behavior and settings:

```json
{
  "translator.sourceLanguage": "en",
  "translator.targetLanguage": "fr"
}
```

## Contributing

Contributions are welcome! Please fork the repository, make your changes, and submit a pull request.

## License

This extension is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

