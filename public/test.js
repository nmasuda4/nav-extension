const e = React.createElement;
const useState = React.useState;
const useEffect = React.useEffect;
const { Tree } = antd;
const { TreeNode } = Tree;

const Config = () => {
  const [gData, setGData] = useState();

  return (
    <Tree className="draggable-tree" draggable blockNode>
      <TreeNode />
    </Tree>
  );
};

const domContainer = document.querySelector("#config_container");
ReactDOM.render(e(Config), domContainer);
