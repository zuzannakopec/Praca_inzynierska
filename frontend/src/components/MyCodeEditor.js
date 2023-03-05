/*import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeyboard } from '@react-native-community/hooks';
import CodeEditor, { CodeEditorSyntaxStyles } from '@rivascva/react-native-code-editor';
import CodeEditorWithForwardRef from "@rivascva/react-native-code-editor/lib/typescript/CodeEditor";

const MyCodeEditor = () => {
    const keyboard = useKeyboard();
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView>
            <CodeEditor
                style={{
                    ...{
                        fontSize: 20,
                        inputLineHeight: 26,
                        highlighterLineHeight: 26,
                    },
                    ...(keyboard.keyboardShown
                        ? { marginBottom: keyboard.keyboardHeight - insets.bottom }
                        : {}),
                }}
                language="javascript"
                syntaxStyle={CodeEditorSyntaxStyles.github}
                showLineNumbers
            />
        </SafeAreaView>
    );
};

export default MyCodeEditor;*/