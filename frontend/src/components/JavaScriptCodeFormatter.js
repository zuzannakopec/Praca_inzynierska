import SyntaxHighlighter from 'react-native-syntax-highlighter';

const JavaScriptCodeFormatter = (props) => {
  return <SyntaxHighlighter 
  	language={"javascript"}
  	highlighter={"prism" || "hljs"}
  >
  	{props.text}
  </SyntaxHighlighter>;  
}

export default JavaScriptCodeFormatter;