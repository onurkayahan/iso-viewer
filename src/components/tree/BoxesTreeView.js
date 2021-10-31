import { useEffect, useState } from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import StyledTreeItem from './StyledTreeItem';
import { StyledEngineProvider } from '@mui/material/styles';


export default function BoxesTreeView(props) {

   const [boxes, setBoxes] = useState(props.boxes);

   useEffect(() => {
      setBoxes(props.boxes);
   }, [props.boxes])

   function renderChildrenRecursive(box, boxIndex) {
      let children = box.get("children");

      return (
         children && <div key={`${boxIndex}-children`}>
            {
               children.map((childBox, index) => (
                  <StyledTreeItem
                     key={`${boxIndex}-${index}`}
                     nodeId={`${boxIndex}-${index}`}
                     label={childBox.get("type")}
                     onClick={() => {
                        props.handleTreeNodeClick(childBox)
                     }}>
                     {
                        renderChildrenRecursive(childBox, index)
                     }
                  </StyledTreeItem>
               ))
            }
         </div>
      )
   }


   return (
      <StyledEngineProvider injectFirst>
         <TreeView
            aria-label="iso-viewer-tree"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{ width: 500, height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto', backgroundColor: "white", color: "black" }}
         >
            {boxes.map((box, index) => {
               return (
                  <StyledTreeItem
                     rootNode
                     key={index}
                     nodeId={index + ""}
                     label={box.get("type")}
                     onClick={() => {
                        props.handleTreeNodeClick(box)
                     }}>
                     {
                        renderChildrenRecursive(box, index)
                     }
                  </StyledTreeItem>
               )
            })
            }
         </TreeView>
      </StyledEngineProvider>
   );
}
