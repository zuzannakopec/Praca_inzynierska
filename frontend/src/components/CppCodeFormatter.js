import SyntaxHighlighter from 'react-native-syntax-highlighter';

const CppCodeFormatter = (props) => {
  const codeString = "int main()";
  return <SyntaxHighlighter 
  	language={"cpp"}
  	highlighter={"prism" || "hljs"}
  >
  	{props.text}
  </SyntaxHighlighter>;  
}

export default CppCodeFormatter;