import SyntaxHighlighter from 'react-native-syntax-highlighter';

const PythonCodeFormatter = (props) => {
  return <SyntaxHighlighter 
  	language={"python"}
  	highlighter={"prism" || "hljs"}
  >
  	{props.text}
  </SyntaxHighlighter>;  
}

export default PythonCodeFormatter;